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
  // Already have rows — resolve immediately
  if (cached.tests && cached.tests.length > 0) return cached.tests;
  if (loading) return new Promise((resolve) => waiters.push(() => resolve(cached.tests || [])));
  loading = true;
  try {
    const testsRes = await api.get('/diagnostics/tests/search', { params: { limit: 2000, page: 1 } });
    const rawTests = testsRes.data?.tests || testsRes.data || [];
    const tests = (Array.isArray(rawTests) ? rawTests : []).map((t) => ({
      ...t,
      price: Number(t.price) || 0,
      mrp: Number(t.mrp) || Math.round((Number(t.price) || 0) * 1.8) || 0,
      offerPrice: Number(t.offerPrice) || Number(t.price) || 0,
    }));
    cached.tests = tests;
    seedTests.splice(0, seedTests.length, ...tests);

    // Build categories from actual test rows (covers every Neon category, not only /categories API)
    const catNames = [...new Set(tests.map((t) => t.category).filter(Boolean))];
    const cats = catNames
      .map((n) => {
        const style = CATEGORY_STYLES[n] || { icon: '🔬', color: '#64748b', bg: '#f1f5f9' };
        const id = makeSlug(n);
        const catTests = tests.filter((t) => t.category === n);
        return {
          name: n,
          id,
          slug: id,
          tests: catTests,
          count: catTests.length,
          description: `${catTests.length} tests available`,
          ...style,
        };
      })
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    cached.categories = cats;
    _catItems.splice(0, _catItems.length, ...cats);
  } catch {
    // Leave cached.tests null on hard failure so a later call can retry
    if (!cached.tests) {
      cached.tests = [];
      cached.categories = [];
      _catItems.splice(0, _catItems.length);
      seedTests.splice(0, seedTests.length);
    }
  } finally {
    loading = false;
    notifyAll();
  }
  return cached.tests || [];
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
  'Infections': { icon: '🦠', color: '#b45309', bg: '#fef3c7' },
  'Infection': { icon: '🦠', color: '#b45309', bg: '#fef3c7' },
  'Radiology': { icon: '📷', color: '#0369a1', bg: '#e0f2fe' },
  'Immunology': { icon: '🛡️', color: '#6d28d9', bg: '#ede9fe' },
  'Gastroenterology': { icon: '🫀', color: '#c2410c', bg: '#ffedd5' },
  'Pregnancy': { icon: '🤰', color: '#db2777', bg: '#fce7f3' },
  'STD': { icon: '🔬', color: '#9f1239', bg: '#ffe4e6' },
  'Bone': { icon: '🦴', color: '#57534e', bg: '#f5f5f4' },
  'Urine': { icon: '💧', color: '#0e7490', bg: '#cffafe' },
};

/** Well-known popular tests — fuzzy match against Neon names */
const POPULAR_TEST_QUERIES = [
  'Complete Blood Count',
  'CBC',
  'HbA1c',
  'Thyroid Profile',
  'Lipid Profile',
  'Vitamin D',
  'Vitamin B12',
  'Liver Function',
  'Kidney Function',
  'Fasting Blood',
  'Iron Studies',
  'Urine Routine',
];

/** Find popular tests from loaded catalog (name-based, resilient to Neon naming). */
export function getPopularTests(limit = 8) {
  const all = cached.tests || seedTests || [];
  if (!all.length) return [];
  const picked = [];
  const seen = new Set();
  for (const q of POPULAR_TEST_QUERIES) {
    if (picked.length >= limit) break;
    const ql = q.toLowerCase();
    const hit = all.find(t => {
      if (seen.has(t.id)) return false;
      const n = (t.name || '').toLowerCase();
      return n === ql || n.includes(ql) || ql.includes(n);
    });
    if (hit) {
      seen.add(hit.id);
      picked.push(hit);
    }
  }
  // Fill remaining with other tests if catalog short on matches
  if (picked.length < limit) {
    for (const t of all) {
      if (picked.length >= limit) break;
      if (!seen.has(t.id)) {
        seen.add(t.id);
        picked.push(t);
      }
    }
  }
  return picked;
}

/** Categories sorted by test count (largest first). */
export function getCategoriesSorted(limit) {
  const list = [...(cached.categories || _catItems)];
  list.sort((a, b) => (b.count || b.tests?.length || 0) - (a.count || a.tests?.length || 0));
  return limit ? list.slice(0, limit) : list;
}

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

/** Canonical URL slug — used by TestCard links and getTestBySlug. Collapse doubles so "A & B" → "a-b". */
export function makeSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[\s/&+,]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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
