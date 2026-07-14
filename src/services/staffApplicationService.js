import api from './api';

/** Public — submit phlebotomist hire application */
export const submitPhlebotomistApplication = (payload) =>
  api.post('/staff-applications/phlebotomist', payload);

export const submitStaffApplication = (payload) =>
  api.post('/staff-applications', payload);

/** Admin */
export const listApplications = (params = {}) =>
  api.get('/staff-applications', { params });

export const getApplication = (id) =>
  api.get(`/staff-applications/${id}`);

export const downloadApplicationFile = (id, fileKey) =>
  api.get(`/staff-applications/${id}/files/${encodeURIComponent(fileKey)}`);

export const updateApplication = (id, body) =>
  api.put(`/staff-applications/${id}`, body);

export const promoteToPhlebotomist = (id) =>
  api.post(`/staff-applications/${id}/promote`);

export const listPhlebotomistsRoster = (params = {}) =>
  api.get('/staff-applications/phlebotomists/roster', { params });
