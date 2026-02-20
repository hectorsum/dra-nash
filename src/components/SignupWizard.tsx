'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check } from 'lucide-react';
import Link from 'next/link';
import DatePicker from '@/components/DatePicker';

interface FormData {
  // Step 1: Datos
  documentType: string;
  documentNumber: string;
  birthDate: string;
  termsAccepted: boolean;
  dataUsageAccepted: boolean;
  
  // Step 2: Personal
  firstName: string;
  paternalSurname: string;
  maternalSurname: string;
  gender: string;
  country: string;
  address: string;
  
  // Step 3: Seguridad
  email: string;
  phoneCountryCode: string;
  phone: string;
  password: string;
  passwordConfirm: string;
}

const STEPS = [
  { number: 1, label: 'Datos' },
  { number: 2, label: 'Personal' },
  { number: 3, label: 'Seguridad' },
];

export default function SignupWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<FormData>({
    documentType: 'DNI',
    documentNumber: '',
    birthDate: '',
    termsAccepted: false,
    dataUsageAccepted: false,
    firstName: '',
    paternalSurname: '',
    maternalSurname: '',
    gender: '',
    country: '',
    address: '',
    email: '',
    phoneCountryCode: '+51',
    phone: '',
    password: '',
    passwordConfirm: '',
  });

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Password validation
  const passwordRequirements = {
    minLength: formData.password.length >= 8 && formData.password.length <= 12,
    hasLower: /[a-z]/.test(formData.password),
    hasUpper: /[A-Z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.documentType || !formData.documentNumber || !formData.birthDate) {
        setError('Por favor completa todos los campos');
        return false;
      }
      if (!formData.termsAccepted) {
        setError('Debes aceptar los Términos y Condiciones');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.firstName || !formData.paternalSurname || !formData.maternalSurname) {
        setError('Por favor completa todos los campos de nombre');
        return false;
      }
      if (!formData.gender || !formData.country || !formData.address) {
        setError('Por favor completa todos los campos');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.email || !formData.phone || !formData.password || !formData.passwordConfirm) {
        setError('Por favor completa todos los campos');
        return false;
      }
      if (!isPasswordValid) {
        setError('La contraseña no cumple con todos los requisitos');
        return false;
      }
      if (formData.password !== formData.passwordConfirm) {
        setError('Las contraseñas no coinciden');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/patient/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Error al crear cuenta');
      }
    } catch (err) {
      setError('Error al crear cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#071535] mb-2">
            Únete a Nosotros
          </h1>
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-[#071535] hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* Stepper */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <div className="mb-12">
            {/* Circles and Lines */}
            <div className="relative flex justify-between items-center mb-2">
              {STEPS.map((step, index) => (
                <React.Fragment key={index}>
                  {/* Circle */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold z-10 ${
                      step.number < currentStep
                        ? 'bg-[#071535]'
                        : step.number === currentStep
                        ? 'bg-[#071535]'
                        : 'bg-gray-300'
                    }`}
                  >
                    {step.number < currentStep ? <Check size={20} /> : step.number}
                  </div>
                  
                  {/* Line between circles */}
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 h-1 mx-4">
                      <div className={`h-full ${step.number < currentStep ? 'bg-[#071535]' : 'bg-gray-300'}`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            
            {/* Labels */}
            <div className="flex justify-between">
              {STEPS.map((step) => (
                <div key={`label-${step.number}`} className="w-12 text-center">
                  <span className={`text-sm ${step.number <= currentStep ? 'text-[#071535]' : 'text-gray-400'}`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Datos */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#071535] mb-6">Identificación</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Tipo de Documento</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => updateField('documentType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                  >
                    <option value="DNI">DNI</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Carnet de Extranjería">Carnet de Extranjería</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Número de Documento</label>
                  <input
                    type="text"
                    value={formData.documentNumber}
                    onChange={(e) => updateField('documentNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                    placeholder="74710901"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">Fecha de Nacimiento</label>
                <DatePicker
                  value={formData.birthDate}
                  onChange={(date) => updateField('birthDate', date)}
                  placeholder="dd/mm/yyyy"
                />
              </div>

              <div className="space-y-3 mb-6">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => updateField('termsAccepted', e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#071535] border-gray-300 rounded focus:ring-[#071535]"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto los{' '}
                    <Link href="#" className="text-[#071535] hover:underline">
                      Términos y Condiciones
                    </Link>{' '}
                    y la Política de Privacidad de Datos.
                  </span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={formData.dataUsageAccepted}
                    onChange={(e) => updateField('dataUsageAccepted', e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#071535] border-gray-300 rounded focus:ring-[#071535]"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto el uso de mis datos para fines adicionales (opcional).
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Personal */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#071535] mb-6">Datos Personales</h2>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                  placeholder="Hector"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Apellido Paterno</label>
                  <input
                    type="text"
                    value={formData.paternalSurname}
                    onChange={(e) => updateField('paternalSurname', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                    placeholder="Herrera"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-2">Apellido Materno</label>
                  <input
                    type="text"
                    value={formData.maternalSurname}
                    onChange={(e) => updateField('maternalSurname', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                    placeholder="Herrera"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Sexo</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                >
                  <option value="">Seleccionar</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">País</label>
                <select
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                >
                  <option value="">Seleccionar</option>
                  <option value="Perú">Perú</option>
                  <option value="México">México</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">Domicilio</label>
                <div className="relative">
                  <svg className="absolute left-3 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                    placeholder="Avenida Republica de Panama 5920"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Seguridad */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-[#071535] mb-6">Seguridad</h2>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">País</label>
                  <input
                    type="text"
                    value={formData.phoneCountryCode}
                    onChange={(e) => updateField('phoneCountryCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                    placeholder="+51"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm text-gray-700 mb-2">Celular</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                    placeholder="999 999 999"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="space-y-2 text-sm">
                  <div className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.minLength ? 'bg-green-600' : 'bg-gray-400'}`} />
                    8-12 caracteres
                  </div>
                  <div className={`flex items-center gap-2 ${passwordRequirements.hasLower ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasLower ? 'bg-green-600' : 'bg-gray-400'}`} />
                    1 minúscula
                  </div>
                  <div className={`flex items-center gap-2 ${passwordRequirements.hasUpper ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasUpper ? 'bg-green-600' : 'bg-gray-400'}`} />
                    1 mayúscula
                  </div>
                  <div className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasNumber ? 'bg-green-600' : 'bg-gray-400'}`} />
                    1 número
                  </div>
                  <div className={`flex items-center gap-2 ${passwordRequirements.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                    <div className={`w-2 h-2 rounded-full ${passwordRequirements.hasSpecial ? 'bg-green-600' : 'bg-gray-400'}`} />
                    1 carácter especial
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-700 mb-2">Confirmar Contraseña</label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? 'text' : 'password'}
                    value={formData.passwordConfirm}
                    onChange={(e) => updateField('passwordConfirm', e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#071535] focus:border-transparent text-black"
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Atrás
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-[#071535] text-white rounded-lg hover:bg-[#050c1f] transition-colors flex items-center gap-2"
              >
                Siguiente Paso
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-6 py-3 bg-[#071535] text-white rounded-lg hover:bg-[#050c1f] transition-colors disabled:opacity-50"
              >
                {loading ? 'Creando cuenta...' : 'Confirmar Registro'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
