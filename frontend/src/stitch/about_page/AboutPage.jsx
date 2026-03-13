import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import './AboutPage.css';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ───── HEADER ───── */}
        <PublicNavbar />

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden pt-24 pb-32 bg-background-dark">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mx-auto mb-8">
            <span className="material-symbols-outlined text-primary text-sm">corporate_fare</span>
            <span className="text-primary text-xs font-bold uppercase tracking-widest">Quiénes Somos</span>
          </div>

          <h1 className="font-michroma text-5xl md:text-7xl text-white uppercase leading-tight mb-6">
            CONSTRUIMOS EL<br />
            <span className="gradient-text">FUTURO DIGITAL</span>
          </h1>

          <p className="font-montserrat text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Somos un laboratorio de automatización e inteligencia artificial fundado con una sola convicción:
            la tecnología debe trabajar para las personas, no al revés.
          </p>

          {/* Línea decorativa */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary" />
            <div className="size-2 rounded-full bg-primary shadow-[0_0_8px_#0d7ff2]" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-accent" />
          </div>
        </div>
      </section>

      {/* ───── HISTORIA ───── */}
      <section className="py-32 bg-navy-darker">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Texto */}
            <div>
              <div className="mb-6">
                <span className="text-primary text-xs font-bold uppercase tracking-[0.3em] font-montserrat">Nuestra Historia</span>
                <div className="h-px w-16 bg-gradient-to-r from-primary to-accent mt-2" />
              </div>
              <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-8 leading-tight">
                NACIÓ DE UN PROBLEMA REAL
              </h2>
              <div className="space-y-5 font-montserrat text-slate-400 text-base leading-relaxed">
                <p>
                  JAV LABS nació en 2022 cuando su fundador, tras años en consultoría tecnológica,
                  identificó un patrón repetitivo: empresas con enorme potencial perdiendo cientos de horas
                  semanales en tareas manuales que podían automatizarse.
                </p>
                <p>
                  Lo que empezó como un proyecto personal se convirtió en una agencia especializada con
                  un enfoque claro: soluciones de automatización que realmente funcionan, sin complejidad
                  innecesaria ni costos desproporcionados.
                </p>
                <p>
                  Hoy trabajamos con empresas en toda Latinoamérica, ayudándolas a recuperar su tiempo
                  más valioso y redirigirlo hacia lo que realmente importa.
                </p>
              </div>
            </div>

            {/* Visual — timeline */}
            <div className="relative">
              {[
                { year: '2022', label: 'Fundación',         desc: 'Primeras automatizaciones para clientes locales.',        color: '#0d7ff2' },
                { year: '2023', label: 'Expansión IA',      desc: 'Integración de modelos de lenguaje en flujos de trabajo.', color: '#8b5cf6' },
                { year: '2024', label: 'Escala Regional',   desc: 'Más de 120 clientes activos en 8 países.',                color: '#0d7ff2' },
                { year: '2025', label: 'JAV LABS Platform', desc: 'Lanzamiento de plataforma propia de gestión.',            color: '#8b5cf6' },
              ].map((item, i) => (
                <div key={item.year} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-24 h-10 rounded flex items-center justify-center font-michroma text-sm font-bold"
                      style={{ background: `${item.color}18`, border: `2px solid ${item.color}`, color: item.color }}
                    >
                      {item.year}
                    </div>
                    {i < 3 && (
                      <div className="w-px flex-1 mt-2" style={{ background: `linear-gradient(to bottom, ${item.color}60, transparent)`, minHeight: '28px' }} />
                    )}
                  </div>
                  <div className="pt-1 pb-4">
                    <h4 className="font-michroma text-white text-sm uppercase mb-2">{item.label}</h4>
                    <p className="font-montserrat text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── MISIÓN / VISIÓN ───── */}
      <section className="py-32 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-michroma text-3xl text-white uppercase mb-4">Propósito y Dirección</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Misión */}
            <div className="relative group p-10 bg-navy-darker border border-slate-800 rounded-lg overflow-hidden glow-hover transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[60px] rounded-full group-hover:bg-primary/10 transition-all" />
              <div className="relative z-10">
                <div className="w-14 h-14 mb-8 rounded flex items-center justify-center bg-primary/10 border border-primary/30">
                  <span className="material-symbols-outlined text-3xl gradient-text">flag</span>
                </div>
                <div className="h-px w-12 bg-gradient-to-r from-primary to-accent mb-6" />
                <h3 className="font-michroma text-2xl text-white uppercase mb-6">Misión</h3>
                <p className="font-montserrat text-slate-400 leading-relaxed">
                  Democratizar el acceso a la automatización inteligente para empresas de todos los tamaños,
                  eliminando las barreras técnicas y económicas que históricamente han reservado estas
                  capacidades para las grandes corporaciones.
                </p>
              </div>
            </div>

            {/* Visión */}
            <div className="relative group p-10 bg-navy-darker border border-slate-800 rounded-lg overflow-hidden glow-hover transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 blur-[60px] rounded-full group-hover:bg-accent/10 transition-all" />
              <div className="relative z-10">
                <div className="w-14 h-14 mb-8 rounded flex items-center justify-center bg-accent/10 border border-accent/30">
                  <span className="material-symbols-outlined text-3xl text-accent">visibility</span>
                </div>
                <div className="h-px w-12 bg-gradient-to-r from-accent to-primary mb-6" />
                <h3 className="font-michroma text-2xl text-white uppercase mb-6">Visión</h3>
                <p className="font-montserrat text-slate-400 leading-relaxed">
                  Ser el referente latinoamericano en automatización empresarial, reconocidos no solo por
                  la excelencia técnica de nuestras soluciones, sino por el impacto humano medible que
                  generamos en cada organización que acompañamos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <div className="bg-navy-darker border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          {[
            { label: 'Años de Experiencia', value: '3+' },
            { label: 'Clientes Activos',    value: '120+' },
            { label: 'Países',              value: '8'    },
            { label: 'Horas Ahorradas',     value: '50K+' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8 w-full md:w-auto">
              {i > 0 && <div className="hidden md:block w-px h-12 bg-gradient-to-b from-primary to-accent" />}
              <div className="flex-1 text-center md:text-left">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-michroma text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── CTA ───── */}
      <section className="py-20 bg-background-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative overflow-hidden rounded-xl p-12 md:p-20 flex flex-col items-center text-center"
            style={{ background: 'linear-gradient(to right, #0d7ff2, #8b5cf6, #b06ab3)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 blur-[100px] rounded-full" />
            <h2 className="relative z-10 font-michroma text-3xl md:text-4xl text-white mb-6 leading-tight">
              ¿LISTO PARA TRABAJAR JUNTOS?
            </h2>
            <p className="relative z-10 font-montserrat text-white/90 text-lg mb-10 max-w-xl">
              Cuéntanos tu desafío y construimos la solución a medida.
            </p>
            <button
              onClick={() => navigate('/contacto')}
              className="relative z-10 bg-white px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] rounded-lg shadow-2xl hover:bg-slate-50 transition-all transform hover:scale-105"
              style={{ color: '#0d7ff2' }}
            >
              Hablemos de tu Proyecto
            </button>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-navy-darker border-t border-slate-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-8 bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded">
                <span className="text-white font-michroma text-sm font-bold">J/V</span>
              </div>
              <h2 className="text-white text-lg font-michroma tracking-tighter">JAV LABS</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Sistemas de automatización de alta gama para empresas con visión de futuro.
            </p>
          </div>
          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Empresa</h4>
            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
              {['Nosotros', 'Casos de Éxito', 'Carreras', 'Prensa'].map((item) => (
                <li key={item}><a href="/" className="hover:text-primary transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Soporte</h4>
            <ul className="flex flex-col gap-4 text-slate-400 text-sm">
              <li><Link to="/contacto" className="hover:text-primary transition-colors">Contacto</Link></li>
              <li><Link to="/login"    className="hover:text-primary transition-colors">Portal de Clientes</Link></li>
              <li><a href="/"          className="hover:text-primary transition-colors">Documentación</a></li>
              <li><a href="/"          className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-michroma text-sm uppercase mb-6">Newsletter</h4>
            <p className="text-slate-400 text-xs mb-4">Recibe insights sobre automatización cada semana.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="bg-background-dark border border-slate-700 rounded-l px-4 py-2 text-sm w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none text-white"
              />
              <button
                className="text-white px-4 py-2 rounded-r hover:opacity-80 transition-all"
                style={{ background: '#0d7ff2' }}
              >
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">© 2024 JAV LABS. Todos los derechos reservados.</p>
          <div className="flex gap-8 text-slate-500 text-xs">
            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
              <a key={item} href="/" className="hover:text-slate-300 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
