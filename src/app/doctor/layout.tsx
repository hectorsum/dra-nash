import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LayoutDashboard, Calendar, Users, Clock, Stethoscope } from 'lucide-react';
import { LogoutButton } from '@/components/LogoutButton';
import Image from 'next/image';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this';

export default async function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) redirect('/login');

  let userName = '';
  let userEmail = '';

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    userName = (payload.name as string) || '';
    userEmail = (payload.email as string) || '';
  } catch (error) {
    redirect('/login');
  }

  const navItems = [
    { href: '/doctor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { href: '/doctor/agenda', label: 'Mi agenda', icon: <Calendar size={20} /> },
    { href: '/doctor/pacientes', label: 'Pacientes', icon: <Users size={20} /> },
    { href: '/doctor/disponibilidad', label: 'Disponibilidad', icon: <Clock size={20} /> },
    { href: '/doctor/servicios', label: 'Servicios', icon: <Stethoscope size={20} /> },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#071535] text-white flex flex-col">
        {/* Logo/Header */}
        <div className="border-b border-white/10">
          <div className="flex-shrink-0 flex items-center justify-center">
            <Image src="/logo-white.png" alt="Dra. Nash Logo" width={80} height={80} className="object-contain" />
            <div className="flex flex-col">
              <span className="text-[#a4a5bc] text-[16px] font-normal">Dra. Nash</span>
              <hr className="w-20 my-[0px] text-[#a4a5bc]"/>
              <span className="text-[#a4a5bc] text-[12px] font-thin uppercase tracking-widest">Odontología</span>
            </div>
          </div>
        </div>

        {/* User Info */}
        {/* <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{userName}</p>
              <p className="text-sm text-white/60 truncate">{userEmail}</p>
            </div>
          </div>
        </div> */}

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}
