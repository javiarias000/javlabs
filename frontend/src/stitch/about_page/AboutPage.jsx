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
      <section className="relative overflow-hidden pt-24 pb-32 bg-navy-darker">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-color-primary/5 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-color-accent/10 blur-[80px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-color-primary/10 border border-color-primary/20 w-fit mx-auto mb-8">
            <span className="material-symbols-outlined text-color-primary text-sm">corporate_fare</span>
            <span className="text-color-primary text-xs font-bold uppercase tracking-widest">Quiénes Somos</span>
          </div>

          <h1 className="font-michroma text-5xl md:text-7xl text-white uppercase leading-tight mb-6">
            TU EMPLEADO DIGITAL<br />
            <span className="gradient-text">TRABAJANDO 24/7</span>
          </h1>

          <p className="font-montserrat text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Somos un laboratorio de automatización que crea sistemas completos para que recuperes 20+ horas cada semana. No vendemos herramientas — te entregamos resultados funcionando.
          </p>

          {/* Línea decorativa */}
          <div className="mt-12 flex items-center justify-center gap-4">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-color-primary" />
            <div className="size-2 rounded-full bg-color-primary shadow-glow-primary" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-color-accent" />
          </div>
        </div>
      </section>

      {/* ───── HISTORIA ───── */}
      <section className="py-32 section-padding-lg bg-navy-darker">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

            {/* Texto */}
            <div>
              <div className="mb-6">
                <span className="text-color-primary text-xs font-bold uppercase tracking-wider font-montserrat">Nuestra Historia</span>
                <div className="h-px w-16 bg-gradient-to-r from-color-primary to-color-accent mt-2" />
              </div>
              <h2 className="font-michroma text-3xl md:text-4xl text-white uppercase mb-8 leading-tight">
                NACIÓ DE UN PROBLEMA REAL
              </h2>
              <div className="space-y-5 font-montserrat text-text-secondary text-base leading-relaxed">
                <p>
                  JAV LABS nació en 2025 cuando su fundador, tras años en consultoría tecnológica,
                  identificó un patrón repetitivo: empresas con enorme potencial perdiendo cientos de horas
                  semanales en tareas manuales que podían automatizarse.
                </p>
                <p>
                  Lo que empezó como un proyecto personal se convirtió en una agencia especializada con
                  un enfoque claro: soluciones de automatización que realmente funcionan, sin complejidad
                  innecesaria ni costos desproporcionados.
                </p>
                <p>
                  Hoy trabajamos con empresas locales, ayudándolas a optimizar sus procesos, recuperar tiempo valioso y enfocarse en lo que realmente impulsa su negocio.
                </p>
              </div>
            </div>

            {/* Visual — timeline */}
            <div className="relative">
              {[
                { year: '2025', label: 'Fundación', desc: 'Primeras automatizaciones para clientes locales.' },
                { year: '2025', label: 'Expansión IA', desc: 'Integración de modelos de lenguaje en flujos de trabajo.' },
                { year: '2026', label: 'Actualización', desc: 'Constante capacitación sobre las nuevas tegnologias' },
                { year: '2026', label: 'JAV LABS Platform', desc: 'Lanzamiento de plataforma propia de gestión.' },
              ].map((item, i) => (
                <div key={item.year} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-24 h-10 rounded flex items-center justify-center font-michroma text-sm font-bold"
                      style={{ background: 'rgba(13, 127, 242, 0.1)', border: `2px solid var(--color-primary)`, color: 'var(--color-primary)' }}
                    >
                      {item.year}
                    </div>
                    {i < 3 && (
                      <div className="w-px flex-1 mt-2" style={{ background: 'linear-gradient(to bottom, rgba(13, 127, 242, 0.6), transparent)', minHeight: '28px' }} />
                    )}
                  </div>
                  <div className="pt-1 pb-4">
                    <h4 className="font-michroma text-white text-sm uppercase mb-2">{item.label}</h4>
                    <p className="font-montserrat text-text-secondary text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── MISIÓN / VISIÓN ───── */}
      <section className="py-32 bg-navy-darker section-padding-lg">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-michroma text-3xl text-white uppercase mb-4">Propósito y Dirección</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-color-primary to-color-accent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Misión */}
            <div className="mission-card about-card">
              <div className="absolute top-0 right-0 w-40 h-40 bg-color-primary/5 blur-[60px] rounded-full group-hover:bg-color-primary/10 transition-all" />
              <div className="relative z-10">
                <div className="mission-icon">
                  <span className="material-symbols-outlined text-color-primary">flag</span>
                </div>
                <div className="mission-divider" />
                <h3 className="mission-title">Misión</h3>
                <p className="mission-text">
                  Democratizar el acceso a la automatización inteligente para empresas de todos los tamaños,
                  eliminando las barreras técnicas y económicas que históricamente han reservado estas
                  capacidades para las grandes corporaciones.
                </p>
              </div>
            </div>

            {/* Visión */}
            <div className="mission-card about-card">
              <div className="absolute top-0 right-0 w-40 h-40 bg-color-accent/5 blur-[60px] rounded-full group-hover:bg-color-accent/10 transition-all" />
              <div className="relative z-10">
                <div className="mission-icon">
                  <span className="material-symbols-outlined text-color-accent">visibility</span>
                </div>
                <div className="mission-divider" />
                <h3 className="mission-title">Visión</h3>
                <p className="mission-text">
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
      <div className="stats-bar">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          {[
            { label: 'Años de Experiencia', value: '4+' },
            { label: 'Clientes Activos', value: '5+' },
            { label: 'Países', value: '1' },
            { label: 'Horas Ahorradas', value: '50K+' },
          ].map((stat, i) => (
            <div key={stat.label} className="stats-item">
              {i > 0 && <div className="stats-divider hidden md:block" />}
              <div className="flex-1 text-center md:text-left">
                <p className="stats-label">{stat.label}</p>
                <p className="stats-value">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ───── CTA ───── */}
      <section className="py-20 bg-background-dark section-padding">
        <div className="max-w-7xl mx-auto px-6">
          <div
            className="relative overflow-hidden rounded-xl p-12 md:p-20 flex flex-col items-center text-center"
            style={{ background: 'var(--gradient-primary)' }}
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
              className="cta-button relative z-10"
            >
              Hablemos de tu Proyecto
            </button>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-card-dark px-10 py-12 border-t border-border-color">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 text-white mb-6">
              <span className="material-symbols-outlined text-2xl text-color-primary">settings_input_component</span>
              <h2 className="text-lg font-michroma tracking-widest">JAV LABS</h2>
            </div>
            <p className="text-text-muted font-montserrat text-sm max-w-md leading-relaxed">
              Automatizamos tus procesos para que recuperes 20+ horas cada semana. Sistemas completos, sin que toques código.
            </p>
            <div className="mt-6">
              <p className="text-white text-sm font-montserrat font-bold mb-3">Contáctanos</p>
              <div className="space-y-3 text-text-secondary text-sm font-montserrat">
                <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">mail</span>jorge.arias.amauta@gmail.com</p>
                <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">call</span>+593 967 685 172</p>
                <p><span className="material-symbols-outlined text-color-primary text-sm align-middle mr-2">location_on</span>Ambato, Ecuador</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-michroma text-xs uppercase mb-6 tracking-widest">Empresa</h4>
            <div className="flex flex-col gap-3">
              {['Nosotros', 'Servicios', 'Precios', 'Casos de Éxito'].map((item) => (
                <a key={item} className="text-text-muted hover:text-color-primary text-xs font-montserrat transition-colors" href="/">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-michroma text-xs uppercase mb-6 tracking-widest">Soporte</h4>
            <div className="flex flex-col gap-3">
              {['Contacto', 'Portal de Clientes', 'FAQ', 'Documentación'].map((item) => (
                <a key={item} className="text-text-muted hover:text-color-primary text-xs font-montserrat transition-colors" href="/">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-michroma text-xs uppercase mb-6 tracking-widest">¿Listo para automatizar?</h4>
            <p className="text-text-muted text-xs font-montserrat mb-4 leading-relaxed">Agenda una consulta gratis y descubre cuántas horas ahorrarías.</p>
            <button
              onClick={() => navigate('/contacto')}
              className="w-full text-white font-bold py-3 px-6 text-xs uppercase tracking-widest hover:opacity-90 transition-all"
              style={{ background: 'var(--gradient-primary)' }}>
              Consulta Gratis →
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border-color flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs font-montserrat">© {new Date().getFullYear()} JAV LABS. Todos los derechos reservados.</p>
          <div className="flex gap-8 text-text-muted text-xs">
            {['Privacidad', 'Términos', 'Cookies'].map((item) => (
              <a key={item} href="/" className="hover:text-color-primary transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
