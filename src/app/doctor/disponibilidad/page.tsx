import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import AvailabilityManager from '@/components/AvailabilityManager';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function DoctorDisponibilidadPage() {
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
      availability: {
        orderBy: [
          { dayOfWeek: 'asc' },
          { time: 'asc' },
        ],
      },
    },
  });

  if (!doctor) redirect('/login');

  // Convert availability data for the component
  const availabilityData = doctor.availability.map(slot => ({
    id: slot.id,
    doctorId: slot.doctorId,
    dayOfWeek: slot.dayOfWeek,
    time: slot.time,
    isAvailable: slot.isAvailable,
  }));

  return <AvailabilityManager initialAvailability={availabilityData} />;
}
