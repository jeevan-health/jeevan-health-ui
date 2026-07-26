import api from './api.js';

export async function listMyReports() {
  const { data } = await api.get('/reports/mine');
  return data.data.reports || [];
}

export async function downloadReport(id) {
  const { data } = await api.get(`/reports/${id}/download`);
  return data.data;
}

export async function adminUploadReport(payload) {
  const { data } = await api.post('/admin/reports/upload', payload);
  return data.data;
}

export async function adminListReportsForOrder(orderId) {
  const { data } = await api.get(`/admin/reports/order/${orderId}`);
  return data.data.reports || [];
}

/** Trigger browser download from base64 PDF */
export function savePdfBase64(fileName, contentBase64) {
  const raw = String(contentBase64).replace(/^data:application\/pdf;base64,/, '');
  const bin = atob(raw);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName || 'lab-report.pdf';
  a.click();
  URL.revokeObjectURL(url);
}
