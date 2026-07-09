import { create } from 'zustand';
import useAuditStore from './auditStore';

const KEY = 'jh_whatsapp';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || DEFAULT; } catch { return DEFAULT; } };
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const DEFAULT = {
  templates: [
    { id: 1, name: 'booking_confirmation', label: 'Booking Confirmation', category: 'utility', content: 'Hi {{name}}, your booking #{{id}} is confirmed for {{date}} at {{time}}. Jeevan HealthCare at Home', status: 'approved' },
    { id: 2, name: 'report_ready', label: 'Report Ready', category: 'utility', content: 'Hi {{name}}, your test report is ready. Download: {{link}}. Jeevan HealthCare at Home', status: 'approved' },
    { id: 3, name: 'appointment_reminder', label: 'Appointment Reminder', category: 'utility', content: 'Reminder: {{name}}, your appointment is tomorrow at {{time}}. Jeevan HealthCare at Home', status: 'approved' },
    { id: 4, name: 'payment_receipt', label: 'Payment Receipt', category: 'utility', content: 'Hi {{name}}, payment of ₹{{amount}} received for order #{{id}}. Jeevan HealthCare at Home', status: 'approved' },
    { id: 5, name: 'health_tip', label: 'Health Tip', category: 'marketing', content: 'Health Tip: {{tip}}. Stay healthy! Jeevan HealthCare at Home', status: 'pending' },
  ],
  messages: [
    { id: 1, to: '9876543210', template: 'booking_confirmation', status: 'sent', sentAt: '2025-07-08 10:30', delivered: true, read: true },
    { id: 2, to: '9876543211', template: 'report_ready', status: 'sent', sentAt: '2025-07-08 09:15', delivered: true, read: false },
    { id: 3, to: '9876543212', template: 'appointment_reminder', status: 'failed', sentAt: '2025-07-07 18:00', delivered: false, read: false, error: 'Number opted out' },
    { id: 4, to: '9876543213', template: 'payment_receipt', status: 'sent', sentAt: '2025-07-07 14:20', delivered: true, read: true },
  ],
  analytics: { totalSent: 4520, delivered: 4350, read: 3210, failed: 170, optOuts: 45, monthlySent: 680 },
};

const useWhatsAppStore = create((set, get) => ({
  data: load(),

  addTemplate: (tmpl) => {
    const id = Math.max(...get().data.templates.map(t => t.id), 0) + 1;
    const data = { ...get().data, templates: [...get().data.templates, { id, ...tmpl, createdAt: new Date().toISOString() }] };
    save(data); set({ data });
    useAuditStore.getState().log('create', `WhatsApp template created: ${tmpl.name}`, 'whatsapp');
  },

  updateTemplate: (id, updates) => {
    const data = { ...get().data, templates: get().data.templates.map(t => t.id === id ? { ...t, ...updates } : t) };
    save(data); set({ data });
    useAuditStore.getState().log('update', `WhatsApp template updated: ${id}`, 'whatsapp');
  },

  deleteTemplate: (id) => {
    const data = { ...get().data, templates: get().data.templates.filter(t => t.id !== id) };
    save(data); set({ data });
  },

  sendMessage: (msg) => {
    const id = Math.max(...get().data.messages.map(m => m.id), 0) + 1;
    const message = { id, ...msg, status: 'sent', sentAt: new Date().toISOString(), delivered: false, read: false };
    const data = {
      ...get().data,
      messages: [message, ...get().data.messages],
      analytics: { ...get().data.analytics, totalSent: get().data.analytics.totalSent + 1, monthlySent: get().data.analytics.monthlySent + 1 },
    };
    save(data); set({ data });
    useAuditStore.getState().log('create', `WhatsApp message sent to ${msg.to}`, 'whatsapp');
    return message;
  },

  reset: () => { save(DEFAULT); set({ data: DEFAULT }); },
}));

export default useWhatsAppStore;