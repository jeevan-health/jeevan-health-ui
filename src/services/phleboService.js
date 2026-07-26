import api from './api.js';

/** Public hire application */
export async function submitPhlebotomistApplication(payload) {
  const { data } = await api.post('/staff-applications/phlebotomist', payload);
  return data.data.application;
}

/** Admin */
export async function listApplications(params = {}) {
  const { data } = await api.get('/staff-applications', { params });
  return data.data;
}

export async function getApplication(id) {
  const { data } = await api.get(`/staff-applications/${id}`);
  return data.data.application;
}

export async function updateApplication(id, body) {
  const { data } = await api.put(`/staff-applications/${id}`, body);
  return data.data.application;
}

export async function promoteApplication(id) {
  const { data } = await api.post(`/staff-applications/${id}/promote`);
  return data.data;
}

export async function listRoster(params = {}) {
  const { data } = await api.get('/staff-applications/phlebotomists/roster', { params });
  return data.data.items || [];
}

export async function enablePhleboLogin(id) {
  const { data } = await api.post(`/staff-applications/phlebotomists/${id}/enable-login`);
  return data.data;
}

/** Field portal */
export async function getPhleboMe() {
  const { data } = await api.get('/phlebotomist/me');
  return data.data;
}

export async function getPhleboDashboard() {
  const { data } = await api.get('/phlebotomist/dashboard');
  return data.data;
}
