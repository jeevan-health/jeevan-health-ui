import api from './api';

export const getMe = () => api.get('/phlebotomist/me');
export const getDashboard = () => api.get('/phlebotomist/dashboard');
export const listJobs = (params = {}) => api.get('/phlebotomist/jobs', { params });
export const getJob = (orderId) => api.get(`/phlebotomist/jobs/${orderId}`);
export const updateJobStatus = (orderId, body) =>
  api.put(`/phlebotomist/jobs/${orderId}/status`, body);
export const startDuty = (body = {}) => api.post('/phlebotomist/duty/start', body);
export const endDuty = (body = {}) => api.post('/phlebotomist/duty/end', body);

/** Happy-path forward statuses (UI labels). Fail/reject/cancel are separate. */
export const JOB_STATUSES = [
  { value: 'accepted', label: 'Accept job' },
  { value: 'reached', label: 'Reached location' },
  { value: 'patient_verified', label: 'Patient verified' },
  { value: 'sample_collected', label: 'Sample collected' },
];

export const CLOSE_STATUSES = [
  { value: 'sample_rejected', label: 'Sample rejected' },
  { value: 'failed', label: 'Failed / not available' },
  { value: 'cancelled', label: 'Cancel job' },
];

export const FASTING_OPTIONS = [
  { value: 'fasting_ok', label: 'Patient fasting as advised' },
  { value: 'non_fasting', label: 'Non-fasting (as advised / random)' },
  { value: 'not_required', label: 'Fasting not required for these tests' },
];

/** Calendar date YYYY-MM-DD in Asia/Kolkata for local filters. */
export function todayIST() {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  } catch {
    const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  }
}
