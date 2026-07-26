import api from './api.js';

export async function placeOrder(payload) {
  const { data } = await api.post('/diagnostics/orders', payload);
  return data.data.order;
}

export async function listMyOrders() {
  const { data } = await api.get('/diagnostics/orders/mine');
  return data.data.orders;
}

export async function getMyOrder(id) {
  const { data } = await api.get(`/diagnostics/orders/${id}`);
  return data.data.order;
}

export async function cancelMyOrder(id, reason) {
  const { data } = await api.put(`/diagnostics/orders/${id}/cancel`, { reason });
  return data.data.order;
}

export async function adminListOrders(params = {}) {
  const { data } = await api.get('/admin/orders', { params });
  return data.data;
}

export async function adminUpdateOrderStatus(id, status) {
  const { data } = await api.put(`/admin/orders/${id}/status`, { status });
  return data.data.order;
}

export async function adminAssignOrder(orderId, phlebotomistId) {
  const { data } = await api.put(`/admin/orders/${orderId}/assign`, { phlebotomistId });
  return data.data;
}

export async function adminListAssignablePhlebos(params = {}) {
  const { data } = await api.get('/admin/phlebotomists/assignable', { params });
  return data.data.items || [];
}

export function formatInr(n) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(n));
}
