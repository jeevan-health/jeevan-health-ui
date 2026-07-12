/**
 * Health packages — re-exports Neon-backed catalog from packagesData.
 * Static package definitions now live in API seed (packages-seed.json) → health_packages table.
 */
import {
  packageList,
  getPackageBySlug,
  ensurePackagesLoaded,
  subscribe as subscribePackages,
  isReady as packagesReady,
} from './packagesData';
import { ensureLoaded as ensureTestsLoaded } from './seedData';

function makeSlug(name) {
  if (!name) return '';
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** Ensure packages (+ tests for inclusion matching) are loaded */
export async function ensurePackagesReady() {
  await Promise.all([ensurePackagesLoaded(), ensureTestsLoaded()]);
  return packageList;
}

export {
  packageList,
  getPackageBySlug,
  ensurePackagesLoaded,
  subscribePackages,
  packagesReady,
  makeSlug,
};

// Back-compat: some pages call ensureLoaded from seedData for tests only
export { ensurePackagesLoaded as ensureLoaded };
