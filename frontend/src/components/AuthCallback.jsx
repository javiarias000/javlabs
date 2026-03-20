import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithTokens } = useAuth();

  useEffect(() => {
    const token   = params.get('token');
    const refresh = params.get('refresh');

    if (token) {
      loginWithTokens(token, refresh).then(() => {
        navigate('/dashboard/overview', { replace: true });
      }).catch(() => {
        navigate('/login?error=google', { replace: true });
      });
    } else {
      navigate('/login?error=google', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="text-center text-slate-400">
        <span className="material-symbols-outlined animate-spin text-4xl block mb-4">progress_activity</span>
        <p className="text-sm uppercase tracking-widest font-montserrat">Autenticando con Google...</p>
      </div>
    </div>
  );
}
