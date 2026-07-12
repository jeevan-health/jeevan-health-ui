import api from './api';

export const listServices = (params = {}) =>
  api.get('/nursing/services', { params });

export const getService = (slug) =>
  api.get(`/nursing/services/${slug}`);

export const createBooking = (payload) =>
  api.post('/nursing/bookings', payload);

export const getMyBookings = () =>
  api.get('/nursing/bookings/mine');

export const cancelBooking = (id) =>
  api.put(`/nursing/bookings/${id}/cancel`);

export const adminListBookings = (params = {}) =>
  api.get('/admin/nursing/bookings', { params });

export const adminUpdateBookingStatus = (id, status) =>
  api.put(`/admin/nursing/bookings/${id}/status`, { status });
