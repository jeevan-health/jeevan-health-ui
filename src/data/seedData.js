import api from '../services/api';

const cached = { tests: null, categories: null };
let loading = false;
let waiters = [];
let subscribers = new Set();
let ready = false;
const _catItems = [];

function notifyAll() {
  ready = true;
  waiters.forEach(fn => fn());
  waiters = [];
  subscribers.forEach(fn => fn());
  subscribers = new Set();
}

export function subscribe(fn) {
  if (ready) { fn(); return () => {}; }
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function isReady() { return ready; }

export async function ensureLoaded() {
  if (cached.tests) return;
  if (loading) return new Promise(resolve => waiters.push(resolve));
  loading = true;
  try {
    const [testsRes, catsRes] = await Promise.all([
      api.get('/diagnostics/tests/search'),
      api.get('/diagnostics/tests/categories'),
    ]);
    const rawTests = testsRes.data.tests || testsRes.data || [];
    const tests = (Array.isArray(rawTests) ? rawTests : []).map(t => ({
      ...t,
      price: Number(t.price) || 0,
      mrp: Number(t.mrp) || Number(t.price) * 2 || 0,
      offerPrice: Number(t.offerPrice) || Number(t.price) || 0,
    }));
    cached.tests = tests;
    seedTests.splice(0, seedTests.length, ...tests);

    const rawCats = catsRes.data.categories || catsRes.data || [];
    const cats = Array.isArray(rawCats) ? rawCats.map(c => {
      const n = typeof c === 'string' ? c : (c.name || c.category || '');
      const style = CATEGORY_STYLES[n] || CATEGORY_STYLES[c?.id] || { icon: '🔬', color: '#64748b', bg: '#f1f5f9' };
      const id = typeof c === 'string' ? makeSlug(c) : (c.id || c.slug || makeSlug(n));
      return { name: n, id, slug: id, tests: tests.filter(t => t.category === n), description: (typeof c === 'string' ? '' : (c.description || '')), ...style };
    }) : [];
    cached.categories = cats;
    _catItems.splice(0, _catItems.length, ...cats);
  } catch {
    cached.tests = [];
    cached.categories = [];
  } finally {
    loading = false;
    notifyAll();
  }
}

const CATEGORY_STYLES = {
  'Diabetes': { icon: '🩸', color: '#dc2626', bg: '#fee2e2' },
  'Thyroid': { icon: '🦋', color: '#7c3aed', bg: '#ede9fe' },
  'Cardiac': { icon: '❤️', color: '#e11d48', bg: '#ffe4e6' },
  'Hematology': { icon: '🩸', color: '#2563eb', bg: '#dbeafe' },
  'Vitamins': { icon: '💊', color: '#059669', bg: '#d1fae5' },
  'Anemia': { icon: '🩸', color: '#b91c1c', bg: '#fecaca' },
  'Full Body': { icon: '🧬', color: '#0d9488', bg: '#ccfbf1' },
  'Fever': { icon: '🌡️', color: '#ea580c', bg: '#fed7aa' },
  'Arthritis': { icon: '🦴', color: '#4f46e5', bg: '#e0e7ff' },
  'Hormones': { icon: '⚗️', color: '#0891b2', bg: '#cffafe' },
  'Allergy': { icon: '🤧', color: '#d946ef', bg: '#fae8ff' },
  'Cancer': { icon: '🎗️', color: '#be185d', bg: '#fce7f3' },
  'Kidney': { icon: '🫘', color: '#ca8a04', bg: '#fef9c3' },
  'Liver': { icon: '🫁', color: '#16a34a', bg: '#bbf7d0' },
};

export function categoryMeta(slug) {
  if (!slug) return null;
  return categoryList.find(c => c.id === slug || c.name === slug || c.slug === slug) || null;
}

export function getCategories() {
  return cached.categories || [];
}

export const categoryList = _catItems;

export function getCategoryBySlug(slug) {
  return categoryMeta(slug);
}

export function makeSlug(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/[\s/]+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function applyPricing(test) {
  if (!test) return null;
  return {
    ...test,
    price: test.price || test.offerPrice || test.mrp || 0,
    mrp: test.mrp || test.price || 0,
    offerPrice: test.offerPrice || test.price || 0,
  };
}

export function getTests() {
  return cached.tests || [];
}

export const seedTests = [];

ensureLoaded();
