import api from './api';

export const uploadRecord = (data) => api.post('/health/records', data);
export const getRecords = () => api.get('/health/records');
export const deleteRecord = (id) => api.delete(`/health/records/${id}`);

export const saveHealthInfo = (data) => api.post('/health/info', data);
export const getHealthInfo = () => api.get('/health/info');

export const addVital = (data) => api.post('/health/vitals', data);
export const getVitals = (params) => api.get('/health/vitals', { params });
