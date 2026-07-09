import { create } from 'zustand';
import useAuditStore from './auditStore';

const KEY = 'jh_crm';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || DEFAULT; } catch { return DEFAULT; } };
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const genId = () => 'CRM-' + Date.now().toString(36).toUpperCase();

const DEFAULT = {
  customers: [
    { id: genId(), name: 'Ravi Kumar', phone: '9876543210', email: 'ravi@example.com', source: 'website', tags: ['regular', 'family'], totalOrders: 8, totalSpent: 18500, lastOrder: '2025-07-05', status: 'active', createdAt: '2024-01-15', city: 'Bangalore', notes: 'Prefers morning collection. Has diabetes history.', nextFollowUp: '2025-07-15', followUpNote: 'Remind about quarterly checkup' },
    { id: genId(), name: 'Sita Devi', phone: '9876543211', email: 'sita@example.com', source: 'referral', tags: ['senior'], totalOrders: 3, totalSpent: 7200, lastOrder: '2025-06-28', status: 'active', createdAt: '2024-03-20', city: 'Bangalore', notes: 'Senior citizen, needs home collection.', nextFollowUp: '2025-07-20', followUpNote: 'Check if she needs thyroid test' },
    { id: genId(), name: 'Amit Singh', phone: '9876543212', email: 'amit@example.com', source: 'whatsapp', tags: ['new'], totalOrders: 1, totalSpent: 2500, lastOrder: '2025-07-01', status: 'active', createdAt: '2025-06-15', city: 'Mumbai', notes: 'First time customer. Interested in full body checkup.', nextFollowUp: '2025-07-14', followUpNote: 'Share full body checkup packages' },
    { id: genId(), name: 'Priya Sharma', phone: '9876543213', email: 'priya@example.com', source: 'website', tags: ['corporate'], totalOrders: 0, totalSpent: 0, lastOrder: null, status: 'lead', createdAt: '2025-07-08', city: 'Bangalore', notes: 'Enquired about corporate wellness program.', nextFollowUp: '2025-07-12', followUpNote: 'Send corporate brochure' },
    { id: genId(), name: 'Vikram Patel', phone: '9876543214', email: 'vikram@example.com', source: 'walkin', tags: ['vip', 'family'], totalOrders: 12, totalSpent: 45000, lastOrder: '2025-07-06', status: 'active', createdAt: '2023-11-01', city: 'Bangalore', notes: 'VIP client. Head of HR at TechCorp. Handles all employee health checkups.', nextFollowUp: '2025-07-25', followUpNote: 'Quarterly review of corporate account' },
    { id: genId(), name: 'Neha Gupta', phone: '9876543215', email: 'neha@example.com', source: 'call', tags: ['pregnant'], totalOrders: 2, totalSpent: 5400, lastOrder: '2025-06-20', status: 'active', createdAt: '2025-05-10', city: 'Delhi', notes: 'Prenatal care. Regular blood tests needed.', nextFollowUp: '2025-07-18', followUpNote: 'Schedule next prenatal test' },
  ],
  interactions: [
    { id: 1, customerId: null, type: 'call', summary: 'Follow-up on pending report', staff: 'Raj (Support)', date: '2025-07-08 10:30', status: 'completed' },
    { id: 2, customerId: null, type: 'whatsapp', summary: 'Sent health tip — Monsoon care', staff: 'System', date: '2025-07-08 09:00', status: 'sent' },
    { id: 3, customerId: null, type: 'email', summary: 'Newsletter: Summer Health Checkup offer', staff: 'System', date: '2025-07-07 08:00', status: 'sent' },
    { id: 4, customerId: null, type: 'call', summary: 'Enquiry about Executive Health Package', staff: 'Sneha (Sales)', date: '2025-07-06 14:15', status: 'completed' },
  ],
  pipelines: [
    { name: 'Lead', count: 12, value: 180000, color: '#fef9c3' },
    { name: 'Contacted', count: 8, value: 145000, color: '#dbeafe' },
    { name: 'Proposal', count: 5, value: 320000, color: '#e0e7ff' },
    { name: 'Negotiation', count: 3, value: 250000, color: '#f3e8ff' },
    { name: 'Won', count: 18, value: 890000, color: '#dcfce7' },
  ],
  tasks: [
    { id: 1, title: 'Call Ravi Kumar for quarterly checkup reminder', customerId: null, dueDate: '2025-07-15', priority: 'high', status: 'pending', assignedTo: 'Admin' },
    { id: 2, title: 'Send corporate brochure to Priya Sharma', customerId: null, dueDate: '2025-07-12', priority: 'medium', status: 'pending', assignedTo: 'Admin' },
    { id: 3, title: 'Follow up with TechCorp for Q3 contract', customerId: null, dueDate: '2025-07-20', priority: 'high', status: 'pending', assignedTo: 'Admin' },
    { id: 4, title: 'Review monthly campaign performance', customerId: null, dueDate: '2025-07-10', priority: 'low', status: 'completed', assignedTo: 'Admin' },
  ],
  analytics: { totalLeads: 4, conversionRate: 68, avgDealValue: 45000, mrr: 185000, churnRate: 3.2 },
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

  getCustomerInteractions: (customerId) => {
    return get().data.interactions.filter(i => i.customerId === customerId);
  },

  // Tasks
  addTask: (task) => {
    const id = Math.max(...get().data.tasks.map(t => t.id), 0) + 1;
    const data = { ...get().data, tasks: [...get().data.tasks, { id, ...task, createdAt: new Date().toISOString() }] };
    save(data); set({ data });
    useAuditStore.getState().log('create', `CRM task created: ${task.title}`, 'crm');
  },

  updateTask: (id, updates) => {
    const data = { ...get().data, tasks: get().data.tasks.map(t => t.id === id ? { ...t, ...updates } : t) };
    save(data); set({ data });
  },

  deleteTask: (id) => {
    const data = { ...get().data, tasks: get().data.tasks.filter(t => t.id !== id) };
    save(data); set({ data });
  },

  // Pipeline
  addPipelineStage: (stage) => {
    const data = { ...get().data, pipelines: [...get().data.pipelines, stage] };
    save(data); set({ data });
  },

  deletePipelineStage: (name) => {
    const data = { ...get().data, pipelines: get().data.pipelines.filter(p => p.name !== name) };
    save(data); set({ data });
  },

  updatePipelineStage: (name, updates) => {
    const data = { ...get().data, pipelines: get().data.pipelines.map(p => p.name === name ? { ...p, ...updates } : p) };
    save(data); set({ data });
  },

  reset: () => { save(DEFAULT); set({ data: DEFAULT }); },
}));

export default useCrmStore;