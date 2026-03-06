import { Link, useNavigate } from 'react-router-dom';
import './ServicesPageVariant1.css';

export default function ServicesPageVariant1() {
  return (
    <>
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">

<header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-800 px-10 py-4 bg-background-dark/95 backdrop-blur-sm sticky top-0 z-50">
<div className="flex items-center gap-4">
<div className="size-6 text-primary">
<span className="material-symbols-outlined text-3xl">settings_input_component</span>
</div>
<h2 className="text-white text-xl font-michroma tracking-wider">JAV LABS</h2>
</div>
<nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
<div className="flex items-center gap-9 font-montserrat">
<Link to="/servicios" className="text-slate-300 hover:text-primary transition-colors text-xs uppercase tracking-widest">Servicios</Link>
<a className="text-slate-300 hover:text-primary transition-colors text-xs uppercase tracking-widest" href="/">Procesos</a>
<a className="text-slate-300 hover:text-primary transition-colors text-xs uppercase tracking-widest" href="/">FAQ</a>
<Link to="/contacto" className="text-slate-300 hover:text-primary transition-colors text-xs uppercase tracking-widest">Contacto</Link>
</div>
<button className="bg-primary hover:bg-primary/80 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 transition-all">
                Agendar Diagnóstico
            </button>
</nav>
</header>
<main className="flex-1">

<section className="relative py-24 px-10 flex flex-col items-center justify-center text-center overflow-hidden">
<div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #0d0df2 0%, transparent 70%)' }}></div>
<div className="relative z-10 max-w-4xl">
<h1 className="text-white text-5xl md:text-6xl font-michroma mb-6 tracking-tighter">
                    NUESTROS SERVICIOS
                </h1>
<div className="gradient-underline w-32 mx-auto mb-8"></div>
<p className="text-slate-400 font-montserrat text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Soluciones avanzadas de automatización e inteligencia artificial diseñadas para escalar tu infraestructura digital.
                </p>
</div>
</section>

<section className="px-10 py-20 max-w-7xl mx-auto">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

<div className="bg-card-dark border border-slate-800 p-8 flex flex-col hover-glow transition-all group">
<span className="material-symbols-outlined text-5xl circuit-icon mb-6">memory</span>
<h3 className="text-white text-xl font-michroma mb-4 tracking-tight">Automatización de Procesos</h3>
<p className="text-slate-400 font-montserrat text-sm mb-8 leading-relaxed">
                        Eliminamos cuellos de botella mediante flujos de trabajo inteligentes que conectan sus herramientas actuales.
                    </p>
<ul className="space-y-3 mb-10 flex-1">
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Ahorro de +40h mensuales
                        </li>
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Reducción de error humano
                        </li>
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Reportes en tiempo real
                        </li>
</ul>
<button className="gradient-border-btn w-full py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-primary/10 transition-colors">
                        Solicitar este servicio
                    </button>
</div>

<div className="bg-card-dark border border-slate-800 p-8 flex flex-col hover-glow transition-all group">
<span className="material-symbols-outlined text-5xl circuit-icon mb-6">psychology</span>
<h3 className="text-white text-xl font-michroma mb-4 tracking-tight">IA Generativa</h3>
<p className="text-slate-400 font-montserrat text-sm mb-8 leading-relaxed">
                        Implementación de modelos de lenguaje personalizados para atención al cliente y análisis de datos profundo.
                    </p>
<ul className="space-y-3 mb-10 flex-1">
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Chatbots con contexto real
                        </li>
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Análisis predictivo
                        </li>
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Entrenamiento de LLMs
                        </li>
</ul>
<button className="gradient-border-btn w-full py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-primary/10 transition-colors">
                        Solicitar este servicio
                    </button>
</div>

<div className="bg-card-dark border border-slate-800 p-8 flex flex-col hover-glow transition-all group">
<span className="material-symbols-outlined text-5xl circuit-icon mb-6">hub</span>
<h3 className="text-white text-xl font-michroma mb-4 tracking-tight">Integración de Sistemas</h3>
<p className="text-slate-400 font-montserrat text-sm mb-8 leading-relaxed">
                        Conectamos su ecosistema de software a través de APIs robustas para una sincronización de datos impecable.
                    </p>
<ul className="space-y-3 mb-10 flex-1">
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Estrategia API First
                        </li>
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Escalabilidad horizontal
                        </li>
<li className="flex items-center gap-3 text-sm text-slate-300 font-montserrat">
<span className="material-symbols-outlined text-primary text-lg">check_circle</span>
                            Seguridad de grado bancario
                        </li>
</ul>
<button className="gradient-border-btn w-full py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-primary/10 transition-colors">
                        Solicitar este servicio
                    </button>
</div>
</div>
</section>

<section className="bg-slate-900/50 py-24 px-10">
<div className="max-w-7xl mx-auto">
<h2 className="text-white text-3xl font-michroma mb-16 text-center">¿CÓMO TRABAJAMOS?</h2>
<div className="relative flex flex-col md:flex-row justify-between items-start gap-12">

<div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent-violet z-0"></div>

<div className="relative z-10 flex flex-col items-center text-center md:w-1/4">
<div className="size-16 bg-background-dark border-2 border-primary flex items-center justify-center text-primary font-michroma text-xl mb-6">01</div>
<h4 className="text-white font-bold mb-2 font-michroma text-sm">DIAGNÓSTICO</h4>
<p className="text-slate-400 text-xs font-montserrat px-4">Auditamos sus procesos actuales y detectamos ineficiencias.</p>
</div>

<div className="relative z-10 flex flex-col items-center text-center md:w-1/4">
<div className="size-16 bg-background-dark border-2 border-primary flex items-center justify-center text-primary font-michroma text-xl mb-6">02</div>
<h4 className="text-white font-bold mb-2 font-michroma text-sm">PROPUESTA</h4>
<p className="text-slate-400 text-xs font-montserrat px-4">Diseñamos una arquitectura técnica a medida de sus metas.</p>
</div>

<div className="relative z-10 flex flex-col items-center text-center md:w-1/4">
<div className="size-16 bg-background-dark border-2 border-primary flex items-center justify-center text-primary font-michroma text-xl mb-6">03</div>
<h4 className="text-white font-bold mb-2 font-michroma text-sm">IMPLEMENTACIÓN</h4>
<p className="text-slate-400 text-xs font-montserrat px-4">Desarrollo ágil y despliegue de las soluciones elegidas.</p>
</div>

<div className="relative z-10 flex flex-col items-center text-center md:w-1/4">
<div className="size-16 bg-background-dark border-2 border-accent-violet flex items-center justify-center text-accent-violet font-michroma text-xl mb-6">04</div>
<h4 className="text-white font-bold mb-2 font-michroma text-sm">SOPORTE</h4>
<p className="text-slate-400 text-xs font-montserrat px-4">Optimización continua y mantenimiento proactivo 24/7.</p>
</div>
</div>
</div>
</section>

<section className="px-10 py-24 max-w-7xl mx-auto">
<h2 className="text-white text-3xl font-michroma mb-12">COMPARATIVA DE PLANES</h2>
<div className="overflow-x-auto border border-slate-800">
<table className="w-full text-left font-montserrat">
<thead>
<tr className="bg-gradient-to-r from-primary/20 to-accent-violet/20 border-b border-slate-800">
<th className="p-6 text-white font-michroma text-sm tracking-widest uppercase">Característica</th>
<th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center">Básico</th>
<th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center border-x border-slate-700/50 bg-primary/10">Profesional</th>
<th className="p-6 text-white font-michroma text-sm tracking-widest uppercase text-center">Enterprise</th>
</tr>
</thead>
<tbody className="bg-card-dark divide-y divide-slate-800">
<tr>
<td className="p-6 text-slate-300 font-medium">Automatizaciones</td>
<td className="p-6 text-center text-slate-400">Hasta 5</td>
<td className="p-6 text-center text-white border-x border-slate-700/50">Hasta 20</td>
<td className="p-6 text-center text-slate-400">Ilimitadas</td>
</tr>
<tr>
<td className="p-6 text-slate-300 font-medium">Soporte Técnico</td>
<td className="p-6 text-center text-slate-400">Email (48h)</td>
<td className="p-6 text-center text-white border-x border-slate-700/50">Prioritario 24/7</td>
<td className="p-6 text-center text-slate-400">Manager Dedicado</td>
</tr>
<tr>
<td className="p-6 text-slate-300 font-medium">Integraciones Custom</td>
<td className="p-6 text-center"><span className="material-symbols-outlined text-slate-600">close</span></td>
<td className="p-6 text-center border-x border-slate-700/50"><span className="material-symbols-outlined text-primary">check</span></td>
<td className="p-6 text-center"><span className="material-symbols-outlined text-primary">check</span></td>
</tr>
<tr>
<td className="p-6 text-slate-300 font-medium">Infraestructura IA</td>
<td className="p-6 text-center"><span className="material-symbols-outlined text-slate-600">close</span></td>
<td className="p-6 text-center border-x border-slate-700/50"><span className="material-symbols-outlined text-primary">check</span></td>
<td className="p-6 text-center"><span className="material-symbols-outlined text-primary">check</span></td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="px-10 py-24 max-w-4xl mx-auto">
<h2 className="text-white text-3xl font-michroma mb-12 text-center uppercase">Preguntas Frecuentes</h2>
<div className="space-y-4">
<div className="bg-card-dark border-l-4 border-slate-800 p-6 hover:border-primary transition-all">
<div className="flex justify-between items-center cursor-pointer">
<h4 className="text-white font-michroma text-sm uppercase">¿Cuánto tiempo toma una implementación estándar?</h4>
<span className="material-symbols-outlined text-slate-500">expand_more</span>
</div>
<div className="mt-4 text-slate-400 text-sm font-montserrat leading-relaxed">
                        Típicamente, los proyectos básicos se despliegan en 2-3 semanas, mientras que las soluciones Enterprise pueden tomar de 2 a 4 meses dependiendo de la complejidad.
                    </div>
</div>
<div className="bg-card-dark border-l-4 border-primary p-6">
<div className="flex justify-between items-center cursor-pointer">
<h4 className="text-white font-michroma text-sm uppercase">¿Es necesario reemplazar mis herramientas actuales?</h4>
<span className="material-symbols-outlined text-primary">expand_less</span>
</div>
<div className="mt-4 text-slate-400 text-sm font-montserrat leading-relaxed">
                        No. Nuestra especialidad es la integración. Trabajamos sobre su stack tecnológico actual (Salesforce, Hubspot, SAP, etc.) para potenciarlo sin fricciones.
                    </div>
</div>
<div className="bg-card-dark border-l-4 border-slate-800 p-6 hover:border-primary transition-all">
<div className="flex justify-between items-center cursor-pointer">
<h4 className="text-white font-michroma text-sm uppercase">¿Ofrecen garantía de ROI?</h4>
<span className="material-symbols-outlined text-slate-500">expand_more</span>
</div>
</div>
</div>
</section>

<section className="bg-background-dark py-20 px-10 border-t border-slate-800">
<div className="max-w-5xl mx-auto text-center">
<h3 className="text-white text-2xl md:text-3xl font-michroma mb-8">
                    ¿NO SABES QUÉ SERVICIO NECESITAS? HABLEMOS.
                </h3>
<button className="bg-gradient-to-r from-primary to-accent-violet hover:opacity-90 text-white font-bold uppercase tracking-widest px-10 py-5 transition-all shadow-lg shadow-primary/20">
                    Agendar Diagnóstico Gratuito
                </button>
</div>
</section>
</main>

<footer className="bg-card-dark px-10 py-12 border-t border-slate-800">
<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
<div className="col-span-2">
<div className="flex items-center gap-3 text-white mb-6">
<span className="material-symbols-outlined text-2xl text-primary">settings_input_component</span>
<h2 className="text-lg font-michroma tracking-widest">JAV LABS</h2>
</div>
<p className="text-slate-500 font-montserrat text-sm max-w-md leading-relaxed">
                    Laboratorio de automatización avanzada especializado en IA y optimización de flujos operativos para empresas de alto rendimiento.
                </p>
</div>
<div>
<h4 className="text-white font-michroma text-xs uppercase mb-6 tracking-widest">Legal</h4>
<div className="flex flex-col gap-3">
<a className="text-slate-500 hover:text-primary text-xs font-montserrat transition-colors" href="/">Privacidad</a>
<a className="text-slate-500 hover:text-primary text-xs font-montserrat transition-colors" href="/">Términos</a>
<a className="text-slate-500 hover:text-primary text-xs font-montserrat transition-colors" href="/">Cookies</a>
</div>
</div>
<div>
<h4 className="text-white font-michroma text-xs uppercase mb-6 tracking-widest">Social</h4>
<div className="flex flex-col gap-3">
<a className="text-slate-500 hover:text-primary text-xs font-montserrat transition-colors" href="/">LinkedIn</a>
<a className="text-slate-500 hover:text-primary text-xs font-montserrat transition-colors" href="/">X / Twitter</a>
<a className="text-slate-500 hover:text-primary text-xs font-montserrat transition-colors" href="/">Github</a>
</div>
</div>
</div>
<div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
<p className="text-slate-600 text-xs font-montserrat">© 2024 JAV LABS. Todos los derechos reservados.</p>
<p className="text-slate-600 text-xs font-montserrat uppercase tracking-widest">Pioneering Efficiency.</p>
</div>
</footer>
</div>
    </>
  );
}
