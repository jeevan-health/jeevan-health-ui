import api from './api';

export const searchTests = (params) => api.get('/diagnostics/tests/search', { params });
export const getTest = (id) => api.get(`/diagnostics/tests/${id}`);
export const getTestCategories = () => api.get('/diagnostics/tests/categories');
export const getTestSubcategories = () => api.get('/diagnostics/tests/subcategories');
export const getTestsByCategory = (category) => api.get(`/diagnostics/tests/category/${category}`);

export const placeDiagnosticOrder = (data) => api.post('/diagnostics/orders', data);
export const scheduleCollection = (id, data) => api.put(`/diagnostics/orders/${id}/schedule`, data);
export const getDiagnosticOrders = () => api.get('/diagnostics/orders');
export const getDiagnosticOrder = (id) => api.get(`/diagnostics/orders/${id}`);
export const cancelDiagnosticOrder = (id) => api.put(`/diagnostics/orders/${id}/cancel`);

export const getTestResults = (orderId) => api.get(`/diagnostics/results/${orderId}`);
export const getAllTestResults = () => api.get('/diagnostics/results');
