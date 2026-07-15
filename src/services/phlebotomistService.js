import api from './api';

export const getMe = () => api.get('/phlebotomist/me');
export const getDashboard = () => api.get('/phlebotomist/dashboard');
export const listJobs = (params = {}) => api.get('/phlebotomist/jobs', { params });
export const getJob = (orderId) => api.get(`/phlebotomist/jobs/${orderId}`);
export const updateJobStatus = (orderId, body) =>
  api.put(`/phlebotomist/jobs/${orderId}/status`, body);
export const startDuty = (body = {}) => api.post('/phlebotomist/duty/start', body);
export const endDuty = (body = {}) => api.post('/phlebotomist/duty/end', body);

export const JOB_STATUSES = [
  { value: 'accepted', label: 'Accept job' },
  { value: 'reached', label: 'Reached location' },
  { value: 'patient_verified', label: 'Patient verified' },
  { value: 'sample_collected', label: 'Sample collected' },
  { value: 'sample_rejected', label: 'Sample rejected' },
  { value: 'failed', label: 'Failed / not available' },
  { value: 'cancelled', label: 'Cancel job' },
];
