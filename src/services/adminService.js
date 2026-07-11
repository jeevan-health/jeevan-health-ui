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
