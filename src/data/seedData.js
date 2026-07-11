import api from '../services/api';

const cached = { tests: null, categories: null };
let loading = false;
let waiters = [];
let subscribers = new Set();
let ready = false;

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
    cached.tests = (Array.isArray(rawTests) ? rawTests : []).map(t => ({
      ...t,
      price: Number(t.price) || 0,
      mrp: Number(t.mrp) || Number(t.price) * 2 || 0,
      offerPrice: Number(t.offerPrice) || Number(t.price) || 0,
    }));
    const rawCats = catsRes.data.categories || catsRes.data || [];
    cached.categories = Array.isArray(rawCats) ? rawCats.map(c => typeof c === 'string' ? { name: c, category: c, id: makeSlug(c), slug: makeSlug(c) } : c) : [];
  } catch {
    cached.tests = [];
    cached.categories = [];
  } finally {
    loading = false;
    notifyAll();
  }
}



export function categoryMeta(slug) {
  if (!slug) return null;
  const list = getCategories();
  return list.find(c => c.id === slug || c.name === slug || c.slug === slug) || null;
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

export function getCategories() {
  if (!cached.categories || cached.categories.length === 0) {
    const cats = cached.tests ? [...new Set(cached.tests.map(t => t.category).filter(Boolean))] : [];
    return cats.map(name => {
      const style = CATEGORY_STYLES[name] || { icon: '🔬', color: '#64748b', bg: '#f1f5f9' };
      return { name, id: makeSlug(name), slug: makeSlug(name), tests: cached.tests?.filter(t => t.category === name) || [], description: '', ...style };
    });
  }
  return cached.categories.map(c => {
    const n = c.name || c.category || '';
    const style = CATEGORY_STYLES[n] || CATEGORY_STYLES[c.id] || { icon: '🔬', color: '#64748b', bg: '#f1f5f9' };
    return {
      ...c, ...style,
      name: n,
      id: c.id || c.slug || makeSlug(n),
      slug: c.slug || c.id || makeSlug(n),
      tests: cached.tests?.filter(t => (t.category === n)) || [],
      description: c.description || '',
    };
  });
}

export const categoryList = new Proxy([], {
  get(_, prop) {
    if (prop === 'length') return getCategories().length;
    if (prop === 'slice') return (...args) => getCategories().slice(...args);
    if (prop === 'map') return (...args) => getCategories().map(...args);
    if (prop === 'filter') return (...args) => getCategories().filter(...args);
    if (prop === 'find') return (...args) => getCategories().find(...args);
    if (prop === 'forEach') return (...args) => getCategories().forEach(...args);
    if (prop === Symbol.iterator) return getCategories()[Symbol.iterator];
    if (typeof prop === 'number') return getCategories()[prop];
    return undefined;
  }
});

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

// Get all tests
export function getTests() {
  return cached.tests || [];
}

// Backward-compatible dynamic seedTests proxy
export const seedTests = new Proxy([], {
  get(_, prop) {
    if (prop === 'then') return undefined; // not a promise
    if (prop === 'length') return (cached.tests || []).length;
    if (prop === 'slice') return (...args) => (cached.tests || []).slice(...args);
    if (prop === 'filter') return (...args) => (cached.tests || []).filter(...args);
    if (prop === 'map') return (...args) => (cached.tests || []).map(...args);
    if (prop === 'find') return (...args) => (cached.tests || []).find(...args);
    if (prop === 'forEach') return (...args) => (cached.tests || []).forEach(...args);
    if (prop === 'includes') return (...args) => (cached.tests || []).includes(...args);
    if (prop === 'indexOf') return (...args) => (cached.tests || []).indexOf(...args);
    if (prop === Symbol.iterator) return (cached.tests || [])[Symbol.iterator];
    if (typeof prop === 'number') return (cached.tests || [])[prop];
    return undefined;
  },
  set(_, prop, value) {
    if (!cached.tests) cached.tests = [];
    cached.tests[prop] = value;
    return true;
  }
});

// Auto-load tests on first import
ensureLoaded();
