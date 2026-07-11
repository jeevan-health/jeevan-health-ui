import api from './api';

export const sendOtp = (identifier, type = 'phone') =>
  api.post('/auth/send-otp', { identifier, type });

export const verifyOtp = (identifier, code) =>
  api.post('/auth/verify-otp', { identifier, code });

export const signup = (email, password) =>
  api.post('/auth/signup', { email, password });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const googleLogin = (credential) =>
  api.post('/auth/google', { credential });

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
