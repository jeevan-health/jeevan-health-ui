import api from './api';

export const listPackages = (params = {}) =>
  api.get('/physio/packages', { params });

export const getPackage = (slug) =>
  api.get(`/physio/packages/${slug}`);

export const createBooking = (payload) =>
  api.post('/physio/bookings', payload);

export const getMyBookings = () =>
  api.get('/physio/bookings/mine');

export const cancelBooking = (id) =>
  api.put(`/physio/bookings/${id}/cancel`);

export const adminListBookings = (params = {}) =>
  api.get('/admin/physio/bookings', { params });

export const adminUpdateBookingStatus = (id, status) =>
  api.put(`/admin/physio/bookings/${id}/status`, { status });
