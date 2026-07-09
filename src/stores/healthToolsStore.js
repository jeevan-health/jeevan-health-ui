import { create } from 'zustand';

const BP_KEY = 'jh_bp_readings';
const BMI_KEY = 'jh_bmi_history';
const PREG_KEY = 'jh_pregnancy_tracker';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || def); } catch { return JSON.parse(def); } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const useHealthToolsStore = create((set, get) => ({
  // BP readings
  bpReadings: load(BP_KEY, '[]'),
  addBpReading: (reading) => {
    const readings = [{ ...reading, id: Date.now(), date: new Date().toISOString() }, ...get().bpReadings];
    save(BP_KEY, readings);
    set({ bpReadings: readings });
  },
  clearBpReadings: () => { save(BP_KEY, '[]'); set({ bpReadings: [] }); },

  // BMI history
  bmiHistory: load(BMI_KEY, '[]'),
  addBmiRecord: (record) => {
    const history = [...get().bmiHistory, { ...record, id: Date.now(), date: new Date().toISOString() }];
    save(BMI_KEY, history);
    set({ bmiHistory: history });
  },
  clearBmiHistory: () => { save(BMI_KEY, '[]'); set({ bmiHistory: [] }); },

  // Pregnancy tracker
  pregnancyData: load(PREG_KEY, 'null'),
  updatePregnancy: (data) => { save(PREG_KEY, JSON.stringify(data)); set({ pregnancyData: data }); },
  clearPregnancy: () => { localStorage.removeItem(PREG_KEY); set({ pregnancyData: null }); },
}));

export default useHealthToolsStore;
