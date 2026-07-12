import api from './api';

export const listVaccines = (params = {}) =>
  api.get('/vaccination/vaccines', { params });

export const getVaccine = (slug) =>
  api.get(`/vaccination/vaccines/${slug}`);

export const createBooking = (payload) =>
  api.post('/vaccination/bookings', payload);

export const getMyBookings = () =>
  api.get('/vaccination/bookings/mine');

export const cancelBooking = (id) =>
  api.put(`/vaccination/bookings/${id}/cancel`);

export const adminListBookings = (params = {}) =>
  api.get('/admin/vaccination/bookings', { params });

export const adminUpdateBookingStatus = (id, status) =>
  api.put(`/admin/vaccination/bookings/${id}/status`, { status });
