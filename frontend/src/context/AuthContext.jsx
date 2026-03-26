import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// ✅ FIX: una sola constante para la key — evita el bug de "token" vs "accessToken"
const TOKEN_KEY   = "accessToken";
const REFRESH_KEY = "refreshToken";

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  });
  const [loading, setLoading]         = useState(true);

  // ─── helpers ────────────────────────────────────────────────────
  const saveTokens = (access, refresh) => {
    localStorage.setItem(TOKEN_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
    setAccessToken(access);
  };

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setAccessToken(null);
    setUser(null);
  };

  // ─── LOGIN ──────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method:      "POST",
      headers:     { "Content-Type": "application/json" },
      credentials: "include",
      body:        JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();
    saveTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data;
  };

  // ─── REGISTER ───────────────────────────────────────────────────
  const register = async (name, email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method:      "POST",
      headers:     { "Content-Type": "application/json" },
      credentials: "include",
      body:        JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      const err = new Error("Register failed");
      err.data  = data;
      throw err;
    }

    saveTokens(data.accessToken, data.refreshToken);
    setUser(data.user);
    return data;
  };

  // ─── REFRESH ────────────────────────────────────────────────────
  const refreshToken = async () => {
    try {
      const storedRefresh = localStorage.getItem(REFRESH_KEY);

      const res = await fetch(`${API}/auth/refresh`, {
        method:      "POST",
        headers:     { "Content-Type": "application/json" },
        credentials: "include",
        // ✅ enviamos el refresh tanto en cookie (automático) como en body (fallback)
        body: JSON.stringify({ refreshToken: storedRefresh }),
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();
      saveTokens(data.accessToken, data.refreshToken);
      return data.accessToken;

    } catch (err) {
      console.warn("Refresh failed:", err.message);
      clearTokens();
      return null;
    }
  };

  // ─── FETCH USER ─────────────────────────────────────────────────
  const fetchUser = async (token) => {
    const res = await fetch(`${API}/auth/me`, {
      headers:     { Authorization: `Bearer ${token}` },
      credentials: "include",
    });

    if (!res.ok) throw new Error("User fetch failed");

    const data = await res.json();
    setUser(data);
    return data;
  };

  // ─── LOGIN WITH GOOGLE TOKENS ────────────────────────────────────
  // Llamado desde la página /auth/google/callback
  const loginWithTokens = async (token, refresh) => {
    saveTokens(token, refresh);
    try {
      await fetchUser(token);
    } catch {
      const newToken = await refreshToken();
      if (newToken) await fetchUser(newToken);
    }
  };

  // ─── LOGOUT ─────────────────────────────────────────────────────
  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method:      "POST",
        credentials: "include",
        headers:     { "Content-Type": "application/json" },
        body:        JSON.stringify({ refreshToken: localStorage.getItem(REFRESH_KEY) }),
      });
    } catch (err) {
      console.warn("Logout error:", err);
    }
    clearTokens();
  };

  // ─── INIT ────────────────────────────────────────────────────────
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);

        if (token) {
          try {
            await fetchUser(token);
          } catch {
            // accessToken expirado → intenta refresh
            const newToken = await refreshToken();
            if (newToken) await fetchUser(newToken);
          }
        } else {
          // sin token → intenta refresh por cookie o refreshToken guardado
          const newToken = await refreshToken();
          if (newToken) await fetchUser(newToken);
        }

      } catch (err) {
        console.warn("Init auth error:", err);
        clearTokens();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, accessToken, loginWithTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);