import api from './api';

export const sendOtp = (identifier, type) =>
  api.post('/auth/send-otp', { identifier, type });

export const verifyOtp = (identifier, code, type) =>
  api.post('/auth/verify-otp', { identifier, code, type });

export const getProfile = () =>
  api.get('/user/profile');

export const updateProfile = (data) =>
  api.put('/user/profile', data);

export const getFamilyMembers = () =>
  api.get('/user/family');

export const addFamilyMember = (data) =>
  api.post('/user/family', data);

export const updateFamilyMember = (id, data) =>
  api.put(`/user/family/${id}`, data);

export const deleteFamilyMember = (id) =>
  api.delete(`/user/family/${id}`);
