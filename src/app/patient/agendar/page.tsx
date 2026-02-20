'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Calendar as CalendarIcon, Clock, User2, FileText, Upload, Image as ImageIcon, X } from 'lucide-react';
import DatePicker from '@/components/DatePicker';

interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
}

interface Doctor {
  id: string;
  specialty: string | null;
  user: {
    name: string | null;
  };
}

const STEPS = [
  { number: 1, label: 'Servicio' },
  { number: 2, label: 'Fecha' },
  { number: 3, label: 'Horario' },
  { number: 4, label: 'Comprobante' },
  { number: 5, label: 'Confirmar' },
];

export default function AgendarCitaPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Receipt upload
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string>('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data from APIs
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  // Load services on mount
  useEffect(() => {
    fetchServices();
    fetchDoctors();
  }, []);

  // Load time slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await fetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
        // Auto-select the first (only) doctor
        if (data.length > 0) {
          setSelectedDoctor(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const res = await fetch(`/api/availability/slots?doctorId=${selectedDoctor}&date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        setTimeSlots(data);
      }
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setTimeSlots([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Tipo de archivo no permitido. Usa JPG, PNG o WebP.');
      return;
    }

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    setReceiptFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview('');
    setReceiptUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadReceipt = async (): Promise<string | null> => {
    if (!receiptFile) return null;
    if (receiptUrl) return receiptUrl; // Already uploaded

    setUploadingReceipt(true);
    try {
      const formData = new FormData();
      formData.append('file', receiptFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setReceiptUrl(data.url);
        return data.url;
      } else {
        const data = await res.json();
        setError(data.error || 'Error al subir comprobante');
        return null;
      }
    } catch {
      setError('Error al subir comprobante');
      return null;
    } finally {
      setUploadingReceipt(false);
    }
  };

  const validateStep = () => {
    if (currentStep === 1 && !selectedService) {
      setError('Por favor selecciona un servicio');
      return false;
    }
    if (currentStep === 2 && !selectedDate) {
      setError('Por favor selecciona una fecha');
      return false;
    }
    if (currentStep === 3 && !selectedTime) {
      setError('Por favor selecciona un horario');
      return false;
    }
    if (currentStep === 4 && !receiptFile) {
      setError('Por favor sube tu comprobante de pago');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    setError('');
    if (!validateStep()) return;

    // Upload receipt when moving from step 4 to 5
    if (currentStep === 4 && receiptFile && !receiptUrl) {
      const url = await uploadReceipt();
      if (!url) return; // Upload failed
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedService || !selectedDoctor || !selectedDate || !selectedTime) {
      setError('Faltan datos requeridos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Ensure receipt is uploaded
      let finalReceiptUrl = receiptUrl;
      if (receiptFile && !receiptUrl) {
        const url = await uploadReceipt();
        if (!url) {
          setLoading(false);
          return;
        }
        finalReceiptUrl = url;
      }

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id,
          doctorId: selectedDoctor,
          date: selectedDate,
          time: selectedTime,
          notes,
          paymentReceiptUrl: finalReceiptUrl || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/patient/citas');
        router.refresh();
      } else {
        setError(data.error || 'Error al crear cita');
      }
    } catch (err) {
      setError('Error al crear cita. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#071535] mb-2">Agendar Cita</h1>
          <p className="text-gray-600">Programa tu próxima visita con nosotros</p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="mb-12">
            <div className="relative flex justify-between items-center mb-2">
              {STEPS.map((step, index) => (
                <React.Fragment key={index}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold z-10 text-sm ${
                      step.number < currentStep
                        ? 'bg-[#071535]'
                        : step.number === currentStep
                        ? 'bg-[#071535]'
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.number < currentStep ? <Check size={16} /> : step.number}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-1 mx-2">
                      <div className={`h-full ${step.number < currentStep ? 'bg-[#071535]' : 'bg-gray-300'}`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between">
              {STEPS.map((step) => (
                <div key={`label-${step.number}`} className="w-10 text-center">
                  <span className={`text-xs ${step.number <= currentStep ? 'text-[#071535]' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#071535] mb-6 flex items-center gap-2">
                <FileText size={24} />
                Selecciona un Servicio
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                      selectedService?.id === service.id
                        ? 'border-[#071535] bg-[#071535]/5'
                        : 'border-gray-200 hover:border-[#071535]/30'
                    }`}
                  >
                    <h3 className="font-bold text-lg text-[#071535] mb-2">{service.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock size={16} />
                        {service.duration} min
                      </span>
                      <span className="font-bold text-[#071535]">
                        S/ {Number(service.price).toFixed(2)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Doctor & Date Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#071535] mb-6 flex items-center gap-2">
                <CalendarIcon size={24} />
                Selecciona la Fecha
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de la Cita</label>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="Selecciona una fecha"
                />
              </div>
            </div>
          )}

          {/* Step 3: Time Slot Selection */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#071535] mb-6 flex items-center gap-2">
                <Clock size={24} />
                Horario Disponible
              </h2>
              
              {timeSlots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay horarios disponibles para esta fecha</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-4 border-2 rounded-lg font-medium transition-all hover:shadow-md ${
                        selectedTime === slot
                          ? 'border-[#071535] bg-[#071535] text-white'
                          : 'border-gray-200 hover:border-[#071535]/30 text-gray-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Payment Receipt Upload */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-[#071535] mb-6 flex items-center gap-2">
                <Upload size={24} />
                Comprobante de Pago
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Instrucciones:</strong> Sube una captura de pantalla o foto de tu comprobante de pago. 
                  La doctora revisará el comprobante y confirmará tu cita.
                </p>
              </div>

              {/* Price reminder */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Servicio</p>
                    <p className="font-semibold text-gray-900">{selectedService?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total a pagar</p>
                    <p className="text-2xl font-bold text-[#071535]">S/ {Number(selectedService?.price).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Escanea el código QR para realizar el pago</p>
                <img
                  src="/QR.jpg"
                  alt="Código QR de pago"
                  className="w-48 h-48 object-contain rounded-lg"
                />
              </div>

              {/* Upload area */}
              {receiptPreview ? (
                <div className="relative border-2 border-[#071535] rounded-lg p-4 bg-[#071535]/5">
                  <button
                    onClick={removeReceipt}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                  >
                    <X size={16} />
                  </button>
                  <div className="flex items-center gap-4">
                    <img
                      src={receiptPreview}
                      alt="Comprobante"
                      className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                    />
                    <div>
                      <p className="font-semibold text-[#071535] flex items-center gap-2">
                        <ImageIcon size={18} />
                        {receiptFile?.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {receiptFile && (receiptFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <p className="text-sm text-green-600 mt-2 font-medium">✓ Listo para enviar</p>
                    </div>
                  </div>
                </div>
              ) : (
                <label
                  className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#071535] hover:bg-[#071535]/5 transition-all"
                >
                  <Upload size={48} className="text-gray-400 mb-3" />
                  <p className="text-gray-600 font-medium">Haz clic o arrastra tu comprobante aquí</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG o WebP — Máximo 5MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-[#071535] mb-6 flex items-center gap-2">
                <CalendarIcon size={24} />
                Confirmar Cita
              </h2>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Servicio</p>
                    <p className="font-bold text-[#071535]">{selectedService?.name}</p>
                    <p className="text-sm text-gray-600">{selectedService?.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Doctora</p>
                      <p className="font-semibold text-gray-900">Dra. Nayeli Obergoso</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duración</p>
                      <p className="font-semibold text-gray-900">{selectedService?.duration} minutos</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-MX', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Hora</p>
                      <p className="font-semibold text-gray-900">{selectedTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Precio</p>
                    <p className="font-bold text-xl text-[#071535]">S/ {Number(selectedService?.price).toFixed(2)}</p>
                  </div>

                  {/* Receipt preview in confirmation */}
                  {receiptPreview && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Comprobante de Pago</p>
                      <div className="flex items-center gap-3">
                        <img
                          src={receiptPreview}
                          alt="Comprobante"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <p className="text-sm text-green-600 font-medium">✓ Comprobante adjunto</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas (Opcional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                  rows={3}
                  placeholder="Agrega cualquier información adicional..."
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Nota:</strong> Tu cita quedará en estado <strong>Pendiente</strong> hasta que la doctora confirme tu comprobante de pago.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
              Atrás
              </button>
            )}
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={uploadingReceipt}
                className="ml-auto px-6 py-3 bg-[#071535] text-white rounded-lg hover:bg-[#050c1f] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {uploadingReceipt ? 'Subiendo...' : 'Siguiente'}
                {!uploadingReceipt && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-6 py-3 bg-[#071535] text-white rounded-lg hover:bg-[#050c1f] transition-colors disabled:opacity-50"
              >
                {loading ? 'Agendando...' : 'Confirmar Cita'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
