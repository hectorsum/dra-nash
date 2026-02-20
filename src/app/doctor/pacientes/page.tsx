import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { User, Mail, Phone, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function DoctorPacientesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/login');

  let userId = '';
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    userId = (payload.sub as string) || '';
  } catch (error) {
    redirect('/login');
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    include: {
      appointments: {
        include: {
          patient: {
            include: {
              user: true,
              appointments: {
                where: {
                  doctorId: (await prisma.doctor.findUnique({ where: { userId } }))?.id,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!doctor) redirect('/login');

  // Get unique patients
  const patientsMap = new Map();
  doctor.appointments.forEach((apt) => {
    const patientId = apt.patient.id;
    if (!patientsMap.has(patientId)) {
      patientsMap.set(patientId, {
        patient: apt.patient,
        appointmentCount: apt.patient.appointments.length,
        lastAppointment: apt.patient.appointments
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0],
      });
    }
  });

  const patients = Array.from(patientsMap.values());

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
        <p className="text-gray-600 mt-2">Gestiona la información de tus pacientes</p>
      </div>

      {/* Stats */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-2">
          <User className="text-[#071535]" size={24} />
          <div>
            <p className="text-sm text-gray-600">Total de Pacientes</p>
            <p className="text-2xl font-bold text-[#071535]">{patients.length}</p>
          </div>
        </div>
      </div>

      {/* Patients List */}
      {patients.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
          <User className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No hay pacientes registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(({ patient, appointmentCount, lastAppointment }) => (
            <div
              key={patient.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#071535] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {patient.user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {patient.user.name}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail size={14} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{patient.user.email}</span>
                    </div>
                    {patient.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={14} className="mr-2 flex-shrink-0" />
                        <span>{patient.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2 flex-shrink-0" />
                      <span>{appointmentCount} citas</span>
                    </div>
                  </div>
                  {lastAppointment && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">Última cita:</p>
                      <p className="text-sm text-gray-700">
                        {new Date(lastAppointment.startTime).toLocaleDateString('es-MX', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Link
                  href={`/doctor/pacientes/${patient.id}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#071535] text-white rounded-lg hover:bg-[#0a1d4a] transition-colors text-sm font-medium"
                >
                  <FileText size={16} />
                  Ver Historial Clínico
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
