import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const API = "http://localhost:3001/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const data = await res.json();

    setAccessToken(data.accessToken);
    localStorage.setItem("token", data.accessToken);
    setUser(data.user);

    return data;
  };

  // ================= REGISTER =================
  const register = async (name, email, password) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) throw new Error("Register failed");

    const data = await res.json();

    setAccessToken(data.accessToken);
    localStorage.setItem("token", data.accessToken);
    setUser(data.user);

    return data;
  };

  // ================= REFRESH =================
  const refreshToken = async () => {
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        credentials: "include", // 🔥 CLAVE
      });

      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();

      setAccessToken(data.accessToken);
      localStorage.setItem("token", data.accessToken);

      return data.accessToken;
    } catch (err) {
      console.log("REFRESH ERROR:", err);

      // 🔥 limpiar sesión si falla
      localStorage.removeItem("token");
      setAccessToken(null);
      setUser(null);

      return null;
    }
  };

  // ================= GET USER =================
  const fetchUser = async (token) => {
    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // 🔥 IMPORTANTE
      });

      if (!res.ok) throw new Error("User fetch failed");

      const data = await res.json();
      setUser(data);

    } catch (err) {
      console.log("FETCH USER ERROR:", err);

      // 🔥 intenta 1 sola vez refresh
      const newToken = await refreshToken();

      if (newToken) {
        const retryRes = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });

        if (retryRes.ok) {
          const retryData = await retryRes.json();
          setUser(retryData);
          return;
        }
      }

      // ❌ si todo falla → logout limpio
      localStorage.removeItem("token");
      setAccessToken(null);
      setUser(null);
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("LOGOUT ERROR:", err);
    }

    localStorage.removeItem("token");
    setAccessToken(null);
    setUser(null);
  };

  // ================= INIT =================
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("INIT AUTH");

        if (accessToken) {
          await fetchUser(accessToken);
        } else {
          const newToken = await refreshToken();
          if (newToken) {
            await fetchUser(newToken);
          }
        }

      } catch (err) {
        console.log("INIT AUTH ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ================= HOOK =================
export const useAuth = () => useContext(AuthContext);