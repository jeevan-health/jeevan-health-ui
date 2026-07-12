import api from './api';

export const getUsers = (params = {}) =>
  api.get('/admin/users', { params });

export const getDashboardStats = () =>
  api.get('/admin/dashboard');

export const updateUserRole = (userId, role) =>
  api.put(`/admin/users/${userId}/role`, { role });

export const deleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`);

export const createUser = (userData) =>
  api.post('/admin/users', userData);

export const getOrders = (params = {}) =>
  api.get('/admin/orders', { params });

export const updateOrderStatus = (type, id, status) =>
  api.put(`/admin/orders/${type}/${id}/status`, { status });

export const getAppointments = (params = {}) =>
  api.get('/admin/appointments', { params });

export const updateAppointmentStatus = (id, status) =>
  api.put(`/admin/appointments/${id}/status`, { status });

export const listTests = (params = {}) =>
  api.get('/admin/tests', { params });

export const createTest = (data) =>
  api.post('/admin/tests', data);

export const updateTest = (id, data) =>
  api.put(`/admin/tests/${id}`, data);

export const deleteTest = (id) =>
  api.delete(`/admin/tests/${id}`);
