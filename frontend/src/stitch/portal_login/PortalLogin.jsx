import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PortalLogin() {
  const navigate = useNavigate();
  const { login, register } = useAuth(); // 👈 luego implementas register
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && password !== confirmPassword) {
      return setError('Las contraseñas no coinciden.');
    }

    setLoading(true);

    try {
      if (isRegister) {
        await register(name, email, password); // 👈 backend después
      } else {
        await login(email, password);
      }

      const from = location.state?.from?.pathname || '/dashboard/overview';
      navigate(from, { replace: true });

    } catch (err) {
      setError(
        isRegister
          ? 'Error al crear la cuenta.'
          : 'Credenciales incorrectas.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0b0f14] to-[#0f1720]"></div>

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-lg">
        <Link to="/" className="flex items-center gap-3">
          <img src="/Logo3.png" alt="Javlabs" className="h-10" />
          <span className="text-white font-michroma text-lg tracking-wider">JAV LABS</span>
        </Link>
      </header>

      {/* MAIN */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">

          <div className="bg-[#0f141a]/80 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">

            {/* TOGGLE */}
            <div className="flex mb-6 bg-black/40 rounded-lg p-1">
              <button
                onClick={() => setIsRegister(false)}
                className={`flex-1 py-2 text-sm rounded-md transition ${
                  !isRegister ? 'bg-primary text-white' : 'text-slate-400'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsRegister(true)}
                className={`flex-1 py-2 text-sm rounded-md transition ${
                  isRegister ? 'bg-primary text-white' : 'text-slate-400'
                }`}
              >
                Registro
              </button>
            </div>

            {/* LOGO */}
            <div className="flex flex-col items-center mb-6">
              <img src="/Logo3.png" className="h-20 mb-3" />
              <h1 className="text-white text-lg font-michroma tracking-widest">
                {isRegister ? 'CREAR CUENTA' : 'INICIAR SESIÓN'}
              </h1>
            </div>

            {/* GOOGLE */}
            <button
              className="w-full flex items-center justify-center gap-3 border border-white/10 bg-white/5 hover:bg-white/10 transition-all py-3 rounded-lg text-white text-sm font-medium"
              onClick={() => console.log("Google login")}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5" />
              Continuar con Google
            </button>

            {/* DIVIDER */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-xs text-slate-500">o</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAME (solo registro) */}
              {isRegister && (
                <input
                  type="text"
                  placeholder="Nombre"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              {/* EMAIL */}
              <input
                type="email"
                placeholder="name@empresa.com"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* PASSWORD */}
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* CONFIRM PASSWORD */}
              {isRegister && (
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              {/* FORGOT PASSWORD */}
              {!isRegister && (
                <div className="flex justify-end">
                  <Link to="/recuperar" className="text-xs text-primary">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              )}

              {/* ERROR */}
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-primary to-blue-500 text-white font-bold"
              >
                {loading
                  ? 'Procesando...'
                  : isRegister
                  ? 'Crear cuenta'
                  : 'Ingresar'}
              </button>
            </form>

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 text-center py-4">
        <p className="text-[10px] text-slate-600">
          © 2026 JAV LABS — Automatización & IA
        </p>
      </footer>
    </>
  );
}