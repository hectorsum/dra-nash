import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar, DollarSign, CheckCircle } from 'lucide-react';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function PatientDashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    redirect('/login');
  }

  let userId = '';
  let userName = '';

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    userId = (payload.sub as string) || '';
    userName = (payload.name as string) || '';
  } catch (error) {
    redirect('/login');
  }

  // Get patient data
  const patient = await prisma.patient.findUnique({
    where: { userId },
    include: {
      appointments: {
        include: {
          service: true,
          doctor: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      },
      payments: {
        where: {
          status: 'PENDING',
        },
      },
    },
  });

  if (!patient) {
    redirect('/login');
  }

  const upcomingAppointments = patient.appointments.filter(
    (apt) => apt.startTime > new Date() && apt.status !== 'CANCELLED'
  );

  const pendingPayments = patient.payments.length;
  const totalAppointments = patient.appointments.length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bienvenido, {userName}</h1>
        <p className="text-gray-600 mt-2">Panel de control del paciente</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Próximas Citas</p>
              <p className="text-3xl font-bold text-[#071535] mt-1">
                {upcomingAppointments.length}
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
              <p className="text-sm text-gray-600">Pagos Pendientes</p>
              <p className="text-3xl font-bold text-[#071535] mt-1">{pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <DollarSign className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Citas</p>
              <p className="text-3xl font-bold text-[#071535] mt-1">{totalAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Próximas Citas</h2>
        </div>
        <div className="p-6">
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tienes citas programadas</p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{appointment.service.name}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {appointment.doctor.user.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {new Date(appointment.startTime).toLocaleDateString('es-MX', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.startTime).toLocaleTimeString('es-MX', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
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
