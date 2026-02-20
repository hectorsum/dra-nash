import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

// PUT /api/clinical-records/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const body = await req.json();
    const { date, diagnosis, treatment, notes, appointmentId } = body;

    const record = await prisma.clinicalRecord.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
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

    return NextResponse.json(record);
  } catch {
    return NextResponse.json({ error: 'Error al actualizar registro' }, { status: 500 });
  }
}

// DELETE /api/clinical-records/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    await prisma.clinicalRecord.delete({ where: { id } });
    return NextResponse.json({ message: 'Registro eliminado' });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar registro' }, { status: 500 });
  }
}
