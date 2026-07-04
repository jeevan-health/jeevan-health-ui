import api from './api';

export const searchDoctors = (params) => api.get('/doctors/search', { params });
export const getDoctor = (id) => api.get(`/doctors/${id}`);
export const getSpecialties = () => api.get('/doctors/specialties');
export const getDoctorReviews = (id) => api.get(`/doctors/${id}/reviews`);

export const getBookedSlots = (doctorId, date) =>
  api.get('/doctors/slots/available', { params: { doctorId, date } });

export const bookAppointment = (data) => api.post('/doctors/appointments', data);
export const getMyAppointments = () => api.get('/doctors/appointments/mine');
export const cancelAppointment = (id) => api.put(`/doctors/appointments/${id}/cancel`);

export const startConsultation = (appointmentId) => api.post(`/doctors/consultations/${appointmentId}/start`);
export const getConsultation = (appointmentId) => api.get(`/doctors/consultations/${appointmentId}`);
export const sendMessage = (appointmentId, content, sender) =>
  api.post(`/doctors/consultations/${appointmentId}/message`, { content, sender });
export const endConsultation = (appointmentId) => api.put(`/doctors/consultations/${appointmentId}/end`);

export const getPrescription = (appointmentId) => api.get(`/doctors/prescriptions/${appointmentId}`);

export const addReview = (data) => api.post('/doctors/reviews', data);
