import api from './api';

export const listCamps = (params = {}) =>
  api.get('/camps/admin', { params });

export const getCamp = (id) =>
  api.get(`/camps/admin/${id}`);

export const createCamp = (payload) =>
  api.post('/camps/admin', payload);

export const updateCamp = (id, payload) =>
  api.put(`/camps/admin/${id}`, payload);

export const listRegistrations = (id, params = {}) =>
  api.get(`/camps/admin/${id}/registrations`, { params });

export const searchCampPatients = (id, q) =>
  api.get(`/camps/admin/${id}/patients`, { params: { q } });

/** Public camp landing (no auth) */
export const getPublicCamp = (slug) =>
  api.get(`/camps/public/${slug}`);

/** Logged-in patient joins camp */
export const joinCamp = (slug) =>
  api.post(`/camps/${slug}/join`);
