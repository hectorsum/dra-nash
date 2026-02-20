'use client';

import { useState, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';

interface TimeSlot {
  id?: string;
  doctorId?: string;
  dayOfWeek: number;
  time: string;
  isAvailable: boolean;
}

interface DaySchedule {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breaks: Array<{ start: string; end: string }>;
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

// Generate time options (30-min increments)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 6; hour <= 22; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 22) {
      times.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

// Convert database slots to UI schedule
const slotsToSchedule = (slots: TimeSlot[]): DaySchedule[] => {
  return DAYS_OF_WEEK.map(day => {
    const daySlots = slots.filter(s => s.dayOfWeek === day.value && s.isAvailable);
    
    if (daySlots.length === 0) {
      return {
        dayOfWeek: day.value,
        enabled: false,
        startTime: '09:00',
        endTime: '17:00',
        breaks: [],
      };
    }

    // Sort slots by time
    const sortedTimes = daySlots.map(s => s.time).sort();
    const startTime = sortedTimes[0];
    const endTime = sortedTimes[sortedTimes.length - 1];

    // Detect breaks (gaps in the schedule)
    const breaks: Array<{ start: string; end: string }> = [];
    for (let i = 0; i < sortedTimes.length - 1; i++) {
      const current = sortedTimes[i];
      const next = sortedTimes[i + 1];
      
      // Calculate expected next slot (30 min later)
      const [hour, min] = current.split(':').map(Number);
      const expectedNext = min === 30 
        ? `${(hour + 1).toString().padStart(2, '0')}:00`
        : `${hour.toString().padStart(2, '0')}:30`;
      
      if (next !== expectedNext) {
        breaks.push({ start: current, end: next });
      }
    }

    return {
      dayOfWeek: day.value,
      enabled: true,
      startTime,
      endTime,
      breaks,
    };
  });
};

// Convert UI schedule to database slots
const scheduleToSlots = (schedule: DaySchedule[]): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  
  schedule.forEach(day => {
    if (!day.enabled) return;

    const [startHour, startMin] = day.startTime.split(':').map(Number);
    const [endHour, endMin] = day.endTime.split(':').map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    // Generate all slots from start to end
    while (currentHour < endHour || (currentHour === endHour && currentMin <= endMin)) {
      const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
      
      // Check if this time falls within a break
      const inBreak = day.breaks.some(brk => {
        return timeStr > brk.start && timeStr < brk.end;
      });

      if (!inBreak) {
        slots.push({
          dayOfWeek: day.dayOfWeek,
          time: timeStr,
          isAvailable: true,
        });
      }

      // Increment by 30 minutes
      if (currentMin === 30) {
        currentHour++;
        currentMin = 0;
      } else {
        currentMin = 30;
      }
    }
  });

  return slots;
};

export default function AvailabilityManager({ initialAvailability }: { initialAvailability: TimeSlot[] }) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initialSchedule = slotsToSchedule(initialAvailability);
    setSchedule(initialSchedule);
    
    // Expand enabled days by default
    const enabled = new Set(initialSchedule.filter(d => d.enabled).map(d => d.dayOfWeek));
    setExpandedDays(enabled);
  }, [initialAvailability]);

  const toggleDay = (dayOfWeek: number) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek ? { ...day, enabled: !day.enabled } : day
      )
    );
  };

  const toggleExpanded = (dayOfWeek: number) => {
    setExpandedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dayOfWeek)) {
        newSet.delete(dayOfWeek);
      } else {
        newSet.add(dayOfWeek);
      }
      return newSet;
    });
  };

  const updateDayTime = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day
      )
    );
  };

  const addBreak = (dayOfWeek: number) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, breaks: [...day.breaks, { start: '12:00', end: '13:00' }] }
          : day
      )
    );
  };

  const removeBreak = (dayOfWeek: number, index: number) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? { ...day, breaks: day.breaks.filter((_, i) => i !== index) }
          : day
      )
    );
  };

  const updateBreak = (
    dayOfWeek: number,
    index: number,
    field: 'start' | 'end',
    value: string
  ) => {
    setSchedule(prev =>
      prev.map(day =>
        day.dayOfWeek === dayOfWeek
          ? {
              ...day,
              breaks: day.breaks.map((brk, i) =>
                i === index ? { ...brk, [field]: value } : brk
              ),
            }
          : day
      )
    );
  };

  const applyPreset = (preset: 'weekdays' | 'custom') => {
    if (preset === 'weekdays') {
      setSchedule(prev =>
        prev.map(day => ({
          ...day,
          enabled: day.dayOfWeek >= 1 && day.dayOfWeek <= 5,
          startTime: '09:00',
          endTime: '17:00',
          breaks: [],
        }))
      );
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const slots = scheduleToSlots(schedule);

      const res = await fetch('/api/doctor/availability', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      });

      if (res.ok) {
        setMessage('✓ Disponibilidad actualizada correctamente');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('✗ Error al actualizar disponibilidad');
      }
    } catch (error) {
      setMessage('✗ Error al actualizar disponibilidad');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#071535] mb-2">Gestión de Disponibilidad</h1>
        <p className="text-gray-600">Configura tus horarios de atención semanal</p>
      </div>

      {/* Preset Buttons */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => applyPreset('weekdays')}
          className="px-4 py-2 border border-[#071535] text-[#071535] rounded-lg hover:bg-[#071535] hover:text-white transition-colors"
        >
          Lunes-Viernes 9-5
        </button>
      </div>

      {/* Day Cards */}
      <div className="space-y-3 mb-6">
        {schedule.map(day => {
          const dayInfo = DAYS_OF_WEEK.find(d => d.value === day.dayOfWeek);
          const isExpanded = expandedDays.has(day.dayOfWeek);

          return (
            <div
              key={day.dayOfWeek}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Day Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleExpanded(day.dayOfWeek)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <h3 className="font-semibold text-gray-900">{dayInfo?.label}</h3>
                  {day.enabled && !isExpanded && (
                    <span className="text-sm text-gray-500">
                      {day.startTime} - {day.endTime}
                    </span>
                  )}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={day.enabled}
                    onChange={() => toggleDay(day.dayOfWeek)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#071535]"></div>
                </label>
              </div>

              {/* Expanded Content */}
              {isExpanded && day.enabled && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 bg-gray-50">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de inicio
                      </label>
                      <select
                        value={day.startTime}
                        onChange={e => updateDayTime(day.dayOfWeek, 'startTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-[#000]"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de fin
                      </label>
                      <select
                        value={day.endTime}
                        onChange={e => updateDayTime(day.dayOfWeek, 'endTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-[#000]"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Visual Timeline */}
                  <div className="mb-4">
                    <div className="h-2 bg-gray-200 rounded-full relative overflow-hidden">
                      {(() => {
                        // Calculate timeline segments with breaks
                        const timeToMinutes = (time: string) => {
                          const [hour, min] = time.split(':').map(Number);
                          return hour * 60 + min;
                        };

                        const MIN_TIME = 6 * 60; // 6:00 AM in minutes
                        const MAX_TIME = 22 * 60; // 22:00 PM in minutes
                        const TOTAL_RANGE = MAX_TIME - MIN_TIME; // 16 hours

                        const startMinutes = timeToMinutes(day.startTime);
                        const endMinutes = timeToMinutes(day.endTime);

                        // Create segments split by breaks
                        const segments: Array<{ start: number; end: number }> = [];
                        
                        if (day.breaks.length === 0) {
                          // No breaks - single segment
                          segments.push({ start: startMinutes, end: endMinutes });
                        } else {
                          // Sort breaks by start time
                          const sortedBreaks = [...day.breaks].sort((a, b) => 
                            timeToMinutes(a.start) - timeToMinutes(b.start)
                          );

                          let currentStart = startMinutes;
                          
                          sortedBreaks.forEach(brk => {
                            const breakStart = timeToMinutes(brk.start);
                            const breakEnd = timeToMinutes(brk.end);
                            
                            // Add segment before break
                            if (currentStart < breakStart) {
                              segments.push({ start: currentStart, end: breakStart });
                            }
                            
                            currentStart = breakEnd;
                          });

                          // Add final segment after last break
                          if (currentStart < endMinutes) {
                            segments.push({ start: currentStart, end: endMinutes });
                          }
                        }

                        // Render each segment as a bar
                        return segments.map((segment, idx) => {
                          const left = ((segment.start - MIN_TIME) / TOTAL_RANGE) * 100;
                          const width = ((segment.end - segment.start) / TOTAL_RANGE) * 100;

                          return (
                            <div
                              key={idx}
                              className="absolute h-full bg-[#071535] rounded-full"
                              style={{
                                left: `${left}%`,
                                width: `${width}%`,
                              }}
                            ></div>
                          );
                        });
                      })()}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>6:00</span>
                      <span>22:00</span>
                    </div>
                  </div>

                  {/* Breaks */}
                  {day.breaks.map((brk, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Descanso:</span>
                      <select
                        value={brk.start}
                        onChange={e => updateBreak(day.dayOfWeek, index, 'start', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded text-[#000]"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <span>-</span>
                      <select
                        value={brk.end}
                        onChange={e => updateBreak(day.dayOfWeek, index, 'end', e.target.value)}
                        className="px-2 py-1 text-sm border border-gray-300 rounded text-[#000]"
                      >
                        {TIME_OPTIONS.map(time => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeBreak(day.dayOfWeek, index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addBreak(day.dayOfWeek)}
                    className="flex items-center gap-1 text-sm text-[#071535] hover:underline"
                  >
                    <Plus size={16} />
                    Agregar descanso
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Messages */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            message.startsWith('✓')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-6 py-3 bg-[#071535] text-white rounded-lg hover:bg-[#050c1f] transition-colors disabled:opacity-50 font-medium"
      >
        {saving ? 'Guardando...' : 'Guardar Cambios'}
      </button>
    </div>
  );
}
