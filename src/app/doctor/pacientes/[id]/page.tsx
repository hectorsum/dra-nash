import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Phone, MapPin, FileText } from 'lucide-react';
import ClinicalRecordsManager from '@/components/ClinicalRecordsManager';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: patientId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/login');

  let userId = '';
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    userId = (payload.sub as string) || '';
    if (payload.role !== 'DOCTOR') redirect('/login');
  } catch {
    redirect('/login');
  }

  const doctor = await prisma.doctor.findUnique({ where: { userId } });
  if (!doctor) redirect('/login');

  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      user: true,
      appointments: {
        where: { doctorId: doctor.id },
        include: { service: true },
        orderBy: { startTime: 'desc' },
      },
      clinicalRecords: {
        where: { doctorId: doctor.id },
        include: {
          appointment: {
            include: { service: true },
          },
        },
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!patient) redirect('/doctor/pacientes');

  return (
    <div className="p-8">
      {/* Back Button */}
      <Link
        href="/doctor/pacientes"
        className="flex items-center gap-2 text-gray-600 hover:text-[#071535] mb-6 transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Volver a Pacientes</span>
      </Link>

      {/* Patient Info Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-[#071535] rounded-full flex items-center justify-center text-white font-bold text-2xl">
            {patient.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{patient.user.name}</h1>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail size={14} className="mr-2 flex-shrink-0" />
                <span>{patient.user.email}</span>
              </div>
              {patient.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <Phone size={14} className="mr-2 flex-shrink-0" />
                  <span>{patient.phone}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-2 flex-shrink-0" />
                  <span>{patient.address}</span>
                </div>
              )}
            </div>
            <div className="mt-3 flex gap-4">
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm text-blue-700 font-medium">{patient.appointments.length} citas</span>
              </div>
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-sm text-green-700 font-medium">{patient.clinicalRecords.length} registros clínicos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Records */}
      <ClinicalRecordsManager
        patientId={patientId}
        patientName={patient.user.name}
        initialRecords={JSON.parse(JSON.stringify(patient.clinicalRecords))}
        appointments={JSON.parse(JSON.stringify(patient.appointments))}
      />
    </div>
  );
}
