import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function PatientPagosPage() {
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
      payments: {
        include: {
          appointment: {
            include: {
              service: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!patient) redirect('/login');

  const pendingPayments = patient.payments.filter((p) => p.status === 'PENDING');
  const completedPayments = patient.payments.filter((p) => p.status === 'COMPLETED');
  const totalPending = pendingPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const totalPaid = completedPayments.reduce((sum, p) => sum + Number(p.amount), 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="text-green-600" size={20} />;
      case 'PENDING': return <Clock className="text-yellow-600" size={20} />;
      case 'FAILED': return <XCircle className="text-red-600" size={20} />;
      default: return <Clock className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pagos</h1>
        <p className="text-gray-600 mt-2">Gestiona tus pagos y facturas</p>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pendiente</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                ${totalPending.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{pendingPayments.length} pagos</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <DollarSign className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Pagado</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${totalPaid.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-1">{completedPayments.length} pagos</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Historial de Pagos</h2>
        </div>
        <div className="p-6">
          {patient.payments.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No hay pagos registrados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patient.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      {getStatusIcon(payment.status)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {payment.appointment.service.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.createdAt).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${Number(payment.amount).toFixed(2)}
                      </p>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
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
