import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { sendAppointmentNotification } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function POST(req: Request) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      userId = payload.sub as string;
    } catch (error) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { serviceId, doctorId, date, time, notes, paymentReceiptUrl } = body;

    if (!serviceId || !doctorId || !date || !time) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Get patient from user
    const patient = await prisma.patient.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Paciente no encontrado' },
        { status: 404 }
      );
    }

    // Get service to determine duration
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Servicio no encontrado' },
        { status: 404 }
      );
    }

    // Create start and end time
    const [hours, minutes] = time.split(':').map(Number);
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + service.duration);

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        serviceId,
        startTime,
        endTime,
        status: 'PENDING',
        notes: notes || null,
        paymentReceiptUrl: paymentReceiptUrl || null,
      },
      include: {
        service: true,
        doctor: {
          include: {
            user: true,
          },
        },
      },
    });

    // Send email notification to doctor (non-blocking)
    sendAppointmentNotification({
      patientName: patient.user.name,
      patientEmail: patient.user.email,
      serviceName: service.name,
      date,
      time,
      price: Number(service.price).toFixed(2),
      receiptUrl: paymentReceiptUrl || undefined,
    }).catch(err => console.error('Email notification failed:', err));

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Error al crear cita' },
      { status: 500 }
    );
  }
}
