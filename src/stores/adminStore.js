import { create } from 'zustand';
import { seedTests } from '../data/seedData';
import { getOrders, updateOrderStatus, updateOrder } from '../services/localOrderService';
import useAuthStore from './authStore';
import useAuditStore from './auditStore';

const COUPONS_KEY = 'jh_coupons';
const CONTACTS_KEY = 'jh_contacts';
const CATALOG_KEY = 'jh_catalog_overrides';

const load = (key, def) => { try { return JSON.parse(localStorage.getItem(key) || def); } catch { return JSON.parse(def); } };
const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const loadArr = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };

const defaultCoupons = [
  { code: 'WELCOME10', discount: 10, minOrder: 0, maxUses: 1000, usedCount: 0, expiresAt: null, active: true },
  { code: 'HEALTH20', discount: 20, minOrder: 2000, maxUses: 500, usedCount: 0, expiresAt: null, active: true },
  { code: 'JH50', discount: 50, minOrder: 5000, maxUses: 100, usedCount: 0, expiresAt: null, active: true },
];

const useAdminStore = create((set, get) => ({
  // Analytics
  analytics: { usersCount: 0, ordersCount: 0, revenue: 0, testsCount: seedTests.length, pendingOrders: 0, cancelledOrders: 0, completedOrders: 0, ordersByStatus: {}, revenueToday: 0, revenueMonth: 0, topTests: [],
    physioBookings: 0, physioRevenue: 0, physioTopConditions: [], physioBookingsToday: 0, physioBookingsMonth: 0,
    vaccBookings: 0, vaccRevenue: 0, vaccTopVaccines: [], vaccBookingsToday: 0, vaccBookingsMonth: 0,
  },

  // Orders
  orders: [],

  // Users
  usersList: [],

  // Coupons
  coupons: load(COUPONS_KEY, JSON.stringify(defaultCoupons)),

  // Contacts
  contacts: load(CONTACTS_KEY, '[]'),

  // Catalog overrides
  catalogOverrides: load(CATALOG_KEY, '{}'),

  // Computed catalog (base tests + overrides)
  getCatalog: () => {
    const overrides = get().catalogOverrides;
    const cats = load(CATALOG_KEY, '{}');
    return seedTests.map(t => cats[t.id] ? { ...t, ...cats[t.id] } : t);
  },

  // Analytics
  refreshAnalytics: () => {
    const orders = getOrders();
    const users = useAuthStore.getState().getUsers();
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const month = now.toISOString().slice(0, 7);

    const ordersByStatus = {};
    let revenue = 0, revenueToday = 0, revenueMonth = 0;
    let pending = 0, cancelled = 0, completed = 0;

    orders.forEach(o => {
      const s = o.status || 'pending';
      ordersByStatus[s] = (ordersByStatus[s] || 0) + 1;
      if (s === 'cancelled') cancelled++;
      else if (s === 'completed') completed++;
      else if (s === 'pending' || s === 'confirmed' || s === 'sample_collected' || s === 'processing') pending++;
      const amt = o.totalAmount || 0;
      revenue += amt;
      if (o.createdAt?.startsWith(today)) revenueToday += amt;
      if (o.createdAt?.startsWith(month)) revenueMonth += amt;
    });

    // Top selling tests
    const testSales = {};
    orders.forEach(o => (o.tests || []).forEach(t => { const n = t.name || t; testSales[n] = (testSales[n] || 0) + 1; }));
    const topTests = Object.entries(testSales).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name, count]) => ({ name, count }));

    // Physiotherapy stats
    const physioBookings = loadArr('jh_physio_bookings');
    let physioRevenue = 0, physioBookingsToday = 0, physioBookingsMonth = 0;
    const conditionSales = {};
    physioBookings.forEach(b => {
      const amt = b.totalAmount || 0;
      physioRevenue += amt;
      if (b.createdAt?.startsWith(today)) physioBookingsToday++;
      if (b.createdAt?.startsWith(month)) physioBookingsMonth++;
      const cond = b.condition || b.painArea || 'General';
      conditionSales[cond] = (conditionSales[cond] || 0) + 1;
    });
    const physioTopConditions = Object.entries(conditionSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));

    // Vaccination stats
    const vaccBookings = loadArr('jh_vaccination_bookings');
    let vaccRevenue = 0, vaccBookingsToday = 0, vaccBookingsMonth = 0;
    const vaccineSales = {};
    vaccBookings.forEach(b => {
      const amt = b.vaccinePrice || b.totalAmount || 0;
      vaccRevenue += amt;
      if (b.createdAt?.startsWith(today)) vaccBookingsToday++;
      if (b.createdAt?.startsWith(month)) vaccBookingsMonth++;
      const vn = b.vaccineName || 'Unknown';
      vaccineSales[vn] = (vaccineSales[vn] || 0) + 1;
    });
    const vaccTopVaccines = Object.entries(vaccineSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => ({ name, count }));

    set({
      analytics: { usersCount: users.length, ordersCount: orders.length, revenue, testsCount: seedTests.length, pendingOrders: pending, cancelledOrders: cancelled, completedOrders: completed, ordersByStatus, revenueToday, revenueMonth, topTests,
        physioBookings: physioBookings.length, physioRevenue, physioTopConditions, physioBookingsToday, physioBookingsMonth,
        vaccBookings: vaccBookings.length, vaccRevenue, vaccTopVaccines, vaccBookingsToday, vaccBookingsMonth,
      },
      orders,
      usersList: users,
    });
  },

  // Orders
  refreshOrders: () => set({ orders: getOrders() }),

  updateOrder: (id, status, extra) => {
    const prev = getOrders().find(o => o.id === id);
    if (status) updateOrderStatus(id, status);
    if (extra) updateOrder(id, extra);
    get().refreshOrders();
    get().refreshAnalytics();
    useAuditStore.getState().log('status_change', `Order ${id?.slice(0, 8)}: ${prev?.status || '?'} → ${status || extra ? 'updated' : '?'}`, 'orders');
  },

  // Coupons
  refreshCoupons: () => set({ coupons: load(COUPONS_KEY, JSON.stringify(defaultCoupons)) }),

  saveCoupon: (coupon) => {
    const coupons = [...get().coupons];
    const idx = coupons.findIndex(c => c.code === coupon.code);
    if (idx >= 0) coupons[idx] = coupon;
    else coupons.push(coupon);
    save(COUPONS_KEY, coupons);
    set({ coupons });
    useAuditStore.getState().log(idx >= 0 ? 'update' : 'create', `Coupon ${coupon.code}: ${coupon.discount}% off`, 'coupons');
  },

  deleteCoupon: (code) => {
    const coupons = get().coupons.filter(c => c.code !== code);
    save(COUPONS_KEY, coupons);
    set({ coupons });
    useAuditStore.getState().log('delete', `Coupon deleted: ${code}`, 'coupons');
  },

  // Contacts
  refreshContacts: () => set({ contacts: load(CONTACTS_KEY, '[]') }),

  addContact: (data) => {
    const contacts = [{ ...data, id: Date.now().toString(), createdAt: new Date().toISOString(), read: false }, ...load(CONTACTS_KEY, '[]')];
    save(CONTACTS_KEY, contacts);
    set({ contacts });
    useAuditStore.getState().log('create', `Contact form submission from ${data.name || data.email || 'unknown'}`, 'contacts');
  },

  markContactRead: (id) => {
    const contacts = get().contacts.map(c => c.id === id ? { ...c, read: true } : c);
    save(CONTACTS_KEY, contacts);
    set({ contacts });
  },

  // Catalog
  saveTestOverride: (testId, overrides) => {
    const cats = { ...load(CATALOG_KEY, '{}'), [testId]: overrides };
    save(CATALOG_KEY, cats);
    set({ catalogOverrides: cats });
    useAuditStore.getState().log('update', `Test override saved for test #${testId}`, 'catalog');
  },

  addCustomTest: (test) => {
    const maxId = Math.max(...seedTests.map(t => t.id), ...Object.values(load(CATALOG_KEY, '{}')).filter(t => t.id).map(t => t.id), 1000);
    const newTest = { ...test, id: maxId + 1, _custom: true };
    const cats = { ...load(CATALOG_KEY, '{}'), [newTest.id]: newTest };
    save(CATALOG_KEY, cats);
    set({ catalogOverrides: cats });
    useAuditStore.getState().log('create', `Custom test created: ${test.name}`, 'catalog');
  },

  resetCatalog: () => {
    localStorage.removeItem(CATALOG_KEY);
    set({ catalogOverrides: {} });
    useAuditStore.getState().log('delete', 'Catalog reset to defaults', 'catalog');
  },
}));

export default useAdminStore;
