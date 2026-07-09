import { create } from 'zustand';

const KEY = 'jh_patients';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || 'null') || def; } catch { return def; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const genId = () => 'PT-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

const usePatientsStore = create((set, get) => ({
  patients: load(KEY, []),

  addPatient: (data) => {
    const patient = { ...data, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), tags: data.tags || [] };
    const patients = [...get().patients, patient];
    save(KEY, patients);
    set({ patients });
    return patient;
  },

  updatePatient: (id, data) => {
    const patients = get().patients.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
    save(KEY, patients);
    set({ patients });
  },

  deletePatient: (id) => {
    const patients = get().patients.filter(p => p.id !== id);
    save(KEY, patients);
    set({ patients });
  },
}));

export default usePatientsStore;