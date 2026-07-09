import { create } from 'zustand';

const KEY = 'jh_doctors';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || 'null') || def; } catch { return def; } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const genId = () => 'DR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();

const SPECIALTIES = ['General Physician', 'Cardiologist', 'Dermatologist', 'Endocrinologist', 'ENT Specialist', 'Gastroenterologist', 'Gynecologist', 'Nephrologist', 'Neurologist', 'Ophthalmologist', 'Orthopedic', 'Pediatrician', 'Psychiatrist', 'Pulmonologist', 'Rheumatologist', 'Urologist', 'Dietitian/Nutritionist', 'Physiotherapist', 'Homeopath', 'Ayurvedic'];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const useDoctorsStore = create((set, get) => ({
  doctors: load(KEY, []),

  addDoctor: (data) => {
    const doctor = { ...data, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), isActive: true };
    const doctors = [...get().doctors, doctor];
    save(KEY, doctors);
    set({ doctors });
    return doctor;
  },

  updateDoctor: (id, data) => {
    const doctors = get().doctors.map(d => d.id === id ? { ...d, ...data, updatedAt: new Date().toISOString() } : d);
    save(KEY, doctors);
    set({ doctors });
  },

  deleteDoctor: (id) => {
    const doctors = get().doctors.filter(d => d.id !== id);
    save(KEY, doctors);
    set({ doctors });
  },
}));

export { SPECIALTIES, DAYS };
export default useDoctorsStore;