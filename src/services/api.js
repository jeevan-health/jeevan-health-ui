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

/** Health lives outside /api on the server */
export async function fetchApiHealth() {
  const root = baseURL.replace(/\/api\/?$/, '');
  const { data } = await axios.get(`${root}/health`, { timeout: 15_000 });
  return data;
}

export default api;
