import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

// GET /api/clinical-records?patientId=xxx
export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (payload.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'patientId requerido' }, { status: 400 });
    }

    const records = await prisma.clinicalRecord.findMany({
      where: { patientId },
      include: {
        appointment: {
          include: { service: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(records);
  } catch {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}

// POST /api/clinical-records
export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    if (payload.role !== 'DOCTOR') {
      return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 });
    }

    const userId = payload.sub as string;
    const doctor = await prisma.doctor.findUnique({ where: { userId } });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    const body = await req.json();
    const { patientId, date, diagnosis, treatment, notes, appointmentId } = body;

    if (!patientId || !date || !diagnosis || !treatment) {
      return NextResponse.json({ error: 'Campos requeridos: patientId, date, diagnosis, treatment' }, { status: 400 });
    }

    const record = await prisma.clinicalRecord.create({
      data: {
        patientId,
        doctorId: doctor.id,
        date: new Date(date),
        diagnosis,
        treatment,
        notes: notes || null,
        appointmentId: appointmentId || null,
      },
      include: {
        appointment: {
          include: { service: true },
        },
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Error al crear registro' }, { status: 500 });
  }
}
