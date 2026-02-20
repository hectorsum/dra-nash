import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    const userId = payload.sub as string;

    // Get doctor
    const doctor = await prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    const { slots } = await req.json();

    if (!Array.isArray(slots)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    // Delete all existing availability for this doctor
    await prisma.availability.deleteMany({
      where: { doctorId: doctor.id },
    });

    // Insert only the available slots (where isAvailable = true)
    const availableSlots = slots.filter((slot: any) => slot.isAvailable);
    
    if (availableSlots.length > 0) {
      await prisma.availability.createMany({
        data: availableSlots.map((slot: any) => ({
          doctorId: doctor.id,
          dayOfWeek: slot.dayOfWeek,
          time: slot.time,
          isAvailable: true,
        })),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating availability:', error);
    return NextResponse.json({ error: 'Error al actualizar disponibilidad' }, { status: 500 });
  }
}
