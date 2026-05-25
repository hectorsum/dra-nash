'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface Patient {
  id: string;
  firstName: string | null;
  paternalSurname: string | null;
  maternalSurname: string | null;
  user: {
    name: string;
    email: string;
  };
}

interface Service {
  id: string;
  name: string;
  price: number;
}

interface BudgetItem {
  serviceId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export default function NuevoPresupuestoPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [patientsRes, servicesRes] = await Promise.all([
        fetch('/api/patients'),
        fetch('/api/services')
      ]);

      if (patientsRes.ok && servicesRes.ok) {
        const patientsData = await patientsRes.json();
        const servicesData = await servicesRes.json();
        setPatients(patientsData);
        setServices(servicesData);
      } else {
         setError('Error al cargar datos iniciales. Intente recargar la página.');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === selectedServiceId);
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  const handleAddItem = () => {
    if (!selectedService) return;
    
    const existingItemIndex = items.findIndex(item => item.serviceId === selectedService.id);
    const unitPrice = Number(selectedService.price);
    const qty = Number(quantity);

    if (existingItemIndex >= 0) {
      // Update existing item
      const newItems = [...items];
      newItems[existingItemIndex].quantity += qty;
      newItems[existingItemIndex].subtotal = newItems[existingItemIndex].quantity * unitPrice;
      setItems(newItems);
    } else {
      // Add new item
      setItems([...items, {
        serviceId: selectedService.id,
        name: selectedService.name,
        quantity: qty,
        unitPrice: unitPrice,
        subtotal: qty * unitPrice
      }]);
    }

    // Reset service selection
    setSelectedServiceId('');
    setQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSaveBudget = async () => {
    if (!selectedPatientId) {
      setError('Por favor seleccione un paciente.');
      return;
    }
    if (items.length === 0) {
      setError('El presupuesto debe tener al menos un servicio.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: selectedPatientId,
          items: items.map(i => ({
             serviceId: i.serviceId,
             quantity: i.quantity,
             unitPrice: i.unitPrice,
             subtotal: i.subtotal
          })),
          totalAmount
        }),
      });

      if (response.ok) {
        router.push('/doctor/presupuestos');
      } else {
        const data = await response.json();
        setError(data.error || 'Error al guardar el presupuesto');
        setIsSubmitting(false);
      }
    } catch (err) {
      setError('Error de conexión al guardar.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#071535]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="mb-8">
        <Link href="/doctor/presupuestos" className="inline-flex items-center text-gray-500 hover:text-[#071535] mb-4 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Volver a presupuestos
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Presupuesto</h1>
        <p className="text-gray-500 mt-1">Crea un presupuesto detallado para tu paciente</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Datos del Paciente</h2>
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Paciente <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#071535]/20 focus:border-[#071535] outline-none"
          >
            <option value="">Seleccione un paciente...</option>
            {patients.map(p => {
               const name = p.firstName ? `${p.firstName} ${p.paternalSurname || ''}` : p.user.name;
               return <option key={p.id} value={p.id}>{name} - {p.user.email}</option>;
            })}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Agregar Servicios</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Servicio</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#071535]/20 focus:border-[#071535] outline-none"
            >
              <option value="">Seleccione un servicio...</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} (S/ {Number(s.price).toFixed(2)})</option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#071535]/20 focus:border-[#071535] outline-none"
            />
          </div>
          <button
            onClick={handleAddItem}
            disabled={!selectedServiceId}
            className="bg-[#071535] text-white px-6 py-2.5 rounded-lg hover:bg-[#071535]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Agregar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
           <h2 className="text-lg font-semibold text-gray-900">Detalle del Presupuesto</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#071535] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Descripción</th>
                <th className="px-6 py-3 text-center text-sm font-semibold">Unidades</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Precio Unitario</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Precio Total</th>
                <th className="px-6 py-3 text-center text-sm font-semibold w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay servicios agregados al presupuesto.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 border-r border-gray-200">
                      <p className="font-medium text-gray-900">{item.name}</p>
                    </td>
                    <td className="px-6 py-4 text-center border-r border-gray-200">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right border-r border-gray-200">
                      S/ {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right border-r border-gray-200 font-medium text-gray-900">
                      S/ {item.subtotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {items.length > 0 && (
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right font-bold text-gray-900 text-lg">
                    Total:
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-[#071535] text-xl">
                    S/ {totalAmount.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <button
          onClick={handleSaveBudget}
          disabled={isSubmitting || items.length === 0 || !selectedPatientId}
          className="bg-[#071535] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#071535]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[200px]"
        >
          {isSubmitting ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
               <Save size={20} />
               Guardar y Continuar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
