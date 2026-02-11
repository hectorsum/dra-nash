export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-normal mb-4 text-white">Dra. Nash | Odontología</h3>
            <p className="text-gray-400">
              Transformando sonrisas con tecnología avanzada y cuidado compasivo.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-normal mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Av. Reforma 123, Ciudad de México</li>
              <li>+52 55 1234 5678</li>
              <li>contacto@dentalcare.com</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-normal mb-4">Horario</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Lunes - Viernes: 9am - 7pm</li>
              <li>Sábado: 10am - 3pm</li>
              <li>Domingo: Cerrado</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Dra. Nash. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
