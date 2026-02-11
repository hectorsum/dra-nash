import Link from 'next/link';

import Image from 'next/image';
import { Stethoscope } from 'lucide-react'; // Placeholder icon for logo

export function Navbar() {
  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Acerca de', href: '#acerca-de' },
    { name: 'Servicios', href: '#servicios' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-primary border-b border-primary/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Image src="/logo-white.png" alt="Dra. Nash Logo" width={80} height={80} className="object-contain" />
            <div className="flex flex-col">
              <span className="text-[#a4a5bc] text-[16px] font-normal">Dra. Nash</span>
              <hr className="w-20 my-[0px] text-[#a4a5bc]"/>
              <span className="text-[#a4a5bc] text-[12px] font-thin uppercase tracking-widest">Odontología</span>
            </div>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link href="/book">
              <span className="bg-white text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer hover:bg-gray-100">
                Agendar Cita
              </span>
            </Link>
          </div>

          {/* Mobile menu button placeholder - can be implemented with state later */}
          <div className="md:hidden">
             <button className="text-white/80 hover:text-white">
               <span className="sr-only">Open menu</span>
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
