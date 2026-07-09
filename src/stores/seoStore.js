import { create } from 'zustand';
import useAuditStore from './auditStore';

const KEY = 'jh_seo';
const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || DEFAULT; } catch { return DEFAULT; } };
const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

const DEFAULT = {
  keywords: [
    { id: 1, keyword: 'blood test bangalore', volume: 5400, difficulty: 45, rank: 3, trend: 'up', lastChecked: '2025-07-08' },
    { id: 2, keyword: 'health checkup packages', volume: 3200, difficulty: 52, rank: 5, trend: 'up', lastChecked: '2025-07-08' },
    { id: 3, keyword: 'home sample collection', volume: 2800, difficulty: 38, rank: 2, trend: 'stable', lastChecked: '2025-07-07' },
    { id: 4, keyword: 'diabetes test at home', volume: 2100, difficulty: 42, rank: 4, trend: 'up', lastChecked: '2025-07-07' },
    { id: 5, keyword: 'thyroid test price', volume: 1800, difficulty: 35, rank: 1, trend: 'up', lastChecked: '2025-07-06' },
    { id: 6, keyword: 'full body checkup', volume: 4500, difficulty: 58, rank: 7, trend: 'down', lastChecked: '2025-07-06' },
  ],
  pages: [
    { route: '/', title: 'Home — Jeevan HealthCare at Home', metaDesc: 'Book diagnostic tests & health checkups...', ogImage: '/og-home.jpg', status: 'good', lastScanned: '2025-07-08', score: 92 },
    { route: '/diagnostics', title: 'Diagnostic Tests — Jeevan HealthCare at Home', metaDesc: 'Browse all diagnostic tests...', ogImage: '/og-diag.jpg', status: 'good', lastScanned: '2025-07-08', score: 88 },
    { route: '/services', title: 'Health Checkup Packages — Jeevan HealthCare at Home', metaDesc: 'Comprehensive health checkup packages...', ogImage: '/og-services.jpg', status: 'needs_work', lastScanned: '2025-07-07', score: 72 },
    { route: '/blog', title: 'Health Blog — Jeevan HealthCare at Home', metaDesc: 'Health tips and medical insights...', ogImage: '/og-blog.jpg', status: 'needs_work', lastScanned: '2025-07-07', score: 65 },
    { route: '/contact', title: 'Contact Us — Jeevan HealthCare at Home', metaDesc: 'Get in touch...', ogImage: '/og-contact.jpg', status: 'good', lastScanned: '2025-07-06', score: 85 },
  ],
  analytics: {
    totalPages: 24, indexedPages: 18, sitemapUrl: '/sitemap.xml', robotsTxt: 'Valid', lastCrawl: '2025-07-08',
    organicTraffic: 12450, organicChange: '+12%', backlinks: 340, backlinksChange: '+8',
  },
};

const useSeoStore = create((set, get) => ({
  data: load(),

  updateKeyword: (id, updates) => {
    const data = { ...get().data, keywords: get().data.keywords.map(k => k.id === id ? { ...k, ...updates } : k) };
    save(data); set({ data });
    useAuditStore.getState().log('update', `SEO keyword updated: ${updates.keyword || id}`, 'seo');
  },

  addKeyword: (kw) => {
    const id = Math.max(...get().data.keywords.map(k => k.id), 0) + 1;
    const data = { ...get().data, keywords: [...get().data.keywords, { id, ...kw, lastChecked: new Date().toISOString().slice(0, 10) }] };
    save(data); set({ data });
    useAuditStore.getState().log('create', `SEO keyword added: ${kw.keyword}`, 'seo');
  },

  deleteKeyword: (id) => {
    const kw = get().data.keywords.find(k => k.id === id);
    const data = { ...get().data, keywords: get().data.keywords.filter(k => k.id !== id) };
    save(data); set({ data });
    useAuditStore.getState().log('delete', `SEO keyword deleted: ${kw?.keyword || id}`, 'seo');
  },

  updatePage: (route, updates) => {
    const data = { ...get().data, pages: get().data.pages.map(p => p.route === route ? { ...p, ...updates } : p) };
    save(data); set({ data });
    useAuditStore.getState().log('update', `SEO page updated: ${route}`, 'seo');
  },

  updateAnalytics: (updates) => {
    const data = { ...get().data, analytics: { ...get().data.analytics, ...updates } };
    save(data); set({ data });
  },

  resetSeo: () => { save(DEFAULT); set({ data: DEFAULT }); useAuditStore.getState().log('delete', 'SEO data reset to defaults', 'seo'); },
}));

export default useSeoStore;