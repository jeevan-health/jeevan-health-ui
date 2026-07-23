import { create } from 'zustand';
import api from '../services/api';
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
    name: '',
    greeting: '',
    lastCheckup: null,
    healthScore: null,
    phone: '',
    email: '',
    bloodGroup: '',
    dob: '',
    gender: '',
  },

  healthData: null,
  scoreHistory: [],
  upcomingBookings: [],
  pastBookings: [],
  reports: [],
  family: [],
  invoices: [],
  appointments: [],
  wallet: { balance: 0, coupons: [], rewardsPoints: 0 },
  abha: { connected: false, number: '' },
  healthTrends: { hba1c: [] },
  notifications: [],
  savedPrescriptions: [],
  activeOrders: 0,
  loading: false,

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
  /**
   * Cancel a dashboard booking against the real API.
   * IDs are mapped as ORD-{numericId} (diagnostics) or APT-{numericId} (appointments).
   */
  cancelBooking: async (id) => {
    const key = String(id || '');
    try {
      if (key.startsWith('ORD-')) {
        const numId = key.slice(4);
        await api.put(`/diagnostics/orders/${numId}/cancel`);
        set((state) => ({
          upcomingBookings: state.upcomingBookings.filter((b) => b.id !== id),
        }));
        return { ok: true, type: 'order' };
      }
      if (key.startsWith('APT-')) {
        const numId = key.slice(4);
        await api.put(`/doctors/appointments/${numId}/cancel`);
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
          upcomingBookings: state.upcomingBookings.filter((b) => b.id !== id),
        }));
        return { ok: true, type: 'appointment' };
      }
      // Unknown / legacy local-only id
      set((state) => ({
        upcomingBookings: state.upcomingBookings.filter((b) => b.id !== id),
      }));
      return { ok: true, type: 'local' };
    } catch (err) {
      const message = err?.response?.data?.message
        || err?.response?.data?.error
        || 'Could not cancel. Please try again.';
      return { ok: false, error: message };
    }
  },

  fetchDashboard: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/user/dashboard');
      const { profile, upcomingAppointments, upcomingOrders, pastOrders, recentReports } = data;

      // Prefer structured patient on address; fall back to notes
      const mapOrderBooking = (o, isPast = false) => {
        let addr = o.collection_address || o.collectionAddress || {};
        if (typeof addr === 'string') {
          try { addr = JSON.parse(addr); } catch { addr = {}; }
        }
        const patient = addr.patient || null;
        let patientName = patient?.name || null;
        let patientAge = patient?.age ?? null;
        let patientGender = patient?.gender || null;
        let patientRelation = patient?.relation || null;
        if (!patientName && o.notes) {
          const nm = String(o.notes).match(/Patient:\s*([^|,]+)/i);
          const ag = String(o.notes).match(/Age:\s*(\d+)/i);
          const gn = String(o.notes).match(/Gender:\s*([^|,]+)/i);
          if (nm) patientName = nm[1].trim();
          if (ag) patientAge = ag[1];
          if (gn) patientGender = gn[1].trim();
        }
        const statusRaw = o.status || 'pending';
        const statusLabel = isPast
          ? (statusRaw === 'completed' ? 'Completed'
            : statusRaw === 'results_ready' ? 'Results Ready'
            : statusRaw === 'cancelled' ? 'Cancelled'
            : statusRaw.replace(/_/g, ' '))
          : (statusRaw === 'confirmed' ? 'Confirmed'
            : statusRaw === 'sample_collected' ? 'Sample Collected'
            : statusRaw === 'processing' ? 'Processing'
            : statusRaw === 'results_ready' ? 'Results Ready'
            : 'Pending');
        const city = (addr.city || '').toString();
        const cityCode = /hyderabad/i.test(city) ? 'HYD'
          : /bengaluru|bangalore/i.test(city) ? 'BLR'
          : /secunderabad/i.test(city) ? 'SEC'
          : /chennai/i.test(city) ? 'CHE'
          : /mumbai/i.test(city) ? 'MUM'
          : /delhi/i.test(city) ? 'DEL'
          : /pune/i.test(city) ? 'PUN'
          : 'HYD';
        const displayOrderId = o.display_order_id || o.displayOrderId
          || `JHC-${cityCode}-DIA-${String(o.id).padStart(5, '0')}`;
        const totalAmount = Number(o.total_amount ?? o.totalAmount) || 0;
        const paidAmount = Number(o.paid_amount ?? o.paidAmount) || 0;
        const balanceAmount = o.balance_amount != null
          ? Number(o.balance_amount)
          : Math.max(0, totalAmount - paidAmount);
        return {
          id: `ORD-${o.id}`,
          orderId: o.id,
          displayOrderId,
          test: ((o.tests || []).map((t) => t.name || t.test_name).filter(Boolean).join(', ')) || 'Diagnostic Order',
          date: o.collection_date ? fmt(new Date(o.collection_date)) : (o.created_at ? fmt(new Date(o.created_at)) : ''),
          time: o.collection_time || '',
          location: addr.addressLine || addr.address || 'Home Collection',
          address: [addr.addressLine, addr.city, addr.pincode].filter(Boolean).join(', '),
          status: statusLabel,
          statusRaw,
          patientName,
          patientAge,
          patientGender,
          patientRelation,
          patientLabel: patientName
            ? `${patientName}${patientAge != null && patientAge !== '' ? ` · ${patientAge} yrs` : ''}`
            : null,
          totalAmount,
          paidAmount,
          balanceAmount,
          paymentStatus: o.payment_status || o.paymentStatus || null,
          phlebotomistName: o.phlebotomist_name || o.phlebotomistName || null,
          phlebotomistEmployeeId: o.phlebotomist_employee_id || o.phlebotomistEmployeeId || null,
          phlebotomistPhone: o.phlebotomist_phone || o.phlebotomistPhone || null,
          phleboStatus: o.phlebo_status || o.phleboStatus || null,
        };
      };

      const upcomingBookings = (upcomingOrders || []).map((o) => mapOrderBooking(o, false));
      const pastBookings = (pastOrders || []).map((o) => mapOrderBooking(o, true));

      const appointments = (upcomingAppointments || []).map(a => ({
        id: `APT-${a.id}`,
        doctor: a.doctor_name || a.name,
        specialty: a.specialty || '',
        date: fmt(new Date(a.appointment_date)),
        time: a.time_slot || '',
        mode: a.type === 'video' ? 'Video Call' : a.type === 'audio' ? 'Audio Call' : a.type === 'clinic' ? 'Clinic Visit' : 'Online Consultation',
        status: a.status === 'scheduled' ? 'Upcoming' : a.status,
      }));

      const reports = (recentReports || []).map(r => ({
        id: `RPT-${r.id}`,
        test: r.test_name || 'Test Report',
        date: r.created_at ? fmt(new Date(r.created_at)) : '',
        lab: 'Jeevan Diagnostics',
        pdfUrl: r.pdf_url || '#',
        status: r.is_abnormal ? 'Abnormal' : 'Normal',
        abnormal: r.is_abnormal || false,
        values: r.values || {},
      }));

      const lastReportDate = reports.length > 0 ? reports[0].date : '';
      const lastAppointmentDate = (appointments || []).filter(a => a.status === 'Completed').length > 0
        ? appointments.filter(a => a.status === 'Completed')[0].date : '';

      set({
        profile: {
          name: profile?.name || '',
          // keep id for multi-tab safety checks if present
          id: profile?.id,
          greeting: '',
          lastCheckup: lastReportDate || lastAppointmentDate || '',
          healthScore: null,
          phone: profile?.phone || '',
          email: profile?.email || '',
          bloodGroup: profile?.bloodGroup || profile?.blood_group || '',
          dob: profile?.dob ? String(profile.dob).slice(0, 10) : '',
          gender: profile?.gender || '',
        },
        upcomingBookings,
        pastBookings,
        appointments,
        reports,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));

export { computeHealthScore, EMPTY_HEALTH };
export default useDashboardStore;
