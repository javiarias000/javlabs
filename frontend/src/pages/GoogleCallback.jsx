import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const [params]       = useSearchParams();
  const { loginWithTokens } = useAuth();
  const navigate       = useNavigate();
  const called         = useRef(false); // evita doble ejecución en StrictMode

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      navigate("/login?error=google", { replace: true });
      return;
    }

    loginWithTokens(token, null)
      .then(() => navigate("/dashboard/overview", { replace: true }))
      .catch(() => navigate("/login?error=google", { replace: true }));

  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0b0f14]">
      <img src="/Logo3.png" alt="JAV LABS" className="h-16 mb-6 animate-pulse" />
      <p className="text-slate-400 text-sm">Verificando tu cuenta de Google…</p>
    </div>
  );
}