import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    let userId: string;
    let userRole: string;
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      userId = (payload.userId as string) || (payload.sub as string) || '';
      userRole = payload.role as string;
    } catch (error) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    if (userRole !== 'DOCTOR') {
      return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId }
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor no encontrado' }, { status: 404 });
    }

    const { id } = await params;
    const budget = await prisma.budget.findUnique({
      where: {
        id,
      },
      include: {
        patient: {
          include: {
            user: true
          }
        },
        items: {
          include: {
            service: true
          }
        }
      }
    });

    if (!budget) {
       return NextResponse.json({ error: 'Presupuesto no encontrado' }, { status: 404 });
    }

    // Security check: Ensure the doctor requesting the budget is the one who created it
    if (budget.doctorId !== doctor.id) {
       return NextResponse.json({ error: 'No tienes permisos para ver este presupuesto' }, { status: 403 });
    }

    return NextResponse.json(budget);

  } catch (error) {
    console.error('Error fetching budget:', error);
    return NextResponse.json(
      { error: 'Error al obtener el presupuesto' },
      { status: 500 }
    );
  }
}
