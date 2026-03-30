import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// ✅ FIX: usar la misma key que AuthContext
const TOKEN_KEY   = 'accessToken';
const REFRESH_KEY = 'refreshToken';

const api = axios.create({
  baseURL:      API_URL,
  withCredentials: true, // envía cookies automáticamente
});

// ─── Request interceptor: adjunta el JWT ────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor: renueva el token si expira ───────────
let isRefreshing    = false;
let failedQueue     = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        // encola la petición fallida hasta que el refresh termine
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      isRefreshing = true;

      try {
        const storedRefresh = localStorage.getItem(REFRESH_KEY);

        const { data } = await api.post(
          '/auth/refresh',
          { refreshToken: storedRefresh }
        );

        const newToken = data.accessToken;
        localStorage.setItem(TOKEN_KEY, newToken);
        if (data.refreshToken) localStorage.setItem(REFRESH_KEY, data.refreshToken);

        processQueue(null, newToken);

        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);

      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;