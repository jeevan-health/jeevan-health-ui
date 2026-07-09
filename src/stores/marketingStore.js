import { create } from 'zustand';
import useAuditStore from './auditStore';

const KEY = 'jh_marketing';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || DEFAULT; } catch { return DEFAULT; } };
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const DEFAULT = {
  campaigns: [
    { id: 1, name: 'Summer Health Checkup', channel: 'email', budget: 25000, spent: 18000, sent: 2500, opens: 850, clicks: 320, conversions: 45, startDate: '2025-06-01', endDate: '2025-07-15', status: 'active' },
    { id: 2, name: 'Diabetes Awareness', channel: 'whatsapp', budget: 15000, spent: 12000, sent: 1800, opens: 1100, clicks: 540, conversions: 28, startDate: '2025-06-15', endDate: '2025-07-31', status: 'active' },
    { id: 3, name: 'Corporate Wellness Drive', channel: 'linkedin', budget: 30000, spent: 30000, sent: 500, opens: 320, clicks: 180, conversions: 12, startDate: '2025-05-01', endDate: '2025-06-30', status: 'completed' },
    { id: 4, name: 'Monsoon Health Tips', channel: 'blog', budget: 5000, spent: 2000, sent: 0, opens: 0, clicks: 0, conversions: 0, startDate: '2025-07-10', endDate: '2025-08-10', status: 'planned' },
  ],
  channels: [
    { name: 'Email', icon: '✉️', active: true, monthlyBudget: 20000, subscribers: 45000 },
    { name: 'WhatsApp', icon: '💬', active: true, monthlyBudget: 15000, subscribers: 28000 },
    { name: 'SMS', icon: '📱', active: true, monthlyBudget: 10000, subscribers: 52000 },
    { name: 'Google Ads', icon: '🔍', active: true, monthlyBudget: 40000, impressions: 180000 },
    { name: 'Facebook/Instagram', icon: '📷', active: false, monthlyBudget: 25000, impressions: 95000 },
    { name: 'LinkedIn', icon: '💼', active: true, monthlyBudget: 20000, impressions: 35000 },
  ],
  analytics: { totalSpend: 380000, monthlySpend: 62000, totalConversions: 1240, costPerConversion: 306, roas: 3.2 },
};

const useMarketingStore = create((set, get) => ({
  data: load(),

  addCampaign: (campaign) => {
    const id = Math.max(...get().data.campaigns.map(c => c.id), 0) + 1;
    const data = { ...get().data, campaigns: [...get().data.campaigns, { id, ...campaign, createdAt: new Date().toISOString() }] };
    save(data); set({ data });
    useAuditStore.getState().log('create', `Marketing campaign created: ${campaign.name}`, 'marketing');
  },

  updateCampaign: (id, updates) => {
    const c = get().data.campaigns.find(c => c.id === id);
    const data = { ...get().data, campaigns: get().data.campaigns.map(c => c.id === id ? { ...c, ...updates } : c) };
    save(data); set({ data });
    useAuditStore.getState().log('update', `Marketing campaign updated: ${c?.name || id}`, 'marketing');
  },

  deleteCampaign: (id) => {
    const c = get().data.campaigns.find(c => c.id === id);
    const data = { ...get().data, campaigns: get().data.campaigns.filter(c => c.id !== id) };
    save(data); set({ data });
    useAuditStore.getState().log('delete', `Marketing campaign deleted: ${c?.name || id}`, 'marketing');
  },

  updateChannel: (name, updates) => {
    const data = { ...get().data, channels: get().data.channels.map(ch => ch.name === name ? { ...ch, ...updates } : ch) };
    save(data); set({ data });
  },

  reset: () => { save(DEFAULT); set({ data: DEFAULT }); },
}));

export default useMarketingStore;