import api from './api';

export const searchPatients = (q, campId) =>
  api.get('/lab-reports/admin/patients', {
    params: { q, ...(campId ? { campId } : {}) },
  });

export const listAdminReports = (params = {}) =>
  api.get('/lab-reports/admin', { params });

export const uploadReport = (payload) =>
  api.post('/lab-reports/admin/upload', payload);

export const getMyReports = () =>
  api.get('/lab-reports/mine');

export const downloadMyReport = (id) =>
  api.get(`/lab-reports/mine/${id}/download`);

export const getVapidPublicKey = () =>
  api.get('/lab-reports/push/vapid-public-key');

export const savePushSubscription = (subscription) =>
  api.post('/lab-reports/push/subscribe', subscription);

export const removePushSubscription = (endpoint) =>
  api.post('/lab-reports/push/unsubscribe', { endpoint });
