import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sumhector@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  serviceName: string;
  date: string;
  time: string;
  price: string;
  receiptUrl?: string;
}

export async function sendAppointmentNotification(data: AppointmentEmailData) {
  const { patientName, patientEmail, serviceName, date, time, price, receiptUrl } = data;

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mailOptions = {
    from: '"Sistema de Citas - Dra. Nash" <sumhector@gmail.com>',
    to: 'sumhector@gmail.com',
    subject: `🦷 Nueva Cita - ${patientName} | ${serviceName}`,
    priority: 'high' as const,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
    },
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #071535; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Nueva Cita Agendada</h1>
        </div>
        <div style="padding: 24px; background-color: #f9fafb; border: 1px solid #e5e7eb;">
          <h2 style="color: #071535; margin-top: 0;">Detalles de la Cita</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; width: 130px;">Paciente:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #111827;">${patientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Email:</td>
              <td style="padding: 8px 0; color: #111827;">${patientEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Servicio:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #111827;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Fecha:</td>
              <td style="padding: 8px 0; color: #111827;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Hora:</td>
              <td style="padding: 8px 0; color: #111827;">${time}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280;">Precio:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #071535;">S/ ${price}</td>
            </tr>
          </table>

          ${receiptUrl ? `
            <div style="margin-top: 16px; padding: 16px; background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;">
              <p style="margin: 0 0 8px 0; font-weight: bold; color: #9a3412;">📎 Comprobante de Pago Adjunto</p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                El paciente ha subido un comprobante de pago. Revísalo en el panel de administración.
              </p>
            </div>
          ` : `
            <div style="margin-top: 16px; padding: 16px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
              <p style="margin: 0; font-weight: bold; color: #991b1b;">⚠️ Sin comprobante de pago</p>
            </div>
          `}

          <div style="margin-top: 24px; padding: 16px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #1e40af; font-weight: bold;">
              Revisa y confirma esta cita desde tu panel de control
            </p>
          </div>
        </div>
        <div style="padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
          Dra. Nash | Odontología — Sistema de Citas
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
