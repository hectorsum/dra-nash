'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar, Stethoscope, FileText, X } from 'lucide-react';

interface Appointment {
  id: string;
  startTime: string;
  service: { name: string };
}

interface ClinicalRecord {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes: string | null;
  appointmentId: string | null;
  appointment: {
    service: { name: string };
  } | null;
}

interface Props {
  patientId: string;
  patientName: string;
  initialRecords: ClinicalRecord[];
  appointments: Appointment[];
}

export default function ClinicalRecordsManager({
  patientId,
  patientName,
  initialRecords,
  appointments,
}: Props) {
  const [records, setRecords] = useState<ClinicalRecord[]>(initialRecords);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ClinicalRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [date, setDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  const [appointmentId, setAppointmentId] = useState('');

  const resetForm = () => {
    setDate('');
    setDiagnosis('');
    setTreatment('');
    setNotes('');
    setAppointmentId('');
    setEditingRecord(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setDate(new Date().toISOString().split('T')[0]);
    setShowForm(true);
  };

  const openEditForm = (record: ClinicalRecord) => {
    setEditingRecord(record);
    setDate(new Date(record.date).toISOString().split('T')[0]);
    setDiagnosis(record.diagnosis);
    setTreatment(record.treatment);
    setNotes(record.notes || '');
    setAppointmentId(record.appointmentId || '');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!diagnosis.trim() || !treatment.trim() || !date) {
      setMessage('✗ Diagnóstico, tratamiento y fecha son requeridos');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const body = {
        patientId,
        date,
        diagnosis: diagnosis.trim(),
        treatment: treatment.trim(),
        notes: notes.trim() || null,
        appointmentId: appointmentId || null,
      };

      let res;
      if (editingRecord) {
        res = await fetch(`/api/clinical-records/${editingRecord.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch('/api/clinical-records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        const savedRecord = await res.json();
        if (editingRecord) {
          setRecords(prev => prev.map(r => (r.id === savedRecord.id ? savedRecord : r)));
        } else {
          setRecords(prev => [savedRecord, ...prev]);
        }
        resetForm();
        setMessage(editingRecord ? '✓ Registro actualizado' : '✓ Registro creado');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('✗ Error al guardar registro');
      }
    } catch {
      setMessage('✗ Error al guardar registro');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
      const res = await fetch(`/api/clinical-records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecords(prev => prev.filter(r => r.id !== id));
        setMessage('✓ Registro eliminado');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      setMessage('✗ Error al eliminar registro');
    }
  };

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="text-[#071535]" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Historial Clínico</h2>
        </div>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 px-4 py-2 bg-[#071535] text-white rounded-lg hover:bg-[#0a1d4a] transition-colors text-sm font-medium"
        >
          <Plus size={16} />
          Nuevo Registro
        </button>
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingRecord ? 'Editar Registro Clínico' : 'Nuevo Registro Clínico'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-[#000]"
                />
              </div>

              {/* Linked Appointment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cita Relacionada (opcional)
                </label>
                <select
                  value={appointmentId}
                  onChange={e => setAppointmentId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-[#000]"
                >
                  <option value="">Sin cita relacionada</option>
                  {appointments.map(apt => (
                    <option key={apt.id} value={apt.id}>
                      {new Date(apt.startTime).toLocaleDateString('es-MX', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      — {apt.service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Diagnóstico *
                </label>
                <textarea
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  rows={3}
                  placeholder="Describe el diagnóstico del paciente..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-[#000] resize-none"
                />
              </div>

              {/* Treatment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tratamiento *
                </label>
                <textarea
                  value={treatment}
                  onChange={e => setTreatment(e.target.value)}
                  rows={3}
                  placeholder="Describe el tratamiento aplicado..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-[#000] resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Notas adicionales..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-[#000] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-[#071535] text-white rounded-lg hover:bg-[#0a1d4a] transition-colors disabled:opacity-50"
              >
                {saving ? 'Guardando...' : editingRecord ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Records List */}
      {records.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No hay registros clínicos</p>
          <p className="text-gray-400 text-sm mt-1">
            Haz clic en &quot;Nuevo Registro&quot; para agregar el primer registro
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {records.map(record => (
            <div
              key={record.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>
                      {new Date(record.date).toLocaleDateString('es-MX', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {record.appointment && (
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Stethoscope size={12} />
                      {record.appointment.service.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(record)}
                    className="p-1.5 text-gray-400 hover:text-[#071535] hover:bg-gray-100 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-semibold text-[#071535] uppercase tracking-wide mb-1">
                    Diagnóstico
                  </h4>
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{record.diagnosis}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#071535] uppercase tracking-wide mb-1">
                    Tratamiento
                  </h4>
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{record.treatment}</p>
                </div>
                {record.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Observaciones
                    </h4>
                    <p className="text-gray-600 text-sm whitespace-pre-wrap">{record.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
