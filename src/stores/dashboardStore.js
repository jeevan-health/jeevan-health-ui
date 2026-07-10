import { create } from 'zustand';

import useDailyActivityStore from './dailyActivityStore.js';

const now = new Date();
const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const futureDate = (days) => { const d = new Date(now); d.setDate(d.getDate() + days); return fmt(d); };
const pastDate = (days) => { const d = new Date(now); d.setDate(d.getDate() - days); return fmt(d); };

const EMPTY_HEALTH = {
  personalProfile: { ageGroup: '', gender: '', location: '' },
  lifestyle: { smoking: 'never', alcohol: 'never', exercise: 'frequent', sleep: 'good', stress: 'low' },
  bodyMeasurements: { heightCm: 0, weightKg: 0, bmi: 0, waistCm: 0 },
  familyHistory: { diabetes: false, bp: false, heartDisease: false, thyroid: false, cancer: false },
  medicalHistory: {} ,
  labResults: { hba1c: '', ldl: '', tsh: '', vitaminD: '', creatinine: '', egfr: '', alt: '', ast: '' },
};

function scorePersonalProfile(p) {
  const ageMap = { 'below-25': 4, '25-35': 5, '36-45': 5, '46-55': 3, 'above-55': 3 };
  return ageMap[p.ageGroup] || 0;
}

function scoreLifestyle(l) {
  const smokeMap = { never: 5, quit: 4, occasional: 2, daily: 0 };
  const alcoholMap = { never: 5, occasional: 4, weekly: 2, frequent: 0 };
  const exerciseMap = { frequent: 5, moderate: 3, sedentary: 1, none: 0 };
  const sleepMap = { good: 5, fair: 3, poor: 0 };
  const stressMap = { low: 5, moderate: 3, high: 1, 'very-high': 0 };
  return (smokeMap[l.smoking] || 0) + (alcoholMap[l.alcohol] || 0) + (exerciseMap[l.exercise] || 0) + (sleepMap[l.sleep] || 0) + (stressMap[l.stress] || 0);
}

function scoreBody(b) {
  const bmi = b.bmi;
  if (bmi <= 0) return 0;
  if (bmi >= 18.5 && bmi <= 24.9) return 20;
  if (bmi >= 25 && bmi <= 29.9) return 15;
  if (bmi >= 30 && bmi <= 34.9) return 10;
  if (bmi >= 35) return 5;
  if (bmi < 18.5) return 12;
  return 0;
}

function scoreFamilyHistory(f) {
  if (!f) return 15;
  let s = 15;
  if (f.diabetes) s -= 6;
  if (f.bp) s -= 3;
  if (f.heartDisease) s -= 5;
  if (f.thyroid) s -= 2;
  if (f.cancer) s -= 3;
  return Math.max(s, 0);
}

function scoreMedicalHistory(m) {
  const conditions = Object.values(m).filter(v => v === true || (typeof v === 'object' && v.has));
  if (conditions.length === 0) return 15;
  const controlled = Object.values(m).filter(v => typeof v === 'object' && v.has && v.controlled);
  if (conditions.length === 1 && controlled.length === 1) return 10;
  return 5;
}

function scoreLabResults(l, reports) {
  let s = 0;

  const hba1c = parseFloat(l.hba1c);
  if (!isNaN(hba1c)) {
    if (hba1c < 5.7) s += 6;
    else if (hba1c < 6.5) s += 3;
    else s += 1;
  } else {
    s += 3;
  }

  const ldl = parseFloat(l.ldl);
  if (!isNaN(ldl)) {
    if (ldl < 100) s += 4;
    else if (ldl < 130) s += 2;
    else s += 0;
  } else {
    s += 2;
  }

  const tsh = parseFloat(l.tsh);
  if (!isNaN(tsh)) {
    if (tsh >= 0.4 && tsh <= 4.5) s += 3;
    else s += 1;
  } else {
    s += 2;
  }

  const vitD = parseFloat(l.vitaminD);
  if (!isNaN(vitD)) {
    if (vitD >= 30) s += 2;
    else s += 0;
  } else {
    s += 1;
  }

  const creatinine = parseFloat(l.creatinine);
  if (!isNaN(creatinine)) {
    if (creatinine >= 0.6 && creatinine <= 1.3) s += 3;
    else s += 0;
  } else {
    s += 1;
  }

  const alt = parseFloat(l.alt);
  if (!isNaN(alt)) {
    if (alt <= 40) s += 2;
    else s += 0;
  } else {
    s += 1;
  }

  if (reports) {
    reports.forEach(r => {
      if (r.values) {
        Object.entries(r.values).forEach(([key, v]) => {
          if (/hba1c|glucose|diabetes/i.test(key) && (v.flag === 'high' || v.flag === 'abnormal')) s -= 2;
          if (/chol|ldl|triglyceride/i.test(key) && v.flag === 'high') s -= 1;
        });
      }
    });
  }

  return Math.max(Math.round(s), 0);
}

function getRecommendation(score) {
  if (score >= 90) return { zone: 'Excellent', color: '#16a34a', icon: '🌟', message: 'Excellent! Continue your healthy lifestyle.', action: 'Annual health screening' };
  if (score >= 75) return { zone: 'Good', color: '#22C55E', icon: '💚', message: 'Good health, but preventive improvements recommended.', action: 'Health checkup + Lifestyle improvement' };
  if (score >= 50) return { zone: 'Needs Attention', color: '#EAB308', icon: '⚠️', message: 'Some health areas need attention.', action: 'Doctor consultation + Specific tests' };
  return { zone: 'High Risk', color: '#EF4444', icon: '🚨', message: 'Your health risk needs immediate attention.', action: 'Doctor consultation + Complete health assessment' };
}

function computeHealthScore(healthData, reports, activityBonus = 0) {
  if (!healthData) return null;

  const personal = scorePersonalProfile(healthData.personalProfile || {});
  const lifestyle = scoreLifestyle(healthData.lifestyle || {});
  const body = scoreBody(healthData.bodyMeasurements || {});
  const family = scoreFamilyHistory(healthData.familyHistory);
  const medical = scoreMedicalHistory(healthData.medicalHistory || {});
  const labs = scoreLabResults(healthData.labResults || {}, reports);

  const total = personal + lifestyle + body + family + medical + labs + activityBonus;

  const categories = [
    { key: 'personal', label: 'Personal Profile', score: personal, max: 5, icon: '👤', color: '#1866C9' },
    { key: 'lifestyle', label: 'Lifestyle & Habits', score: lifestyle, max: 25, icon: '🏃', color: '#22C55E' },
    { key: 'body', label: 'Body Health', score: body, max: 20, icon: '⚖️', color: '#EAB308' },
    { key: 'family', label: 'Family Risk', score: family, max: 15, icon: '👪', color: '#F97316' },
    { key: 'medical', label: 'Medical Status', score: medical, max: 15, icon: '💊', color: '#A855F7' },
    { key: 'labs', label: 'Lab Health', score: labs, max: 20, icon: '🔬', color: '#06B6D4' },
  ];

  const recommendation = getRecommendation(total);

  return {
    score: Math.max(Math.round(total), 0),
    max: 100,
    categories,
    recommendation,
  };
}

const useDashboardStore = create((set, get) => ({
  profile: {
    name: 'Ashwin',
    greeting: 'Good Morning!',
    lastCheckup: pastDate(23),
    healthScore: null,
    phone: '+91 98765 43210',
    email: 'ashwin@example.com',
    bloodGroup: 'B+',
    dob: '15 Mar 1990',
    gender: 'Male',
  },

  healthData: null,

  scoreHistory: [],

  upcomingBookings: [
    { id: 'BK001', test: 'CBC + Vitamin D', date: futureDate(4), time: '8:00 AM – 9:00 AM', location: 'Home Collection', status: 'Confirmed' },
    { id: 'BK002', test: 'Lipid Profile', date: futureDate(10), time: '7:00 AM – 8:00 AM', location: 'Home Collection', status: 'Pending' },
  ],

  reports: [
    { id: 'RP001', test: 'Complete Blood Count (CBC)', date: pastDate(23), lab: 'Jeevan Diagnostics', pdfUrl: '#', status: 'Normal', abnormal: false, values: { WBC: { value: '7,500', unit: '/µL', range: '4,000–11,000', flag: 'normal' }, RBC: { value: '5.2', unit: 'M/µL', range: '4.5–5.9', flag: 'normal' }, Hemoglobin: { value: '15.2', unit: 'g/dL', range: '13.5–17.5', flag: 'normal' }, Platelets: { value: '2,50,000', unit: '/µL', range: '1,50,000–4,50,000', flag: 'normal' } } },
    { id: 'RP002', test: 'Vitamin D Total', date: pastDate(23), lab: 'Jeevan Diagnostics', pdfUrl: '#', status: 'Low', abnormal: true, values: { 'Vitamin D': { value: '18', unit: 'ng/mL', range: '30–100', flag: 'low' } } },
    { id: 'RP003', test: 'HbA1c', date: pastDate(60), lab: 'Jeevan Diagnostics', pdfUrl: '#', status: 'Normal', abnormal: false, values: { HbA1c: { value: '5.4', unit: '%', range: '<5.7', flag: 'normal' } } },
    { id: 'RP004', test: 'Lipid Profile', date: pastDate(90), lab: 'Jeevan Diagnostics', pdfUrl: '#', status: 'Borderline', abnormal: true, values: { Cholesterol: { value: '210', unit: 'mg/dL', range: '<200', flag: 'high' }, Triglycerides: { value: '150', unit: 'mg/dL', range: '<150', flag: 'normal' }, HDL: { value: '45', unit: 'mg/dL', range: '>40', flag: 'normal' }, LDL: { value: '130', unit: 'mg/dL', range: '<100', flag: 'high' } } },
  ],

  family: [
    { id: 'FM001', name: 'Ashwin', relation: 'Self', age: 34, gender: 'Male', bloodGroup: 'B+', lastCheckup: pastDate(23), abhaId: '14-XXXX-XXXX-1234' },
    { id: 'FM002', name: 'Priya', relation: 'Wife', age: 30, gender: 'Female', bloodGroup: 'O+', lastCheckup: pastDate(45), abhaId: '' },
    { id: 'FM003', name: 'Ananya', relation: 'Daughter', age: 6, gender: 'Female', bloodGroup: 'B+', lastCheckup: pastDate(60), abhaId: '' },
    { id: 'FM004', name: 'Arjun', relation: 'Son', age: 3, gender: 'Male', bloodGroup: 'B+', lastCheckup: pastDate(90), abhaId: '' },
  ],

  invoices: [
    { id: 'JH10234', package: 'Executive Package', amount: 1999, date: pastDate(23), status: 'Paid', gst: 'GSTIN: 36AABCJ1234F1Z5' },
    { id: 'JH10230', package: 'Vitamin Deficiency Panel', amount: 1499, date: pastDate(60), status: 'Paid' },
    { id: 'JH10225', package: 'CBC Test', amount: 499, date: pastDate(90), status: 'Paid' },
  ],

  appointments: [
    { id: 'AP001', doctor: 'Dr. S. Sharma', specialty: 'General Physician', date: futureDate(1), time: '6:00 PM', mode: 'Online Consultation', status: 'Upcoming', link: '#' },
    { id: 'AP002', doctor: 'Dr. R. Gupta', specialty: 'Endocrinologist', date: futureDate(15), time: '10:00 AM', mode: 'Clinic Visit', status: 'Upcoming' },
    { id: 'AP003', doctor: 'Dr. M. Reddy', specialty: 'Cardiologist', date: pastDate(30), time: '11:00 AM', mode: 'Online Consultation', status: 'Completed', diagnosis: 'Mild hypertension, advised lifestyle modification', prescription: 'Tab. Amlodipine 5mg OD', followUp: '3 months' },
    { id: 'AP004', doctor: 'Dr. P. Singh', specialty: 'General Physician', date: pastDate(60), time: '5:00 PM', mode: 'Online Consultation', status: 'Completed', diagnosis: 'Vitamin D deficiency', prescription: 'Tab. Calciferol 60K weekly', followUp: '2 months' },
  ],

  wallet: { balance: 350, coupons: [{ code: 'JEEVAN200', discount: 200, minOrder: 999, validUntil: futureDate(30) }, { code: 'FIRST50', discount: 50, minOrder: 499, validUntil: futureDate(15) }], rewardsPoints: 1250 },

  abha: { connected: true, number: '14-XXXX-XXXX-4567', linkedRecords: 8 },

  healthTrends: { hba1c: [{ date: pastDate(180), value: 6.9 }, { date: pastDate(120), value: 6.4 }, { date: pastDate(60), value: 5.9 }, { date: pastDate(23), value: 5.4 }] },

  notifications: [
    { id: 'NT001', text: 'Your CBC report is ready', type: 'report', date: pastDate(1), read: false },
    { id: 'NT002', text: 'Upcoming collection tomorrow at 8:00 AM', type: 'reminder', date: futureDate(0), read: false },
    { id: 'NT003', text: 'Time for your annual health checkup', type: 'reminder', date: pastDate(7), read: false },
    { id: 'NT004', text: 'Prescription uploaded successfully', type: 'success', date: pastDate(2), read: true },
  ],

  savedPrescriptions: [
    { id: 'PR001', name: 'Dr. M. Reddy', date: pastDate(30), medicines: 'Tab. Amlodipine 5mg' },
    { id: 'PR002', name: 'Dr. P. Singh', date: pastDate(60), medicines: 'Tab. Calciferol 60K' },
    { id: 'PR003', name: 'Dr. S. Sharma', date: pastDate(120), medicines: 'Tab. Multivitamin' },
  ],

  activeOrders: 2,

  unreadCount: () => get().notifications.filter(n => !n.read).length,

  markNotificationRead: (id) => set(state => ({ notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n) })),

  updateProfile: (updates) => set(state => ({ profile: { ...state.profile, ...updates } })),

  updateHealthData: (data) => set(state => {
    const oldScore = state.profile.healthScore;
    const activityBonus = useDailyActivityStore.getState().getHealthScoreImpact();
    const computed = computeHealthScore(data, state.reports, activityBonus);
    const newScore = computed ? computed.score : null;
    const history = [];
    if (oldScore != null && newScore != null && oldScore !== newScore) {
      history.push({ date: fmt(now), previousScore: oldScore, newScore, change: newScore - oldScore });
    }
    return {
      healthData: data,
      profile: { ...state.profile, healthScore: newScore },
      scoreHistory: [...state.scoreHistory, ...history],
    };
  }),

  addFamilyMember: (member) => set(state => ({ family: [...state.family, { ...member, id: `FM${Date.now()}` }] })),
  updateFamilyMember: (id, updates) => set(state => ({ family: state.family.map(m => m.id === id ? { ...m, ...updates } : m) })),
  removeFamilyMember: (id) => set(state => ({ family: state.family.filter(m => m.id !== id) })),
  cancelBooking: (id) => set(state => ({ upcomingBookings: state.upcomingBookings.filter(b => b.id !== id) })),
}));

const saved = localStorage.getItem('jh_family_v2');
if (saved) {
  try { useDashboardStore.getState().family = JSON.parse(saved); } catch { /* noop */ }
}

export { computeHealthScore, EMPTY_HEALTH };
export default useDashboardStore;
