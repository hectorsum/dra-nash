import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addMinutes, parseISO } from 'date-fns';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, startTime, patientName, patientEmail, patientPhone } = body;

    if (!serviceId || !startTime || !patientName || !patientEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    const start = parseISO(startTime);
    const end = addMinutes(start, service.duration);

    // Create or update patient and create appointment in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Find or create patient
      let patient = await tx.patient.findUnique({
        where: { email: patientEmail },
      });

      if (!patient) {
        patient = await tx.patient.create({
          data: {
            name: patientName,
            email: patientEmail,
            phone: patientPhone,
          },
        });
      } else {
        // Optionally update phone if provided
        if (patientPhone && patient.phone !== patientPhone) {
            patient = await tx.patient.update({
                where: { id: patient.id },
                data: { phone: patientPhone }
            });
        }
      }

      // Check double booking (server side validation)
      const existing = await tx.appointment.findFirst({
        where: {
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });

      if (existing) {
        throw new Error('Slot already taken');
      }

      const appointment = await tx.appointment.create({
        data: {
          startTime: start,
          endTime: end,
          patientId: patient.id,
          serviceId: service.id,
        },
      });

      return appointment;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error('Error creating appointment:', error);
    if (error.message === 'Slot already taken') {
      return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Error processing booking' }, { status: 500 });
  }
}
