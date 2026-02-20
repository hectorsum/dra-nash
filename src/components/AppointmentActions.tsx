'use client';

import { useState } from 'react';
import { Check, X, Image as ImageIcon, Eye } from 'lucide-react';

interface Appointment {
  id: string;
  status: string;
  paymentReceiptUrl: string | null;
  patient: { user: { name: string } };
  service: { name: string };
}

interface Props {
  appointment: Appointment;
}

export default function AppointmentActions({ appointment }: Props) {
  const [status, setStatus] = useState(appointment.status);
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  if (status !== 'PENDING') {
    return null;
  }

  const updateStatus = async (newStatus: 'CONFIRMED' | 'CANCELLED') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Receipt preview button */}
          {appointment.paymentReceiptUrl && (
            <button
              onClick={() => setShowReceipt(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <Eye size={16} />
              Ver Comprobante
            </button>
          )}

          {!appointment.paymentReceiptUrl && (
            <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
              <ImageIcon size={14} />
              Sin comprobante
            </span>
          )}

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => updateStatus('CONFIRMED')}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Check size={16} />
              Confirmar
            </button>
            <button
              onClick={() => updateStatus('CANCELLED')}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <X size={16} />
              Rechazar
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && appointment.paymentReceiptUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowReceipt(false)}>
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Comprobante de Pago — {appointment.patient.user.name}
              </h3>
              <button onClick={() => setShowReceipt(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={appointment.paymentReceiptUrl}
                alt="Comprobante de pago"
                className="w-full rounded-lg border border-gray-200"
              />
            </div>
            <div className="flex gap-3 p-4 border-t">
              <button
                onClick={() => { updateStatus('CONFIRMED'); setShowReceipt(false); }}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
              >
                <Check size={16} />
                Confirmar Cita
              </button>
              <button
                onClick={() => { updateStatus('CANCELLED'); setShowReceipt(false); }}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                <X size={16} />
                Rechazar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
