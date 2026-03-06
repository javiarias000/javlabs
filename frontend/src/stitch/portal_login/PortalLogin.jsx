import { Link, useNavigate } from 'react-router-dom';
import './PortalLogin.css';

export default function PortalLogin() {
  const navigate = useNavigate();
  return (
    <>
      <div className="fixed inset-0 circuit-pattern pointer-events-none"></div>
<header className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12 border-b border-white/10 bg-background-dark/50 backdrop-blur-md">
<div className="flex items-center gap-2">
<div className="size-8 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-3xl">terminal</span>
</div>
<h2 className="text-xl font-bold tracking-tight font-michroma gradient-logo">JAV LABS</h2>
</div>
<div className="hidden md:flex items-center gap-8">
<Link to="/" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Home</Link>
<Link to="/servicios" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Services</Link>
<Link to="/contacto" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Contact</Link>
<button className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 px-5 py-2 rounded text-sm font-bold transition-all" onClick={() => navigate('/soporte/chat')}>Support</button>
</div>
</header>
<main className="relative z-10 flex-1 flex items-center justify-center p-4">
<div className="w-full max-w-[440px]">
<div className="bg-black border border-white/5 p-8 md:p-12 shadow-2xl rounded-none">
<div className="flex flex-col items-center mb-10">
<div className="mb-6 flex items-center justify-center">
<div className="relative">
<span className="material-symbols-outlined text-6xl gradient-logo font-bold">account_tree</span>
<div className="absolute -bottom-1 -right-1 size-4 bg-primary rounded-full animate-pulse"></div>
</div>
</div>
<h1 className="text-2xl font-michroma text-white tracking-wider text-center">INICIAR SESIÓN</h1>
<div className="h-1 w-12 bg-primary mt-4"></div>
</div>
<form className="space-y-6">
<div className="space-y-2">
<label className="block text-xs font-montserrat uppercase tracking-widest text-slate-400 font-semibold">Email Address</label>
<div className="relative">
<input className="w-full bg-[#1b2127] border border-[#555555] rounded-none px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none input-focus-glow transition-all font-montserrat" placeholder="name@company.com" type="email" />
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm">mail</span>
</div>
</div>
<div className="space-y-2">
<label className="block text-xs font-montserrat uppercase tracking-widest text-slate-400 font-semibold">Password</label>
<div className="relative">
<input className="w-full bg-[#1b2127] border border-[#555555] rounded-none px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none input-focus-glow transition-all font-montserrat" placeholder="••••••••" type="password" />
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 text-sm">lock</span>
</div>
</div>
<div className="flex items-center justify-between pt-2">
<label className="flex items-center gap-2 cursor-pointer group">
<input className="size-4 border-[#555555] bg-[#1b2127] text-primary focus:ring-0 rounded-none" type="checkbox" />
<span className="text-xs font-montserrat text-slate-400 group-hover:text-slate-200 transition-colors">Remember me</span>
</label>
<a className="text-xs font-montserrat text-slate-400 hover:text-primary transition-colors" href="/">Forgot Password?</a>
</div>
<button className="w-full btn-gradient py-4 text-white font-montserrat font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity active:scale-[0.98] rounded-none mt-4" type="submit">
            Entrar al Portal
          </button>
</form>
<div className="mt-10 pt-8 border-t border-white/10 text-center">
<p className="text-slate-500 text-xs font-montserrat">
            Acceso restringido para clientes autorizados de <span className="text-primary">JAV LABS</span>.
          </p>
</div>
</div>
<div className="mt-8 flex justify-center gap-6">
<a className="text-slate-500 hover:text-white transition-colors" href="/">
<span className="material-symbols-outlined text-xl">public</span>
</a>
<a className="text-slate-500 hover:text-white transition-colors" href="/">
<span className="material-symbols-outlined text-xl">share</span>
</a>
<a className="text-slate-500 hover:text-white transition-colors" href="/">
<span className="material-symbols-outlined text-xl">help_outline</span>
</a>
</div>
</div>
</main>
<footer className="relative z-10 px-6 py-6 text-center">
<p className="text-[10px] font-montserrat uppercase tracking-[0.2em] text-slate-600">
      © 2024 JAV LABS Automation Agency. All Rights Reserved.
    </p>
</footer>
    </>
  );
}
