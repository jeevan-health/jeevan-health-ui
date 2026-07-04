import api from './api';

export const calculateBMI = (data) => api.post('/wellness/calculator/bmi', data);
export const calculateBodyFat = (data) => api.post('/wellness/calculator/body-fat', data);
export const calculateCalories = (data) => api.post('/wellness/calculator/calories', data);

export const addVaccination = (data) => api.post('/wellness/vaccinations', data);
export const getVaccinations = () => api.get('/wellness/vaccinations');
export const getVaccinationSchedule = () => api.get('/wellness/vaccinations/schedule');

export const getNutritionPlans = (params) => api.get('/wellness/nutrition/plans', { params });
export const getNutritionPlan = (id) => api.get(`/wellness/nutrition/plans/${id}`);

export const logFood = (data) => api.post('/wellness/nutrition/log', data);
export const getFoodLogs = (params) => api.get('/wellness/nutrition/logs', { params });
