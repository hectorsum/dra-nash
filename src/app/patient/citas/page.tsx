import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar, Clock, User } from 'lucide-react';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function PatientCitasPage() {
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

  const patient = await prisma.patient.findUnique({
    where: { userId },
    include: {
      appointments: {
        include: {
          service: true,
          doctor: { include: { user: true } },
        },
        orderBy: { startTime: 'desc' },
      },
    },
  });

  if (!patient) redirect('/login');

  const upcomingAppointments = patient.appointments.filter(
    (apt) => apt.startTime > new Date() && apt.status !== 'CANCELLED'
  );
  const pastAppointments = patient.appointments.filter(
    (apt) => apt.startTime <= new Date() || apt.status === 'CANCELLED'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Citas</h1>
        <p className="text-gray-600 mt-2">Gestiona tus citas dentales</p>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Próximas Citas</h2>
        {upcomingAppointments.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No tienes citas programadas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.service.name}
                    </h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User size={16} className="mr-2" />
                        <span>{appointment.doctor.user.name}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          {new Date(appointment.startTime).toLocaleDateString('es-MX', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-2" />
                        <span>
                          {new Date(appointment.startTime).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                          {' - '}
                          {new Date(appointment.endTime).toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                    {appointment.notes && (
                      <p className="mt-3 text-sm text-gray-600">{appointment.notes}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Historial de Citas</h2>
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 opacity-75"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {appointment.service.name}
                    </h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User size={16} className="mr-2" />
                        <span>{appointment.doctor.user.name}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          {new Date(appointment.startTime).toLocaleDateString('es-MX')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
