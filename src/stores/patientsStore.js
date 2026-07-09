import { create } from 'zustand';
import useAuditStore from './auditStore';

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
    useAuditStore.getState().log('create', `Patient created: ${data.name} (${data.phone})`, 'patients');
    return patient;
  },

  updatePatient: (id, data) => {
    const prev = get().patients.find(p => p.id === id);
    const patients = get().patients.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
    save(KEY, patients);
    set({ patients });
    useAuditStore.getState().log('update', `Patient updated: ${prev?.name || id?.slice(0, 8)}`, 'patients');
  },

  deletePatient: (id) => {
    const prev = get().patients.find(p => p.id === id);
    const patients = get().patients.filter(p => p.id !== id);
    save(KEY, patients);
    set({ patients });
    useAuditStore.getState().log('delete', `Patient deleted: ${prev?.name || id?.slice(0, 8)}`, 'patients');
  },
}));

export default usePatientsStore;