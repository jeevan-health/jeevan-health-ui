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

/** Unified ops hub: diag + pharmacy + nursing + physio + vaccine + appointments */
export const getOrderHub = (params = {}) =>
  api.get('/admin/order-hub', { params });

export const updateOrderHubStatus = (type, id, status) =>
  api.put(`/admin/order-hub/${type}/${id}/status`, { status });

export const listPhlebotomists = (params = {}) =>
  api.get('/admin/phlebotomists', { params });

export const assignDiagnosticOrder = (orderId, phlebotomistId) =>
  api.post(`/admin/orders/diagnostic/${orderId}/assign`, { phlebotomistId });

export const enablePhlebotomistLogin = (phlebotomistId) =>
  api.post(`/admin/phlebotomists/${phlebotomistId}/enable-login`);

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

export const listDoctors = (params = {}) =>
  api.get('/admin/doctors', { params });

export const createDoctor = (data) =>
  api.post('/admin/doctors', data);

export const updateDoctor = (id, data) =>
  api.put(`/admin/doctors/${id}`, data);

export const deleteDoctor = (id) =>
  api.delete(`/admin/doctors/${id}`);

export const listMedicines = (params = {}) =>
  api.get('/admin/medicines', { params });

export const createMedicine = (data) =>
  api.post('/admin/medicines', data);

export const updateMedicine = (id, data) =>
  api.put(`/admin/medicines/${id}`, data);

export const deleteMedicine = (id) =>
  api.delete(`/admin/medicines/${id}`);
