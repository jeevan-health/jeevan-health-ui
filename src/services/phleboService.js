import api from './api.js';

/** Public hire application — returns { application, assessment } (Phase 9) */
export async function submitPhlebotomistApplication(payload) {
  const { data } = await api.post('/staff-applications/phlebotomist', payload);
  return data.data;
}

/** Public assessment by token */
export async function getAssessmentByToken(token) {
  const { data } = await api.get(`/staff-applications/assessment/${encodeURIComponent(token)}`);
  return data.data;
}

export async function submitAssessmentByToken(token, answers) {
  const { data } = await api.post(`/staff-applications/assessment/${encodeURIComponent(token)}/submit`, {
    answers,
  });
  return data.data;
}

export async function resendAssessment(applicationId) {
  const { data } = await api.post(`/staff-applications/${applicationId}/assessment/resend`);
  return data.data;
}

export async function extendAssessment(applicationId, hours = 24) {
  const { data } = await api.post(`/staff-applications/${applicationId}/assessment/extend`, { hours });
  return data.data.assessment;
}

export async function overrideAssessment(applicationId, body) {
  const { data } = await api.post(`/staff-applications/${applicationId}/assessment/override`, body);
  return data.data.assessment;
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

export async function listPhleboJobs(params = {}) {
  const { data } = await api.get('/phlebotomist/jobs', { params });
  return data.data;
}

export async function getPhleboJob(orderId) {
  const { data } = await api.get(`/phlebotomist/jobs/${orderId}`);
  return data.data;
}

export async function updatePhleboJobStatus(orderId, payload) {
  const { data } = await api.put(`/phlebotomist/jobs/${orderId}/status`, payload);
  return data.data.job;
}

export async function startDuty(payload = {}) {
  const { data } = await api.post('/phlebotomist/duty/start', payload);
  return data.data.duty;
}

export async function endDuty(payload = {}) {
  const { data } = await api.post('/phlebotomist/duty/end', payload);
  return data.data.duty;
}
