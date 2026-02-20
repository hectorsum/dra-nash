import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12" id="contacto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex-shrink-0 flex items-center">
              <Image src="/logo-white.png" alt="Dra. Nash Logo" width={80} height={80} className="object-contain" />
              <div className="flex flex-col">
                <span className="text-[#a4a5bc] text-[16px] font-normal">Dra. Nash</span>
                <hr className="w-20 my-[0px] text-[#a4a5bc]"/>
                <span className="text-[#a4a5bc] text-[12px] font-thin uppercase tracking-widest">Odontología</span>
              </div>
            </div>
            <p className="text-gray-400">
              Cuidando tu salud dental con excelencia y calidez humana para brindarte la mejor experiencia.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-normal mb-4">Contacto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Jiron Santo Tomas, B-16, Los Olivos, Lima</li>
              <li>994 860 312</li>
              <li>draorbegoso@gmail.com</li>
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
