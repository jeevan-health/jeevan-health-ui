import { getPackagesByAxis } from '../utils/packageGenerator';
import { seedTests } from './seedData';

export function ensureGlobals() {
  if (window.__packagesByAxis) return;
  window.__allTests = seedTests;
  window.__packagesByAxis = getPackagesByAxis(seedTests);
}

ensureGlobals();
