import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let userId: string;
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      userId = payload.userId as string || payload.sub as string || '';
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    const patients = await prisma.patient.findMany({
      include: {
        user: true,
      },
      orderBy: {
        user: { name: 'asc' }
      }
    });

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Error al obtener pacientes' },
      { status: 500 }
    );
  }
}
