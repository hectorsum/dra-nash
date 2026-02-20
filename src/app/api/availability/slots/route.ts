import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    if (!doctorId || !date) {
      return NextResponse.json(
        { error: 'doctorId y date son requeridos' },
        { status: 400 }
      );
    }

    // Get the day of week for the requested date
    const requestedDate = new Date(date + 'T00:00:00');
    const dayOfWeek = requestedDate.getDay();

    // Get doctor's available time slots for this day
    const availableSlots = await prisma.availability.findMany({
      where: {
        doctorId,
        dayOfWeek,
        isAvailable: true,
      },
      orderBy: {
        time: 'asc',
      },
    });

    if (availableSlots.length === 0) {
      return NextResponse.json([]);
    }

    // Get appointments for the doctor on this date
    const startOfDay = new Date(date + 'T00:00:00');
    
    const endOfDay = new Date(date + 'T23:59:59');

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Filter out booked slots
    const availableTimes = availableSlots
      .filter(slot => {
        // Check if this time slot is booked
        const isBooked = appointments.some(apt => {
          const aptHour = apt.startTime.getHours();
          const aptMinute = apt.startTime.getMinutes();
          const slotTime = `${aptHour.toString().padStart(2, '0')}:${aptMinute.toString().padStart(2, '0')}`;
          return slotTime === slot.time;
        });
        return !isBooked;
      })
      .map(slot => slot.time);

    return NextResponse.json(availableTimes);
  } catch (error) {
    console.error('Error fetching availability slots:', error);
    return NextResponse.json(
      { error: 'Error al obtener horarios disponibles' },
      { status: 500 }
    );
  }
}
