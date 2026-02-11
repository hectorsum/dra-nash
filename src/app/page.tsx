import Link from 'next/link';
import { Stethoscope, Sparkles, Activity, Smile, Baby, Scissors, Crown } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary/5 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Tu Sonrisa, Nuestra Pasión
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Ofrecemos cuidados dentales de primera clase con la tecnología más avanzada y un trato humano que te hará sentir como en casa.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/book" className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-[#050c1f] transition transform hover:-translate-y-1">
                Agendar Cita
              </Link>
              <Link href="#servicios" className="px-8 py-3 bg-white text-primary font-bold rounded-full shadow-md hover:bg-gray-50 transition border border-primary/20">
                Nuestros Servicios
              </Link>
            </div>
          </div>
        </div>
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
      </section>

      {/* About Section */}
      <section id="acerca-de" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
             <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-200 h-96 flex items-center justify-center">
                {/* Image Placeholder */}
                <span className="text-gray-400">Foto del Consultorio / Doctor</span>
             </div>
             <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Sobre Nosotros</h2>
               <p className="text-gray-600 mb-6 leading-relaxed">
                 En Dra. Nash | Odontología, nos dedicamos a mejorar la salud bucal de nuestros pacientes a través de tratamientos personalizados y de alta calidad. Nuestro equipo de especialistas cuenta con años de experiencia en diversas áreas de la odontología.
               </p>
               <p className="text-gray-600 leading-relaxed">
                 Creemos que una visita al dentista debe ser una experiencia cómoda y libre de estrés. Por eso, hemos diseñado nuestras instalaciones pensando en tu bienestar.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Nuestros Servicios</h2>
             <p className="text-gray-600 max-w-2xl mx-auto">
               Brindamos una atención odontológica integral con una amplia gama de especialidades para ti y tu familia.
             </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                category: 'Odontología General', 
                icon: <Stethoscope className="w-8 h-8" />,
                items: [
                  'Consulta odontológica integral',
                  'Diagnóstico clínico y radiográfico',
                  'Profilaxis dental (limpieza)',
                  'Destartraje supragingival y subgingival',
                  'Aplicación de flúor y sellantes'
                ]
              },
              { 
                category: 'Odontología Restauradora', 
                icon: <Sparkles className="w-8 h-8" />,
                items: [
                  'Restauraciones estéticas (resina)',
                  'Restauraciones con ionómero',
                  'Incrustaciones (inlay / onlay)',
                  'Blanqueamiento dental'
                ]
              },
              { 
                category: 'Endodoncia', 
                icon: <Activity className="w-8 h-8" />,
                items: [
                  'Tratamiento de conductos unirradiculares',
                  'Tratamiento de conductos multirradiculares'
                ]
              },
              { 
                category: 'Ortodoncia', 
                icon: <Smile className="w-8 h-8" />,
                items: [
                  'Ortodoncia convencional (brackets metálicos)',
                  'Ortodoncia estética (cerámicos, zafiro)'
                ]
              },
              { 
                category: 'Odontopediatría', 
                icon: <Baby className="w-8 h-8" />,
                items: [
                  'Atención odontológica infantil',
                  'Sellantes y flúor en niños',
                  'Restauraciones pediátricas'
                ]
              },
              { 
                category: 'Cirugía Oral', 
                icon: <Scissors className="w-8 h-8" />,
                items: [
                  'Extracciones simples y quirúrgicas',
                  'Extracción de terceros molares (muelas del juicio)'
                ]
              },
              { 
                category: 'Rehabilitación Oral / Prótesis', 
                icon: <Crown className="w-8 h-8" />,
                items: [
                  'Coronas dentales',
                  'Puentes fijos',
                  'Prótesis removibles parciales',
                  'Prótesis totales'
                ]
              },
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-300">
                   {service.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 border-b pb-2 border-gray-100">{service.category}</h3>
                <ul className="space-y-2">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start text-gray-600 text-sm">
                      <span className="mr-2 text-primary/60 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

     {/* Contact Info Section (Layout handled by Footer mainly, but adding a map or quick contact here) */}
     <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h2 className="text-3xl font-bold text-slate-800 mb-8">¿Listo para sonreír?</h2>
              <Link href="/book" className="inline-block px-8 py-4 bg-primary text-white font-bold rounded-lg shadow hover:bg-[#050c1f] transition">
                 Agenda tu Cita Ahora
              </Link>
        </div>
     </section>
    </div>
  );
}
