import Image from 'next/image';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from '@fortawesome/free-solid-svg-icons';

const navItems   = ['Inicio', 'Acerca de', 'Servicios', 'Contacto'];
const serviceItems = ['Odontología General', 'Ortodoncia', 'Endodoncia', 'Cirugía Oral'];

export function Footer() {
  return (
    <footer style={{
      background: 'var(--navy)',
      padding: '4rem 4rem 2.5rem',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '4rem',
        maxWidth: '1200px',
        marginBottom: '4rem',
      }}
        className="footer-grid"
      >
        {/* Brand */}
        <div>
          <Link href="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
            marginBottom: '1rem',
          }}>
            <Image
              src="/logo-white.png"
              alt="Dra. Nash logo"
              width={36}
              height={36}
              style={{ width: '36px', height: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
              <span style={{
                fontFamily: 'var(--serif)',
                fontWeight: 500,
                fontSize: '1.05rem',
                color: 'var(--white)',
                letterSpacing: '0.03em',
                lineHeight: 1,
              }}>
                Dra. Nash
              </span>
              <span style={{
                fontFamily: 'var(--sans)',
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1,
              }}>
                Odontología
              </span>
            </div>
          </Link>
          <p style={{
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.35)',
            lineHeight: 1.7,
            fontWeight: 300,
            maxWidth: '260px',
            fontFamily: 'var(--sans)',
          }}>
            Odontología con calidez humana y excelencia clínica. Tu sonrisa es nuestra mayor satisfacción.
          </p>
        </div>

        {/* Nav col */}
        <FooterCol title="Navegación" items={navItems} />

        {/* Services col */}
        <FooterCol title="Servicios" items={serviceItems} />

        {/* Contact col */}
        <div>
          <h4 style={colHeadStyle}>Contacto</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ ...colItemStyle, display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginTop: '2px', width: '14px', color: 'var(--lavender)' }} />
              <span>Jiron Santo Tomas, B-16, Los Olivos, Lima</span>
            </li>
            <li style={{ ...colItemStyle, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faPhone} style={{ width: '14px', color: 'var(--lavender)' }} />
              <span>994 860 312</span>
            </li>
            <li style={{ ...colItemStyle, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ width: '14px', color: 'var(--lavender)' }} />
              <span>draorbegoso@gmail.com</span>
            </li>
            <li style={{ ...colItemStyle, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faClock} style={{ width: '14px', color: 'var(--lavender)' }} />
              <span>Lun–Vie: 9am – 7pm</span>
            </li>
            <li style={{ ...colItemStyle, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faClock} style={{ width: '14px', color: 'var(--lavender)' }} />
              <span>Sáb: 10am – 3pm</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingTop: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.75rem',
        color: 'rgba(255,255,255,0.25)',
        fontWeight: 300,
        fontFamily: 'var(--sans)',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <span>© {new Date().getFullYear()} Dra. Nash. Todos los derechos reservados.</span>
        <span>Diseñado con cuidado</span>
      </div>

      {/* Mobile responsive style */}
      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 style={colHeadStyle}>{title}</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item} style={colItemStyle}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

const colHeadStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.35)',
  marginBottom: '1.5rem',
  fontFamily: 'var(--sans)',
};

const colItemStyle: React.CSSProperties = {
  fontSize: '0.88rem',
  color: 'rgba(255,255,255,0.55)',
  fontWeight: 300,
  lineHeight: 1,
  marginBottom: '0.85rem',
  fontFamily: 'var(--sans)',
};
