import api from './api';

export const searchMedicines = (params) => api.get('/pharmacy/medicines/search', { params });
export const getMedicine = (id) => api.get(`/pharmacy/medicines/${id}`);
export const getMedCategories = () => api.get('/pharmacy/medicines/categories');
export const placeOrder = (data) => api.post('/pharmacy/orders', data);
export const getMyOrders = () => api.get('/pharmacy/orders');
export const getOrder = (id) => api.get(`/pharmacy/orders/${id}`);
