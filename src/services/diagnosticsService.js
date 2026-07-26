import api from './api.js';

export async function searchTests({ q = '', limit = 50, offset = 0, category } = {}) {
  const { data } = await api.get('/diagnostics/tests/search', {
    params: { q, limit, offset, category },
  });
  return data.data;
}

export async function getTest(id) {
  const { data } = await api.get(`/diagnostics/tests/${id}`);
  return data.data.test;
}

export async function getMeta() {
  const { data } = await api.get('/diagnostics/tests/meta');
  return data.data;
}

export async function adminListTests({ q = '', limit = 100, offset = 0, active } = {}) {
  const { data } = await api.get('/admin/tests', {
    params: { q, limit, offset, active },
  });
  return data.data;
}

export async function adminCreateTest(payload) {
  const { data } = await api.post('/admin/tests', payload);
  return data.data.test;
}

export async function adminUpdateTest(id, payload) {
  const { data } = await api.put(`/admin/tests/${id}`, payload);
  return data.data.test;
}

/** Upload Excel workbook as base64 for catalog upsert */
export async function adminImportExcel({ filename, contentBase64 }) {
  const { data } = await api.post('/admin/tests/import-excel', {
    filename,
    contentBase64,
  });
  return data.data;
}

export function formatInr(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(n));
}
