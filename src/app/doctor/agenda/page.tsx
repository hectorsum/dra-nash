import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Calendar, Clock, User } from 'lucide-react';
import AppointmentActions from '@/components/AppointmentActions';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function DoctorAgendaPage() {
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
          service: true,
          patient: { include: { user: true } },
        },
        orderBy: { startTime: 'asc' },
        where: {
          startTime: {
            gte: new Date(),
          },
        },
      },
    },
  });

  if (!doctor) redirect('/login');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Group appointments by date
  const appointmentsByDate = doctor.appointments.reduce((acc, apt) => {
    const date = new Date(apt.startTime).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(apt);
    return acc;
  }, {} as Record<string, typeof doctor.appointments>);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Agenda</h1>
        <p className="text-gray-600 mt-2">Gestiona tus citas programadas</p>
      </div>

      {doctor.appointments.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-100 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
          <p className="text-gray-500 text-lg">No hay citas programadas</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(appointmentsByDate).map(([date, appointments]) => (
            <div key={date}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} />
                {date}
              </h2>
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {appointment.service.name}
                          </h3>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-gray-600">
                            <User size={16} className="mr-2" />
                            <span className="font-medium">
                              {appointment.patient.user.name}
                            </span>
                            {appointment.patient.phone && (
                              <span className="ml-2 text-sm">
                                • {appointment.patient.phone}
                              </span>
                            )}
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
                            <span className="ml-2 text-sm">
                              ({appointment.service.duration} minutos)
                            </span>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            <strong>Notas:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <AppointmentActions
                      appointment={JSON.parse(JSON.stringify({
                        id: appointment.id,
                        status: appointment.status,
                        paymentReceiptUrl: appointment.paymentReceiptUrl,
                        patient: { user: { name: appointment.patient.user.name } },
                        service: { name: appointment.service.name },
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
