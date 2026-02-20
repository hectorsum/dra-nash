'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

type Service = {
  id: string;
  name: string;
  duration: number;
  price: string; // Decimal comes as string from JSON often
  description?: string;
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Check for authenticated user
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setPatientDetails({
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
          });
        }
      })
      .catch(err => console.error('Error checking auth:', err));

    // Fetch services
    fetch('/api/services')
      .then((res) => {
          if (!res.ok) throw new Error('Error fetching services');
          return res.json();
      })
      .then((data) => {
        // If DB is empty or error, use mocks for demo
        if (Array.isArray(data) && data.length > 0) {
            setServices(data);
        } else {
             // Fallback mock data if DB is empty
             setServices([
                 { id: '1', name: 'Limpieza Dental', duration: 45, price: '500.00', description: 'Limpieza profunda.' },
                 { id: '2', name: 'Blanqueamiento', duration: 60, price: '2500.00', description: 'Blanqueamiento profesional.' },
                 { id: '3', name: 'Consulta General', duration: 30, price: '300.00', description: 'Diagnóstico inicial.' },
             ]);
        }
      })
      .catch((err) => {
          console.error(err);
          // Fallback mock
          setServices([
             { id: 'mock1', name: 'Consulta General (Demo)', duration: 30, price: '300.00' }
          ]);
      });
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) {
        setLoading(true);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        fetch(`/api/availability?date=${dateStr}&serviceId=${selectedService.id}`)
          .then(res => res.json())
          .then(data => {
             if (data.slots) {
                 setSlots(data.slots);
             } else {
                 // Fallback generator if API fails (e.g. no DB connection)
                 setSlots(['09:00', '10:00', '11:00', '12:00', '16:00', '17:00']);
             }
          })
          .catch(() => {
              setSlots(['09:00', '10:00', '11:00', '12:00', '16:00', '17:00']);
          })
          .finally(() => setLoading(false));
    }
  }, [selectedService, selectedDate]);

  const handleBook = async () => {
      setLoading(true);
      setError('');
      try {
          // Construct start time
          if (!selectedDate || !selectedSlot) return;
          const [hours, minutes] = selectedSlot.split(':').map(Number);
          const startDate = new Date(selectedDate);
          startDate.setHours(hours, minutes, 0, 0);

          const res = await fetch('/api/appointments', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  serviceId: selectedService?.id,
                  startTime: startDate.toISOString(),
                  patientName: patientDetails.name,
                  patientEmail: patientDetails.email,
                  patientPhone: patientDetails.phone,
              }),
          });

          if (!res.ok) {
              const d = await res.json();
              throw new Error(d.error || 'Error creating booking');
          }

          setBookingSuccess(true);
          setStep(4);
      } catch (err: any) {
          setError(err.message || 'Something went wrong');
      } finally {
          setLoading(false);
      }
  };

  if (bookingSuccess) {
      return (
          <div className="max-w-3xl mx-auto py-16 px-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">¡Cita Agendada con Éxito!</h2>
              <p className="text-gray-600 mb-8">
                  Te hemos enviado un correo de confirmación a {patientDetails.email}. Te esperamos el {selectedDate && format(selectedDate, 'dd/MM/yyyy')} a las {selectedSlot}.
              </p>
              <button 
                onClick={() => window.location.href = '/'} 
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-[#050c1f] transition"
              >
                  Volver al Inicio
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-8 text-center">Agendar una Cita</h1>
        
        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
            {[1, 2, 3].map((s) => (
                <div key={s} className={`flex flex-col items-center bg-white px-2`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {s}
                    </div>
                    <span className="text-xs mt-1 text-gray-500 font-medium">
                        {s === 1 ? 'Servicio' : s === 2 ? 'Horario' : 'Datos'}
                    </span>
                </div>
            ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8 min-h-[400px]">
            {step === 1 && (
                <div>
                    <h2 className="text-xl font-bold mb-6">Selecciona un Servicio</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => { setSelectedService(service); setStep(2); }}
                                className="text-left p-6 rounded-lg border-2 hover:border-primary hover:bg-primary/5 transition group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 group-hover:text-primary">{service.name}</h3>
                                    <span className="text-primary font-semibold">${service.price}</span>
                                </div>
                                <p className="text-sm text-gray-500">{service.duration} mins</p>
                                {service.description && <p className="text-sm text-gray-400 mt-2">{service.description}</p>}
                            </button>
                        ))}
                    </div>
                    {services.length === 0 && <p>Cargando servicios...</p>}
                </div>
            )}

            {step === 2 && (
                <div>
                   <button onClick={() => setStep(1)} className="text-sm text-primary hover:underline mb-4">&larr; Volver</button>
                   <h2 className="text-xl font-bold mb-6">Selecciona Fecha y Hora</h2>
                   <div className="flex flex-col md:flex-row gap-8">
                       <div className="flex-1 flex justify-center">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={{ before: new Date() }}
                                locale={es}
                                className="border p-4 rounded-lg shadow-sm"
                            />
                       </div>
                       <div className="flex-1">
                           <h3 className="font-semibold mb-4">Horarios Disponibles {selectedDate ? format(selectedDate, '(dd/MM/yyyy)') : ''}</h3>
                           {!selectedDate && <p className="text-gray-400 text-sm">Selecciona una fecha primero.</p>}
                           {selectedDate && loading && <p className="text-gray-400">Buscando horarios...</p>}
                           {selectedDate && !loading && slots.length === 0 && <p className="text-red-400">No hay horarios disponibles.</p>}
                           <div className="grid grid-cols-3 gap-2">
                               {selectedDate && !loading && slots.map(slot => (
                                   <button
                                      key={slot}
                                      onClick={() => setSelectedSlot(slot)}
                                      className={`py-2 px-3 rounded text-sm font-medium transition ${selectedSlot === slot ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                   >
                                       {slot}
                                   </button>
                               ))}
                           </div>
                           {selectedSlot && (
                               <div className="mt-8">
                                   <button 
                                      onClick={() => setStep(3)}
                                      className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-[#050c1f] transition shadow-lg"
                                    >
                                       Continuar
                                   </button>
                               </div>
                           )}
                       </div>
                   </div>
                </div>
            )}

            {step === 3 && (
                <div>
                    <button onClick={() => setStep(2)} className="text-sm text-primary hover:underline mb-4">&larr; Volver</button>
                    <h2 className="text-xl font-bold mb-6">Tus Datos</h2>
                    <div className="grid gap-6 max-w-lg mx-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                value={patientDetails.name}
                                onChange={e => setPatientDetails({...patientDetails, name: e.target.value})}
                                placeholder="Ej. Juan Pérez"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                value={patientDetails.email}
                                onChange={e => setPatientDetails({...patientDetails, email: e.target.value})}
                                placeholder="juan@ejemplo.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input 
                                type="tel" 
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                                value={patientDetails.phone}
                                onChange={e => setPatientDetails({...patientDetails, phone: e.target.value})}
                                placeholder="55 1234 5678"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                        <div className="mt-6">
                            <button 
                                onClick={handleBook}
                                disabled={loading || !patientDetails.name || !patientDetails.email}
                                className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-[#050c1f] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Procesando...' : 'Confirmar Cita'}
                            </button>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg mt-4 text-sm text-gray-600">
                            <p><strong>Resumen:</strong></p>
                            <p>{selectedService?.name}</p>
                            <p>{selectedDate && format(selectedDate, 'dd/MM/yyyy')} - {selectedSlot}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
