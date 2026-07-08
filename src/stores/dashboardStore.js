import { create } from 'zustand';

const now = new Date();
const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
const futureDate = (days) => { const d = new Date(now); d.setDate(d.getDate() + days); return fmt(d); };
const pastDate = (days) => { const d = new Date(now); d.setDate(d.getDate() - days); return fmt(d); };

const useDashboardStore = create((set, get) => ({
  // Profile
  profile: {
    name: 'Ashwin',
    greeting: 'Good Morning!',
    lastCheckup: pastDate(23),
    healthScore: 82,
    phone: '+91 98765 43210',
    email: 'ashwin@example.com',
    bloodGroup: 'B+',
    dob: '15 Mar 1990',
    gender: 'Male',
  },

  // Upcoming Bookings
  upcomingBookings: [
    { id: 'BK001', test: 'CBC + Vitamin D', date: futureDate(4), time: '8:00 AM – 9:00 AM', location: 'Home Collection', status: 'Confirmed' },
    { id: 'BK002', test: 'Lipid Profile', date: futureDate(10), time: '7:00 AM – 8:00 AM', location: 'Home Collection', status: 'Pending' },
  ],

  // Reports
  reports: [
    { id: 'RP001', test: 'Complete Blood Count (CBC)', date: pastDate(23), lab: 'Jeevan Diagnostics', pdfUrl: '#', status: 'Normal', abnormal: false, values: { WBC: { value: '7,500', unit: '/µL', range: '4,000–11,000', flag: 'normal' }, RBC: { value: '5.2', unit: 'M/µL', range: '4.5–5.9', flag: 'normal' }, Hemoglobin: { value: '15.2', unit: 'g/dL', range: '13.5–17.5', flag: 'normal' }, Platelets: { value: '2,50,000', unit: '/µL', range: '1,50,000–4,50,000', flag: 'normal' } } },
    { id: 'RP002', test: 'Vitamin D Total', date: pastDate(23), lab: 'Jeevan Diagnostics', pdfUrl: '#', status: 'Low', abnormal: true, values: { 'Vitamin D': { value: '18', unit: 'ng/mL', range: '30–100', flag: 'low' } } },
    { id: 'RP003', test: 'HbA1c', date: pastDate(60), lab: 'Jeevan Diagnostics', pdfUrl: '#', status: 'Normal', abnormal: false, values: { HbA1c: { value: '5.4', unit: '%', range: '<5.7', flag: 'normal' } } },
    { id: 'RP004', test: 'Lipid Profile', date: pastDate(90), lab: 'Jeevan Diagnostics', pdfUrl: '#', status: 'Borderline', abnormal: true, values: { Cholesterol: { value: '210', unit: 'mg/dL', range: '<200', flag: 'high' }, Triglycerides: { value: '150', unit: 'mg/dL', range: '<150', flag: 'normal' }, HDL: { value: '45', unit: 'mg/dL', range: '>40', flag: 'normal' }, LDL: { value: '130', unit: 'mg/dL', range: '<100', flag: 'high' } } },
  ],

  // Family Members
  family: [
    { id: 'FM001', name: 'Ashwin', relation: 'Self', age: 34, gender: 'Male', bloodGroup: 'B+', lastCheckup: pastDate(23), abhaId: '14-XXXX-XXXX-1234' },
    { id: 'FM002', name: 'Priya', relation: 'Wife', age: 30, gender: 'Female', bloodGroup: 'O+', lastCheckup: pastDate(45), abhaId: '' },
    { id: 'FM003', name: 'Ananya', relation: 'Daughter', age: 6, gender: 'Female', bloodGroup: 'B+', lastCheckup: pastDate(60), abhaId: '' },
    { id: 'FM004', name: 'Arjun', relation: 'Son', age: 3, gender: 'Male', bloodGroup: 'B+', lastCheckup: pastDate(90), abhaId: '' },
  ],

  // Invoices
  invoices: [
    { id: 'JH10234', package: 'Executive Package', amount: 1999, date: pastDate(23), status: 'Paid', gst: 'GSTIN: 36AABCJ1234F1Z5' },
    { id: 'JH10230', package: 'Vitamin Deficiency Panel', amount: 1499, date: pastDate(60), status: 'Paid' },
    { id: 'JH10225', package: 'CBC Test', amount: 499, date: pastDate(90), status: 'Paid' },
  ],

  // Appointments
  appointments: [
    { id: 'AP001', doctor: 'Dr. S. Sharma', specialty: 'General Physician', date: futureDate(1), time: '6:00 PM', mode: 'Online Consultation', status: 'Upcoming', link: '#' },
    { id: 'AP002', doctor: 'Dr. R. Gupta', specialty: 'Endocrinologist', date: futureDate(15), time: '10:00 AM', mode: 'Clinic Visit', status: 'Upcoming' },
    { id: 'AP003', doctor: 'Dr. M. Reddy', specialty: 'Cardiologist', date: pastDate(30), time: '11:00 AM', mode: 'Online Consultation', status: 'Completed', diagnosis: 'Mild hypertension, advised lifestyle modification', prescription: 'Tab. Amlodipine 5mg OD', followUp: '3 months' },
    { id: 'AP004', doctor: 'Dr. P. Singh', specialty: 'General Physician', date: pastDate(60), time: '5:00 PM', mode: 'Online Consultation', status: 'Completed', diagnosis: 'Vitamin D deficiency', prescription: 'Tab. Calciferol 60K weekly', followUp: '2 months' },
  ],

  // Health Wallet
  wallet: {
    balance: 350,
    coupons: [
      { code: 'JEEVAN200', discount: 200, minOrder: 999, validUntil: futureDate(30) },
      { code: 'FIRST50', discount: 50, minOrder: 499, validUntil: futureDate(15) },
    ],
    rewardsPoints: 1250,
  },

  // ABHA
  abha: {
    connected: true,
    number: '14-XXXX-XXXX-4567',
    linkedRecords: 8,
  },

  // Health Trends
  healthTrends: {
    hba1c: [
      { date: pastDate(180), value: 6.9 },
      { date: pastDate(120), value: 6.4 },
      { date: pastDate(60), value: 5.9 },
      { date: pastDate(23), value: 5.4 },
    ],
  },

  // Notifications
  notifications: [
    { id: 'NT001', text: 'Your CBC report is ready', type: 'report', date: pastDate(1), read: false },
    { id: 'NT002', text: 'Upcoming collection tomorrow at 8:00 AM', type: 'reminder', date: futureDate(0), read: false },
    { id: 'NT003', text: 'Time for your annual health checkup', type: 'reminder', date: pastDate(7), read: false },
    { id: 'NT004', text: 'Prescription uploaded successfully', type: 'success', date: pastDate(2), read: true },
    { id: 'NT005', text: 'Health score improved to 82', type: 'achievement', date: pastDate(3), read: true },
  ],

  // Saved Prescriptions
  savedPrescriptions: [
    { id: 'PR001', name: 'Dr. M. Reddy', date: pastDate(30), medicines: 'Tab. Amlodipine 5mg' },
    { id: 'PR002', name: 'Dr. P. Singh', date: pastDate(60), medicines: 'Tab. Calciferol 60K' },
    { id: 'PR003', name: 'Dr. S. Sharma', date: pastDate(120), medicines: 'Tab. Multivitamin' },
  ],

  // Active orders count
  activeOrders: 2,

  // Notifications
  unreadCount: () => get().notifications.filter(n => !n.read).length,

  // Actions
  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
  })),

  addFamilyMember: (member) => set(state => ({
    family: [...state.family, { ...member, id: `FM${Date.now()}` }],
  })),

  cancelBooking: (id) => set(state => ({
    upcomingBookings: state.upcomingBookings.filter(b => b.id !== id),
  })),
}));

// Load from localStorage
const saved = localStorage.getItem('jh_family_v2');
if (saved) {
  try { useDashboardStore.getState().family = JSON.parse(saved); } catch { /* noop */ }
}

export default useDashboardStore;
