'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const navLinks = [
  { id: 'inicio',    label: 'Inicio' },
  { id: 'acerca',    label: 'Acerca' },
  { id: 'servicios', label: 'Servicios' },
  { id: 'contacto',  label: 'Contacto' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  
  const [hasScrolled, setHasScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    
    if (!isHome) {
      router.push(`/#${id}`);
      return;
    }

    if (id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  const scrolled = !isHome || hasScrolled;

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4rem',
          height: '72px',
          transition: 'background 0.4s, box-shadow 0.4s',
          background: scrolled ? 'rgba(250,250,248,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          boxShadow: scrolled ? '0 1px 0 rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* Logo */}
        <a
          href={isHome ? "#" : "/"}
          onClick={(e) => { e.preventDefault(); scrollTo('inicio'); }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            opacity: 1,
            transition: 'opacity 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Image
            src="/logo-white.png"
            alt="Dra. Nash logo"
            width={36}
            height={36}
            style={{
              width: '36px',
              height: 'auto',
              objectFit: 'contain',
              filter: scrolled ? 'none' : 'brightness(0) invert(1)',
              transition: 'filter 0.4s',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
            <span style={{
              fontFamily: 'var(--serif)',
              fontWeight: 500,
              fontSize: '1.05rem',
              color: scrolled ? 'var(--navy)' : 'var(--white)',
              letterSpacing: '0.03em',
              lineHeight: 1,
              transition: 'color 0.4s',
            }}>
              Dra. Nash
            </span>
            <span style={{
              fontFamily: 'var(--sans)',
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: scrolled ? 'var(--muted)' : 'rgba(255,255,255,0.55)',
              lineHeight: 1,
              transition: 'color 0.4s',
            }}>
              Odontología
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: '2.5rem', listStyle: 'none', margin: 0, padding: 0 }}
            className="hidden md:flex">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <a
                href={isHome ? `#${id}` : `/#${id}`}
                onClick={(e) => { e.preventDefault(); scrollTo(id); }}
                style={{
                  fontSize: '0.82rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: scrolled ? 'var(--muted)' : 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  transition: 'color 0.3s',
                  fontFamily: 'var(--sans)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = scrolled ? 'var(--navy)' : '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = scrolled ? 'var(--muted)' : 'rgba(255,255,255,0.8)')}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/book"
          className="hidden md:inline-block"
          style={{
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.65rem 1.5rem',
            borderRadius: '2px',
            border: scrolled ? '1px solid var(--navy)' : '1px solid rgba(255,255,255,0.5)',
            color: scrolled ? 'var(--navy)' : 'var(--white)',
            textDecoration: 'none',
            transition: 'all 0.3s',
            fontFamily: 'var(--sans)',
            fontWeight: 500,
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = scrolled ? 'var(--navy)' : 'var(--white)';
            el.style.color = scrolled ? 'var(--white)' : 'var(--navy)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = 'transparent';
            el.style.color = scrolled ? 'var(--navy)' : 'var(--white)';
          }}
        >
          Agendar Cita
        </Link>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2 bg-transparent border-none cursor-pointer"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block',
              width: '22px',
              height: '1px',
              background: scrolled ? 'var(--navy)' : 'var(--white)',
              transition: 'background 0.4s',
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          background: 'rgba(250,250,248,0.97)',
          backdropFilter: 'blur(12px)',
          zIndex: 99,
          padding: '1.5rem',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          {navLinks.map(({ id, label }) => (
            <a
              key={id}
              href={isHome ? `#${id}` : `/#${id}`}
              onClick={(e) => { e.preventDefault(); scrollTo(id); }}
              style={{
                fontSize: '0.9rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--navy)',
                textDecoration: 'none',
                fontFamily: 'var(--sans)',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
              }}
            >
              {label}
            </a>
          ))}
          <Link href="/book" style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--navy)',
            color: 'var(--white)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            textAlign: 'center',
            borderRadius: '2px',
            fontFamily: 'var(--sans)',
          }}>
            Agendar Cita
          </Link>
        </div>
      )}
    </>
  );
}
