'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BeforeAfterSlider } from '@/components/BeforeAfterSlider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

/* ─── Decorative SVGs ─── */
const ToothDeco = ({
  size = 200,
  color = '#B8A5D4',
  style = {},
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      position: 'absolute',
      pointerEvents: 'none',
      userSelect: 'none',
      opacity: 0.13,
      ...style,
    }}
  >
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 100 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 5 C30 5 15 18 15 33 C15 42 18 50 18 58 C18 72 22 95 28 118 C29.5 124 32 127 35 127 C38 127 40 124 41 118 L44 95 C45 89 47 86 50 86 C53 86 55 89 56 95 L59 118 C60 124 62 127 65 127 C68 127 70.5 124 72 118 C78 95 82 72 82 58 C82 50 85 42 85 33 C85 18 70 5 50 5 Z"
        fill={color}
      />
    </svg>
  </div>
);

const HeartDeco = ({
  size = 160,
  color = '#B8A5D4',
  style = {},
}: {
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}) => (
  <div
    style={{
      position: 'absolute',
      pointerEvents: 'none',
      userSelect: 'none',
      opacity: 0.13,
      ...style,
    }}
  >
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 85 C50 85 10 60 10 35 C10 20 20 10 35 10 C43 10 50 16 50 16 C50 16 57 10 65 10 C80 10 90 20 90 35 C90 60 50 85 50 85 Z"
        fill={color}
      />
    </svg>
  </div>
);

/* ─── Data ─── */
const services = [
  {
    name: 'Odontología General',
    desc: 'Cuidado preventivo y tratamientos esenciales para mantener tu salud bucal en óptimas condiciones.',
    items: ['Consulta odontológica integral', 'Diagnóstico clínico y radiográfico', 'Profilaxis dental (limpieza)', 'Destartraje supra e infragingival', 'Aplicación de flúor y sellantes'],
  },
  {
    name: 'Odontología Restauradora',
    desc: 'Restauramos la función y estética de tu sonrisa con materiales de alta calidad y técnicas actualizadas.',
    items: ['Restauraciones estéticas (resina)', 'Restauraciones con ionómero', 'Incrustaciones (inlay / onlay)', 'Blanqueamiento dental'],
  },
  {
    name: 'Endodoncia',
    desc: 'Tratamiento de conductos con tecnología moderna para preservar tus dientes naturales sin dolor.',
    items: ['Conductos unirradiculares', 'Conductos multirradiculares'],
  },
  {
    name: 'Ortodoncia',
    desc: 'Alineación dental con brackets y sistemas modernos adaptados a cada caso y etapa de vida.',
    items: ['Ortodoncia convencional (metálica)', 'Ortodoncia estética (cerámica, zafiro)'],
  },
  {
    name: 'Odontopediatría',
    desc: 'Atención especializada para los más pequeños, en un ambiente amigable que genera confianza.',
    items: ['Atención odontológica infantil', 'Sellantes y flúor en niños', 'Restauraciones pediátricas'],
  },
  {
    name: 'Cirugía Oral',
    desc: 'Procedimientos quirúrgicos seguros, desde extracciones simples hasta implantes dentales.',
    items: ['Extracciones simples y quirúrgicas', 'Extracción de terceros molares'],
  },
  {
    name: 'Rehabilitación Oral',
    desc: 'Soluciones completas: prótesis, coronas y tratamientos integrales para recuperar tu calidad de vida.',
    items: ['Coronas dentales', 'Puentes fijos', 'Prótesis removibles parciales', 'Prótesis totales'],
  },
];

const testimonials = [
  {
    text: 'La Dra. Nash transformó mi sonrisa completamente. Su profesionalismo y calidez humana hacen cada visita una experiencia muy cómoda.',
    author: 'Hector Herrera',
    service: 'Profilaxis Dental',
  },
  {
    text: 'Llevé a mis hijos con ella y fue increíble cómo los tranquilizó. Ahora van al dentista sin miedo. La recomiendo ampliamente.',
    author: 'Carlos Rodríguez',
    service: 'Odontopediatría',
  },
  {
    text: 'Después de años sin ir al dentista, la Dra. Nash me hizo sentir segura. Sus explicaciones claras y paciencia son incomparables.',
    author: 'Ana Martínez',
    service: 'Blanqueamiento',
  },
];

const sliderCases = [
  { label: 'Caso 01 — Blanqueamiento' },
  { label: 'Caso 02 — Ortodoncia' },
  { label: 'Caso 03 — Restauración' },
];

/* ─── Section Tag helper ─── */
function SectionTag({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.72rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: light ? 'rgba(255,255,255,0.4)' : 'var(--muted)',
        marginBottom: '1.5rem',
        fontFamily: 'var(--sans)',
      }}
    >
      <span
        style={{
          display: 'block',
          width: '28px',
          height: '1px',
          background: 'var(--lavender)',
          flexShrink: 0,
        }}
      />
      {children}
    </div>
  );
}

/* ─── Page ─── */
export default function Home() {
  const [activeCase, setActiveCase] = useState(0);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: 'var(--sans)' }}>

      {/* ═══════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section
        id="inicio"
        style={{
          minHeight: '100vh',
          background: 'var(--navy)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hero-section"
      >
        {/* Background circles */}
        <div style={{
          position: 'absolute', borderRadius: '50%', background: 'var(--lavender)',
          opacity: 0.06, pointerEvents: 'none',
          width: '700px', height: '700px', right: '-200px', top: '-100px',
        }} />
        <div style={{
          position: 'absolute', borderRadius: '50%', background: 'var(--lavender)',
          opacity: 0.04, pointerEvents: 'none',
          width: '300px', height: '300px', right: '300px', bottom: '-50px',
        }} />

        {/* Decorative tooth & heart */}
        <ToothDeco size={320} color="#D4C5E5" style={{ right: '-40px', top: '8%', opacity: 0.07, transform: 'rotate(15deg)' }} />
        <HeartDeco size={180} color="#D4C5E5" style={{ right: '280px', bottom: '5%', opacity: 0.06 }} />
        <ToothDeco size={140} color="#D4C5E5" style={{ left: '2%', bottom: '12%', opacity: 0.05, transform: 'rotate(-20deg)' }} />

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--sans)',
          fontSize: '0.75rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--lavender)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          position: 'relative',
          zIndex: 1,
        }}>
          <span style={{ display: 'block', width: '40px', height: '1px', background: 'var(--lavender)' }} />
          Odontología de excelencia
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(3.5rem, 8vw, 7.5rem)',
            fontWeight: 300,
            lineHeight: 0.95,
            color: 'var(--white)',
            letterSpacing: '-0.01em',
            maxWidth: '800px',
            marginBottom: '2.5rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Tu Sonrisa,<br />
          <em style={{ fontStyle: 'italic', color: 'var(--lavender)' }}>Nuestra</em><br />
          Pasión
        </h1>

        {/* Sub */}
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255,255,255,0.55)',
          maxWidth: '420px',
          lineHeight: 1.7,
          marginBottom: '3.5rem',
          fontWeight: 300,
          position: 'relative',
          zIndex: 1,
        }}>
          Cuidamos tu salud bucal con un enfoque humano, tecnología avanzada y años de experiencia a tu servicio.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <Link
            href="/book"
            style={{
              padding: '1rem 2.25rem',
              background: 'var(--lavender)',
              color: 'var(--navy)',
              fontFamily: 'var(--sans)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s',
              borderRadius: '2px',
              display: 'inline-block',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--lav-mid)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--lavender)')}
          >
            Agendar Cita
          </Link>
          <a
            href="#servicios"
            onClick={(e) => { e.preventDefault(); scrollTo('servicios'); }}
            style={{
              padding: '1rem 2.25rem',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--sans)',
              fontSize: '0.8rem',
              fontWeight: 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.3s',
              borderRadius: '2px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
            }}
          >
            Ver Servicios
          </a>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: '4rem',
          fontSize: '0.7rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
        }}>
          Desplazar
          <span style={{ display: 'block', width: '1px', height: '60px', background: 'rgba(255,255,255,0.2)' }} />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════ */}
      <section
        id="acerca"
        style={{
          background: 'var(--bg)',
          padding: '7rem 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="about-section"
      >
        <HeartDeco size={260} color="#B8A5D4" style={{ right: '-60px', top: '50%', transform: 'translateY(-50%)', opacity: 0.09 }} />
        <ToothDeco size={160} color="#B8A5D4" style={{ left: '0px', bottom: '5%', opacity: 0.07, transform: 'rotate(-10deg)' }} />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '5fr 7fr',
            gap: '6rem',
            alignItems: 'center',
            maxWidth: '1200px',
            position: 'relative',
            zIndex: 1,
          }}
          className="about-grid"
        >
          {/* Photo */}
          <div>
            <div style={{
              position: 'relative',
              aspectRatio: '3/4',
              maxWidth: '380px',
            }}>
              <Image
                src="/dentist-profile.png"
                alt="Dra. Nash"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
              {/* Accent border */}
              <div style={{
                position: 'absolute',
                bottom: '-1.5rem',
                right: '-1.5rem',
                width: '60%',
                height: '60%',
                border: '1px solid var(--lavender)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>

          {/* Text */}
          <div>
            <SectionTag>Sobre Nosotros</SectionTag>
            <h2 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: 'var(--navy)',
              letterSpacing: '-0.01em',
            }}>
              Un cuidado que<br />
              <em style={{ fontStyle: 'italic', color: 'var(--lav-mid)' }}>va más allá</em>
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--body)', fontWeight: 300, marginBottom: '1.5rem', marginTop: '1.75rem' }}>
              La Dra. Nash es una odontóloga con más de una década de experiencia dedicada a transformar sonrisas con un trato cercano y genuinamente humano. Su formación continua le permite ofrecer soluciones actualizadas para cada paciente.
            </p>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.85, color: 'var(--body)', fontWeight: 300, marginBottom: '1.5rem' }}>
              Creemos que una visita al dentista puede ser una experiencia tranquila y hasta agradable. Nuestra filosofía combina la precisión clínica con la calidez que cada persona merece.
            </p>

            {/* Stats */}
            <div style={{
              display: 'flex',
              gap: '3rem',
              marginTop: '3rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid #e8e2f0',
            }}
              className="about-stats"
            >
              {[
                { num: '+10', label: 'Años de experiencia' },
                { num: '+2k', label: 'Pacientes atendidos' },
                { num: '7',   label: 'Especialidades' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: '3rem', fontWeight: 300, color: 'var(--navy)', lineHeight: 1 }}>{num}</div>
                  <div style={{ fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: '0.4rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SERVICES
      ══════════════════════════════════════════ */}
      <section
        id="servicios"
        style={{
          background: 'var(--navy)',
          padding: '7rem 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="services-section"
      >
        <ToothDeco size={340} color="#D4C5E5" style={{ right: '-60px', top: '-40px', opacity: 0.06, transform: 'rotate(10deg)' }} />
        <HeartDeco size={200} color="#D4C5E5" style={{ left: '-40px', bottom: '10%', opacity: 0.05 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
          <SectionTag light>Nuestros Servicios</SectionTag>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: 'var(--white)',
            letterSpacing: '-0.01em',
          }}>
            Soluciones para<br />
            <em style={{ fontStyle: 'italic', color: 'var(--lavender)' }}>cada sonrisa</em>
          </h2>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '420px',
            lineHeight: 1.7,
            fontWeight: 300,
            marginTop: '1.5rem',
            marginBottom: '5rem',
          }}>
            Ofrecemos atención integral en múltiples especialidades, adaptada a las necesidades de toda tu familia.
          </p>

          {/* Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0,
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            className="services-grid"
          >
            {services.map((s, i) => (
              <div
                key={i}
                style={{
                  padding: '2.5rem',
                  borderRight: '1px solid rgba(255,255,255,0.08)',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  transition: 'background 0.3s',
                  cursor: 'default',
                }}
                className={`service-card${(i + 1) % 3 === 0 ? ' no-border-right' : ''}`}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,197,229,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '0.85rem',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  color: 'var(--lavender)',
                  opacity: 0.6,
                  marginBottom: '1.25rem',
                }}>
                  0{i + 1}
                </div>
                <div style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '1.4rem',
                  fontWeight: 400,
                  color: 'var(--white)',
                  lineHeight: 1.2,
                  marginBottom: '0.85rem',
                }}>
                  {s.name}
                </div>
                <div style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.4)',
                  lineHeight: 1.65,
                  fontWeight: 300,
                  marginBottom: '1rem',
                }}>
                  {s.desc}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.items.map((item, j) => (
                    <li key={j} style={{
                      fontSize: '0.78rem',
                      color: 'rgba(255,255,255,0.3)',
                      fontWeight: 300,
                      marginBottom: '0.35rem',
                      paddingLeft: '0.85rem',
                      position: 'relative',
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--lavender)', opacity: 0.5 }}>·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          GALLERY — Before / After
      ══════════════════════════════════════════ */}
      <section
        style={{
          background: 'var(--bg)',
          padding: '7rem 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="gallery-section"
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '4rem',
          maxWidth: '1200px',
        }}
          className="gallery-header"
        >
          <div>
            <SectionTag>Resultados</SectionTag>
            <h2 style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              fontWeight: 300,
              lineHeight: 1.1,
              color: 'var(--navy)',
              letterSpacing: '-0.01em',
            }}>
              Antes &<br />
              <em style={{ fontStyle: 'italic', color: 'var(--lav-mid)' }}>Después</em>
            </h2>
          </div>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--muted)',
            fontWeight: 300,
            maxWidth: '260px',
            lineHeight: 1.6,
            textAlign: 'right',
          }}
            className="gallery-note"
          >
            Arrastra el divisor para comparar los resultados reales de nuestros tratamientos.
          </p>
        </div>

        <BeforeAfterSlider />

        {/* Dot nav */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.75rem' }}>
          {sliderCases.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveCase(i)}
              aria-label={c.label}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: 'var(--lavender)',
                opacity: i === activeCase ? 1 : 0.35,
                cursor: 'pointer',
                transition: 'opacity 0.3s',
                border: 'none',
                padding: 0,
              }}
            />
          ))}
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: '0.75rem', letterSpacing: '0.04em' }}>
          {sliderCases[activeCase].label}
        </p>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════ */}
      <section
        id="testimonios"
        style={{
          background: 'var(--lav-light)',
          padding: '7rem 4rem',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="testimonials-section"
      >
        <ToothDeco size={220} color="#B8A5D4" style={{ right: '2%', top: '-30px', opacity: 0.1, transform: 'rotate(5deg)' }} />
        <HeartDeco size={150} color="#B8A5D4" style={{ left: '-20px', bottom: '5%', opacity: 0.1 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
          <SectionTag>Testimonios</SectionTag>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: 'var(--navy)',
            letterSpacing: '-0.01em',
          }}>
            Lo que dicen<br />
            <em style={{ fontStyle: 'italic', color: 'var(--lav-mid)' }}>mis pacientes</em>
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2.5rem',
              marginTop: '4rem',
            }}
            className="testimonials-grid"
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--white)',
                  padding: '2.75rem 2.25rem',
                  position: 'relative',
                  borderRadius: '2px',
                  boxShadow: '0 2px 20px rgba(26,31,58,0.04)',
                }}
              >
                <span style={{
                  fontFamily: 'var(--serif)',
                  fontSize: '4rem',
                  fontWeight: 300,
                  color: 'var(--lavender)',
                  lineHeight: 0.6,
                  marginBottom: '1.5rem',
                  display: 'block',
                }}>
                  &ldquo;
                </span>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '3px', marginBottom: '1.25rem' }}>
                  {[...Array(5)].map((_, j) => (
                    <span key={j} style={{ color: 'var(--lav-mid)', fontSize: '0.8rem' }}>★</span>
                  ))}
                </div>
                <p style={{
                  fontSize: '0.95rem',
                  lineHeight: 1.75,
                  color: 'var(--body)',
                  fontWeight: 300,
                  fontStyle: 'italic',
                  fontFamily: 'var(--serif)',
                  marginBottom: '2rem',
                }}>
                  {t.text}
                </p>
                <div style={{
                  fontSize: '0.78rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  fontFamily: 'var(--sans)',
                }}>
                  {t.author} — {t.service}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA — Contact
      ══════════════════════════════════════════ */}
      <div
        id="contacto"
        style={{
          background: 'var(--navy)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: '420px',
        }}
        className="cta-section"
      >
        {/* Text side */}
        <div style={{
          padding: '6rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <SectionTag light>Agenda tu cita</SectionTag>
          <h2 style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(2rem, 3.5vw, 3.2rem)',
            fontWeight: 300,
            color: 'var(--white)',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}>
            ¿Listo para<br />
            <em style={{ fontStyle: 'italic', color: 'var(--lavender)' }}>sonreír</em>?
          </h2>
          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 300,
            lineHeight: 1.7,
            maxWidth: '380px',
            marginBottom: '3rem',
          }}>
            Da el primer paso. Agenda tu consulta hoy y descubre la atención personalizada que mereces.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href="/book"
              style={{
                padding: '1rem 2.25rem',
                background: 'var(--lavender)',
                color: 'var(--navy)',
                fontFamily: 'var(--sans)',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                borderRadius: '2px',
                transition: 'all 0.3s',
                display: 'inline-block',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--lav-mid)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--lavender)')}
            >
              Agendar Cita
            </Link>
            <a
              href="tel:+51994860312"
              style={{
                padding: '1rem 2.25rem',
                background: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'var(--sans)',
                fontSize: '0.8rem',
                fontWeight: 400,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
                borderRadius: '2px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              Llamar ahora
            </a>
          </div>

          {/* Contact info */}
          <div style={{
            marginTop: '2.5rem',
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.3)',
            lineHeight: 1.9,
            fontWeight: 300,
            fontFamily: 'var(--sans)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginTop: '4px', width: '12px' }} />
              <span>Jiron Santo Tomas, B-16, Los Olivos, Lima</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FontAwesomeIcon icon={faPhone} style={{ width: '12px' }} />
              <span>994 860 312</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ width: '12px' }} />
              <span>draorbegoso@gmail.com</span>
            </div>
          </div>
        </div>

        {/* Image side */}
        <div style={{ position: 'relative', minHeight: '420px' }}>
          <Image
            src="/happy-smile.png"
            alt="Paciente feliz"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* ─── Responsive styles ─── */}
      <style>{`
        .hero-section   { padding: 0 4rem; }
        .about-section  { padding: 7rem 4rem; }
        .services-section { padding: 7rem 4rem; }
        .gallery-section  { padding: 7rem 4rem; }
        .testimonials-section { padding: 7rem 4rem; }

        .services-grid .no-border-right { border-right: none !important; }

        @media (max-width: 900px) {
          .hero-section, .about-section, .services-section,
          .gallery-section, .testimonials-section { padding: 5rem 1.5rem !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .services-grid .service-card { border-right: none !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .cta-section { grid-template-columns: 1fr !important; }
          .gallery-header { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .gallery-note { text-align: left !important; }
          .about-stats { gap: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
