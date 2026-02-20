import Link from 'next/link';
import Image from 'next/image';
import { Stethoscope, Sparkles, Activity, Smile, Baby, Scissors, Crown, Star } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import { ToothFlourish, FlowingWave, SpiralAccent, InfinityLoop, PetalCurl } from '@/components/DecorativeLines';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary/5 py-20 lg:py-32 overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-image.png"
            alt="Consultorio Dental Moderno"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-white/90"></div>
        </div>

        {/* Decorative circles hero */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-primary/10 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-100 opacity-50 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full border-2 border-primary/5 animate-hero-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full border border-primary/8 animate-hero-float-fast"></div>
        <ToothFlourish className="absolute bottom-8 left-8 w-32 h-32 opacity-30" />
        <FlowingWave className="absolute top-16 right-0 w-80 opacity-20" />
        <div className="absolute bottom-10 right-1/3 w-20 h-20 rounded-full bg-blue-200/20 animate-hero-float-slow"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal direction="down" duration={800}>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                Tu Sonrisa, Nuestra Pasión
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                Ofrecemos cuidados dentales de primera clase con la tecnología más avanzada y un trato humano que te hará sentir como en casa.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <div className="flex justify-center gap-4">
                <Link href="/book" className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:bg-[#050c1f] transition transform hover:-translate-y-1">
                  Agendar Cita
                </Link>
                <Link href="#servicios" className="px-8 py-3 bg-white text-primary font-bold rounded-full shadow-md hover:bg-gray-50 transition border border-primary/20">
                  Nuestros Servicios
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="acerca-de" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full border border-dashed border-primary/10"></div>
        <div className="absolute bottom-20 -left-16 w-48 h-48 rounded-full bg-blue-50/60"></div>
        <div className="absolute top-1/2 right-10 w-3 h-3 rounded-full bg-primary/20"></div>
        <div className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-primary/15"></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 rounded-full bg-blue-200/30"></div>
        <SpiralAccent className="absolute -bottom-6 right-20 w-28 h-28 opacity-25" />
        <InfinityLoop className="absolute top-8 left-0 w-60 opacity-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" duration={800}>
              <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-200 h-96 relative group">
                <Image
                  src="/dentist-profile.png"
                  alt="Dra. Nash"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </ScrollReveal>
            <div>
              <ScrollReveal direction="right" duration={800}>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Sobre Nosotros</h2>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={200} duration={800}>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  En Dra. Nash | Odontología, nos dedicamos a mejorar la salud bucal de nuestros pacientes a través de tratamientos personalizados y de alta calidad. Nuestro equipo de especialistas cuenta con años de experiencia en diversas áreas de la odontología.
                </p>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={300} duration={800}>
                <p className="text-gray-600 leading-relaxed">
                  Creemos que una visita al dentista debe ser una experiencia cómoda y libre de estrés. Por eso, hemos diseñado nuestras instalaciones pensando en tu bienestar.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Decorative lines and circles */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full border border-primary/5"></div>
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full border border-dashed border-primary/5"></div>
        <div className="absolute top-40 right-20 w-6 h-6 rounded-full bg-blue-100/50"></div>
        <div className="absolute bottom-60 left-20 w-4 h-4 rounded-full bg-primary/10"></div>
        <ToothFlourish className="absolute -top-4 right-12 w-40 h-40 opacity-15" />
        <FlowingWave className="absolute bottom-20 left-0 w-96 opacity-20" />
        <SpiralAccent className="absolute top-1/2 -left-8 w-24 h-24 opacity-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Nuestros Servicios</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Brindamos una atención odontológica integral con una amplia gama de especialidades para ti y tu familia.
              </p>
            </div>
          </ScrollReveal>
          
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
              <ScrollReveal key={idx} delay={idx * 100} duration={600}>
                <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group h-full">
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonios" className="py-20 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-primary/8"></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border-2 border-dashed border-blue-100/60"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/3 opacity-30"></div>
        <div className="absolute top-20 right-1/4 w-3 h-3 rounded-full bg-primary/15"></div>
        <div className="absolute bottom-20 left-1/4 w-2 h-2 rounded-full bg-blue-200/40"></div>
        <ToothFlourish className="absolute bottom-4 left-8 w-36 h-36 opacity-20" />
        <PetalCurl className="absolute top-12 right-0 w-32 h-32 opacity-20" />
        <FlowingWave className="absolute bottom-10 right-10 w-64 opacity-15" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Lo que dicen mis pacientes</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                La satisfacción de nuestros pacientes es nuestra mejor carta de presentación.
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Hector Herrera",
                service: "Profilaxis Dental",
                review: "Excelente atención, muy profesional y amable. El consultorio es muy limpio y apto para el tratamiento.",
                stars: 5
              },
              {
                name: "Carlos Rodríguez",
                service: "Limpieza Dental",
                review: "La mejor limpieza dental que me han hecho. Muy detallistas y sin dolor. El consultorio es moderno y muy limpio.",
                stars: 5
              },
              {
                name: "Ana Martínez",
                service: "Blanqueamiento",
                review: "Estoy fascinada con los resultados de mi blanqueamiento. Mis dientes lucen brillantes y naturales. ¡Gracias por devolverme la confianza!",
                stars: 5
              }
            ].map((testimonial, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} duration={600}>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
                  <div className="flex text-amber-400 mb-4">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">&quot;{testimonial.review}&quot;</p>
                  <div>
                    <h4 className="font-bold text-slate-800">{testimonial.name}</h4>
                    <p className="text-sm text-primary/70">{testimonial.service}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

     {/* Contact CTA Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border border-primary/8"></div>
        <div className="absolute bottom-10 right-10 w-14 h-14 rounded-full bg-blue-50/60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal duration={800}>
            <div className="bg-primary rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center relative">
              {/* Inner decorative circles */}
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-1/3 w-24 h-24 rounded-full bg-white/5 translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full border border-white/10"></div>

              <div className="p-12 md:w-1/2 text-white text-center md:text-left relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para sonreír?</h2>
                <p className="text-blue-100 mb-8 text-lg">Agenda tu cita hoy y descubre la mejor versión de tu sonrisa con nuestros expertos.</p>
                <Link href="/book" className="inline-block px-8 py-4 bg-white text-primary font-bold rounded-lg shadow-lg hover:bg-gray-100 transition transform hover:-translate-y-1">
                  Agenda tu Cita Ahora
                </Link>
              </div>
              <div className="md:w-1/2 h-64 md:h-96 relative w-full">
                <Image src="/happy-smile.png" alt="Paciente Feliz" fill className="object-cover" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
