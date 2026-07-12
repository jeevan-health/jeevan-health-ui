import api from './api';

export const getPublicSettings = () => api.get('/settings/public');

export const getMyAccess = () => api.get('/settings/me');

export const adminGetSettings = () => api.get('/settings/admin');

export const adminUpdateSettings = (payload) => api.put('/settings/admin', payload);
