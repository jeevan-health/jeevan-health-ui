/**
 * Health packages catalog — API-backed cache (Neon via /wellness/packages).
 * Keeps packageList-compatible shape for existing pages.
 */
import * as packagesService from '../services/packagesService';

let packageList = [];
let ready = false;
let loading = false;
const waiters = [];
const subscribers = new Set();

function notify() {
  ready = true;
  waiters.splice(0).forEach((fn) => fn());
  subscribers.forEach((fn) => fn());
  subscribers.clear();
}

export function subscribe(fn) {
  if (ready) {
    fn();
    return () => {};
  }
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function isReady() {
  return ready;
}

export function getPackageList() {
  return packageList;
}

export function getPackageBySlug(slug) {
  if (!slug) return null;
  return packageList.find((p) => p.id === slug || p.slug === slug) || null;
}

export async function ensurePackagesLoaded() {
  if (ready && packageList.length > 0) return packageList;
  if (loading) {
    return new Promise((resolve) => waiters.push(() => resolve(packageList)));
  }
  loading = true;
  try {
    const { data } = await packagesService.listPackages({ limit: 500 });
    const raw = data.packages || data || [];
    packageList = (Array.isArray(raw) ? raw : []).map((p) => ({
      id: p.id || p.slug,
      slug: p.slug || p.id,
      name: p.name,
      priority: p.priority,
      target: p.target,
      testCount: p.testCount ?? p.test_count,
      mrp: Number(p.mrp) || 0,
      offerPrice: Number(p.offerPrice ?? p.offer_price) || 0,
      discount: p.discount || 0,
      rating: Number(p.rating) || 4.5,
      bookings: p.bookings || '',
      reportTime: p.reportTime || p.report_time || '24-48 hours',
      color: p.color || '#1866C9',
      icon: p.icon || '📦',
      description: p.description || '',
      benefits: p.benefits || [],
      whoShouldTake: p.whoShouldTake || p.who_should_take || [],
      preparation: p.preparation || '',
      conditions: p.conditions || [],
      testsIncluded: p.testsIncluded || p.tests_included || [],
      faqs: p.faqs || [],
    }));
  } catch (err) {
    console.warn('Failed to load packages from API:', err?.message || err);
    packageList = [];
  } finally {
    loading = false;
    notify();
  }
  return packageList;
}

// Export mutable array reference for legacy `import { packageList }`
export { packageList };

// Kick off load
ensurePackagesLoaded();
