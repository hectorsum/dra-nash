import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      email, 
      password,
      // Step 1: Datos
      documentType,
      documentNumber,
      birthDate,
      // Step 2: Personal
      firstName,
      paternalSurname,
      maternalSurname,
      gender,
      country,
      address,
      // Step 3: Seguridad
      phoneCountryCode,
      phone,
    } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create full name for User model (backward compatibility)
    const fullName = `${firstName} ${paternalSurname} ${maternalSurname}`.trim();

    // Create user with patient profile
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: fullName,
        role: 'PATIENT',
        patient: {
          create: {
            // Legacy phone field
            phone: phone ? `${phoneCountryCode}${phone}` : null,
            
            // Step 1 fields
            documentType,
            documentNumber,
            birthDate: birthDate ? new Date(birthDate) : null,
            
            // Step 2 fields
            firstName,
            paternalSurname,
            maternalSurname,
            gender,
            country,
            address,
            
            // Step 3 fields
            phoneCountryCode,
          },
        },
      },
    });

    // Create JWT token
    const token = await new SignJWT({ 
      sub: user.id, 
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(JWT_SECRET));

    // Set cookie and return response
    const response = NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
