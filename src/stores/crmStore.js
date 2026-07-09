import { create } from 'zustand';
import useAuditStore from './auditStore';

const KEY = 'jh_crm';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || DEFAULT; } catch { return DEFAULT; } };
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const genId = () => 'CRM-' + Date.now().toString(36).toUpperCase();

const DEFAULT = {
  customers: [
    { id: genId(), name: 'Ravi Kumar', phone: '9876543210', email: 'ravi@example.com', source: 'website', tags: ['regular', 'family'], totalOrders: 8, totalSpent: 18500, lastOrder: '2025-07-05', status: 'active', createdAt: '2024-01-15' },
    { id: genId(), name: 'Sita Devi', phone: '9876543211', email: 'sita@example.com', source: 'referral', tags: ['senior'], totalOrders: 3, totalSpent: 7200, lastOrder: '2025-06-28', status: 'active', createdAt: '2024-03-20' },
    { id: genId(), name: 'Amit Singh', phone: '9876543212', email: 'amit@example.com', source: 'whatsapp', tags: ['new'], totalOrders: 1, totalSpent: 2500, lastOrder: '2025-07-01', status: 'active', createdAt: '2025-06-15' },
    { id: genId(), name: 'Priya Sharma', phone: '9876543213', email: 'priya@example.com', source: 'website', tags: ['corporate'], totalOrders: 0, totalSpent: 0, lastOrder: null, status: 'lead', createdAt: '2025-07-08' },
  ],
  interactions: [
    { id: 1, customerId: null, type: 'call', summary: 'Follow-up on pending report', staff: 'Raj (Support)', date: '2025-07-08 10:30', status: 'completed' },
    { id: 2, customerId: null, type: 'whatsapp', summary: 'Sent health tip — Monsoon care', staff: 'System', date: '2025-07-08 09:00', status: 'sent' },
    { id: 3, customerId: null, type: 'email', summary: 'Newsletter: Summer Health Checkup offer', staff: 'System', date: '2025-07-07 08:00', status: 'sent' },
    { id: 4, customerId: null, type: 'call', summary: 'Enquiry about Executive Health Package', staff: 'Sneha (Sales)', date: '2025-07-06 14:15', status: 'completed' },
  ],
  pipelines: [
    { name: 'Lead', count: 12, value: 180000 },
    { name: 'Contacted', count: 8, value: 145000 },
    { name: 'Proposal', count: 5, value: 320000 },
    { name: 'Negotiation', count: 3, value: 250000 },
    { name: 'Won', count: 18, value: 890000 },
  ],
};

const useCrmStore = create((set, get) => ({
  data: load(),

  addCustomer: (customer) => {
    const c = { ...customer, id: genId(), totalOrders: 0, totalSpent: 0, createdAt: new Date().toISOString(), status: 'lead' };
    const data = { ...get().data, customers: [c, ...get().data.customers] };
    save(data); set({ data });
    useAuditStore.getState().log('create', `CRM customer added: ${customer.name}`, 'crm');
    return c;
  },

  updateCustomer: (id, updates) => {
    const data = { ...get().data, customers: get().data.customers.map(c => c.id === id ? { ...c, ...updates } : c) };
    save(data); set({ data });
    useAuditStore.getState().log('update', `CRM customer updated: ${id}`, 'crm');
  },

  deleteCustomer: (id) => {
    const c = get().data.customers.find(c => c.id === id);
    const data = { ...get().data, customers: get().data.customers.filter(c => c.id !== id) };
    save(data); set({ data });
    useAuditStore.getState().log('delete', `CRM customer deleted: ${c?.name || id}`, 'crm');
  },

  addInteraction: (interaction) => {
    const id = Math.max(...get().data.interactions.map(i => i.id), 0) + 1;
    const data = { ...get().data, interactions: [{ id, ...interaction, date: new Date().toISOString() }, ...get().data.interactions] };
    save(data); set({ data });
    useAuditStore.getState().log('create', `CRM interaction logged: ${interaction.type} — ${interaction.summary?.slice(0, 50)}`, 'crm');
  },

  updatePipeline: (pipelines) => {
    const data = { ...get().data, pipelines };
    save(data); set({ data });
  },

  reset: () => { save(DEFAULT); set({ data: DEFAULT }); },
}));

export default useCrmStore;