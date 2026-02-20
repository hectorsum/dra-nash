import { PrismaClient, UserRole, PaymentStatus, AppointmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

// Extract actual database URL from Prisma Postgres connection string
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not defined');
  
  // Check if this is a Prisma Postgres URL with api_key
  const urlObj = new URL(url);
  const apiKey = urlObj.searchParams.get('api_key');
  
  if (apiKey) {
    try {
      const decoded = Buffer.from(apiKey, 'base64').toString('utf-8');
      const config = JSON.parse(decoded);
      return config.databaseUrl || url;
    } catch (e) {
      console.error('Failed to decode api_key, using original URL:', e);
      return url;
    }
  }
  
  return url;
}

const pool = new Pool({
  connectionString: getDatabaseUrl(),
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting database seed...');

  // Create doctor user
  const hashedDoctorPassword = await bcrypt.hash('doctor123', 10);
  const doctorUser = await prisma.user.create({
    data: {
      email: 'doctor@example.com',
      password: hashedDoctorPassword,
      name: 'Dra. Nayeli Orbegoso',
      role: UserRole.DOCTOR,
      doctor: {
        create: {
          specialty: 'Odontología General',
          phone: '+52 55 1234 5678',
        },
      },
    },
    include: {
      doctor: true,
    },
  });

  // Create sample services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Limpieza Dental',
        description: 'Limpieza dental profesional y revisión general',
        duration: 30,
        price: 500,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Extracción',
        description: 'Extracción de muela o diente',
        duration: 45,
        price: 800,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Blanqueamiento',
        description: 'Blanqueamiento dental profesional',
        duration: 60,
        price: 1500,
      },
    }),
  ]);
  console.log(`✅ Created ${services.length} services`);

  // Create doctor availability (Monday to Friday, 9 AM to 5 PM in 30-minute slots)
  const availabilityDays = [1, 2, 3, 4, 5]; // Monday to Friday
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30'
  ];
  
  const availabilityRecords = [];
  for (const day of availabilityDays) {
    for (const time of timeSlots) {
      availabilityRecords.push({
        doctorId: doctorUser.doctor!.id,
        dayOfWeek: day,
        time: time,
        isAvailable: true,
      });
    }
  }
  
  await prisma.availability.createMany({
    data: availabilityRecords,
  });
  console.log(`✅ Created ${availabilityRecords.length} availability slots (30-min intervals)`);

  // Create test patient (optional, for development)
  const hashedPatientPassword = await bcrypt.hash('patient123', 10);
  const patientUser = await prisma.user.create({
    data: {
      email: 'patient@example.com',
      password: hashedPatientPassword,
      name: 'Juan Pérez',
      role: UserRole.PATIENT,
      patient: {
        create: {
          phone: '+52 55 9876 5432',
        },
      },
    },
    include: {
      patient: true,
    },
  });
  console.log('✅ Created test patient user:', patientUser.email);

  // Create sample appointment for the test patient
  const appointment = await prisma.appointment.create({
    data: {
      startTime: new Date('2026-02-20T10:00:00'),
      endTime: new Date('2026-02-20T10:30:00'),
      status: AppointmentStatus.CONFIRMED,
      notes: 'Primera cita',
      patientId: patientUser.patient!.id,
      doctorId: doctorUser.doctor!.id,
      serviceId: services[0].id,
    },
  });
  console.log('✅ Created sample appointment');

  // Create payment for the appointment
  const payment = await prisma.payment.create({
    data: {
      amount: 500,
      status: PaymentStatus.PENDING,
      appointmentId: appointment.id,
      patientId: patientUser.patient!.id,
    },
  });
  console.log('✅ Created sample payment');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('  Doctor: doctor@example.com / doctor123');
  console.log('  Patient: patient@example.com / patient123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
