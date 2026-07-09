import { create } from 'zustand';

const KEY = 'jh_doctor_onboarding';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const useDoctorOnboardingStore = create((set, get) => ({
  entries: load(),

  addEntry: (data) => {
    const entry = { ...data, id: 'DOC-ONB-' + Date.now().toString(36).toUpperCase(), submittedAt: new Date().toISOString() };
    const entries = [entry, ...get().entries];
    save(entries);
    set({ entries });
    return entry;
  },
}));

export default useDoctorOnboardingStore;