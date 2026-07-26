import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('accessToken') || localStorage.getItem('jh_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original || original._retry) throw error;
    if (error.response?.status !== 401) throw error;
    if (original.url?.includes('/auth/refresh') || original.url?.includes('/auth/send-otp')) {
      throw error;
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw error;

    original._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${baseURL}/auth/refresh`, { refreshToken })
          .then((r) => r.data.data)
          .finally(() => {
            refreshPromise = null;
          });
      }
      const data = await refreshPromise;
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('jh_token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      if (data.user) localStorage.setItem('jh_user', JSON.stringify(data.user));
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('jh_token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('jh_user');
      throw error;
    }
  },
);

/** Health lives outside /api on the server */
export async function fetchApiHealth() {
  const root = baseURL.replace(/\/api\/?$/, '');
  const { data } = await axios.get(`${root}/health`, { timeout: 15_000 });
  return data;
}

export default api;
