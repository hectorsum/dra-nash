import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, addMinutes, format, parse, isBefore, isAfter } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateString = searchParams.get('date'); // YYYY-MM-DD
  const serviceId = searchParams.get('serviceId');

  if (!dateString || !serviceId) {
    return NextResponse.json({ error: 'Missing date or serviceId' }, { status: 400 });
  }

  try {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const queryDate = parse(dateString, 'yyyy-MM-dd', new Date());
    const dayStart = startOfDay(queryDate);
    const dayEnd = endOfDay(queryDate);

    // Fetch existing appointments for the day
    const appointments = await prisma.appointment.findMany({
      where: {
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          not: 'CANCELLED',
        },
      },
    });

    // Generate slots
    // Working hours: 09:00 to 19:00 (19:00 is closing time, last slot depends on duration)
    const workStartHour = 9;
    const workEndHour = 19;
    
    // Set start time for the day
    let currentSlot = new Date(dayStart);
    currentSlot.setHours(workStartHour, 0, 0, 0);

    const availableSlots = [];
    const closingTime = new Date(dayStart);
    closingTime.setHours(workEndHour, 0, 0, 0);

    while (true) {
      const slotEnd = addMinutes(currentSlot, service.duration);
      
      if (isAfter(slotEnd, closingTime)) break;

      const isBusy = appointments.some((apt: { startTime: Date; endTime: Date }) => {
        // Overlap logic: (StartA < EndB) and (EndA > StartB)
        return isBefore(currentSlot, apt.endTime) && isAfter(slotEnd, apt.startTime);
      });

      if (!isBusy) {
        availableSlots.push(format(currentSlot, 'HH:mm'));
      }

      // Increment by 30 mins for next potential slot start, or by duration? 
      // Usually users like 30 min intervals options 9:00, 9:30, 10:00...
      currentSlot = addMinutes(currentSlot, 30);
    }

    return NextResponse.json({ slots: availableSlots });

  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
