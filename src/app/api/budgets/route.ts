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

    const budgets = await prisma.budget.findMany({
      where: { doctorId: doctor.id },
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
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Error al obtener presupuestos' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const body = await req.json();
    const { patientId, items, totalAmount } = body;

    if (!patientId || !items || !Array.isArray(items) || items.length === 0 || totalAmount === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos o son inválidos' },
        { status: 400 }
      );
    }

    const budget = await prisma.budget.create({
      data: {
        doctorId: doctor.id,
        patientId,
        totalAmount,
        items: {
          create: items.map((item: any) => ({
            serviceId: item.serviceId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal
          }))
        }
      },
      include: {
        patient: {
          include: { user: true }
        },
        items: {
          include: { service: true }
        }
      }
    });

    return NextResponse.json(budget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json(
      { error: 'Error al crear presupuesto' },
      { status: 500 }
    );
  }
}
