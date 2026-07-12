import api from './api';

export const listPackages = (params = {}) =>
  api.get('/wellness/packages', { params });

export const getPackage = (slug) =>
  api.get(`/wellness/packages/${slug}`);
