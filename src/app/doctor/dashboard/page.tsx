import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import ForceLogout from '@/components/ForceLogout';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function DoctorDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/login');

  let userId = '';
  let userName = '';

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    userId = (payload.sub as string) || '';
    userName = (payload.name as string) || '';
  } catch (error) {
    redirect('/login');
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId },
    include: {
      appointments: {
        include: {
          service: true,
          patient: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      },
    },
  });

  console.log('DEBUG: userId =', userId);
  console.log('DEBUG: doctor =', doctor ? 'FOUND' : 'NOT FOUND');

// ... imports

  if (!doctor) {
    console.log('DEBUG: No doctor found, rendering ForceLogout');
    return <ForceLogout />;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = doctor.appointments.filter(
    (apt) => apt.startTime >= today && apt.startTime < tomorrow && apt.status !== 'CANCELLED'
  );

  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 7);

  const weekAppointments = doctor.appointments.filter(
    (apt) => apt.startTime >= thisWeekStart && apt.startTime < thisWeekEnd && apt.status !== 'CANCELLED'
  );

  const uniquePatients = new Set(doctor.appointments.map(apt => apt.patientId));
  const totalPatients = uniquePatients.size;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">¡Hola, {userName}!</h1>
        <p className="text-gray-600 mt-2">Panel de control del doctor</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Citas Hoy</p>
              <p className="text-3xl font-bold text-[#071535] mt-1">
                {todayAppointments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Esta Semana</p>
              <p className="text-3xl font-bold text-[#071535] mt-1">
                {weekAppointments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pacientes</p>
              <p className="text-3xl font-bold text-[#071535] mt-1">{totalPatients}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Citas</p>
              <p className="text-3xl font-bold text-[#071535] mt-1">
                {doctor.appointments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Citas de Hoy</h2>
        </div>
        <div className="p-6">
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No hay citas programadas para hoy</p>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {appointment.patient.user.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.service.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {new Date(appointment.startTime).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {' - '}
                      {new Date(appointment.endTime).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.service.duration} min</p>
                  </div>
                  <div className="ml-4">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
