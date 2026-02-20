'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Hide navbar and footer on dashboard routes
  const isDashboardRoute = pathname.startsWith('/patient') || pathname.startsWith('/doctor');

  return (
    <>
      {!isDashboardRoute && <Navbar />}
      <main className={isDashboardRoute ? "min-h-screen" : "min-h-screen pt-16"}>
        {children}
      </main>
      {!isDashboardRoute && <Footer />}
    </>
  );
}
