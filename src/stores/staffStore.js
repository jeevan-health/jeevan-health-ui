import { create } from 'zustand';

const KEY = 'jh_staff_onboarding';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } };
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const useStaffStore = create((set, get) => ({
  entries: load(),

  addEntry: (data) => {
    const entry = {
      ...data,
      id: 'ONB-' + Date.now().toString(36).toUpperCase(),
      submittedAt: new Date().toISOString(),
      status: data.status || 'new',
      applicationType: data.applicationType || 'staff',
    };
    const entries = [entry, ...get().entries];
    save(entries);
    set({ entries });
    return entry;
  },

  updateEntry: (id, updates) => {
    const entries = get().entries.map((e) =>
      e.id === id ? { ...e, ...updates, reviewedAt: new Date().toISOString() } : e
    );
    save(entries);
    set({ entries });
    return entries.find((e) => e.id === id) || null;
  },

  removeEntry: (id) => {
    const entries = get().entries.filter((e) => e.id !== id);
    save(entries);
    set({ entries });
  },
}));

export default useStaffStore;