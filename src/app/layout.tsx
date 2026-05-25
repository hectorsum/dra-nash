import type { Metadata } from 'next';
import './globals.css';
import { ConditionalLayout } from '@/components/ConditionalLayout';

export const metadata: Metadata = {
  title: 'Dra. Nash — Odontología',
  description: 'Odontología de excelencia. Cuidamos tu salud bucal con un enfoque humano, tecnología avanzada y años de experiencia a tu servicio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
