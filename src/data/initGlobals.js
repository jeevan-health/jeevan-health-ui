import { getPackagesByAxis } from '../utils/packageGenerator';

export function ensureGlobals() {
  if (window.__packagesByAxis) return;
  const tests = window.__allTests;
  if (tests && tests.length > 0) {
    window.__packagesByAxis = getPackagesByAxis(tests);
  }
}

// Poll until Diagnostics sets __allTests or max 5s
let attempts = 0;
const t = setInterval(() => {
  ensureGlobals();
  if (window.__packagesByAxis || ++attempts > 50) clearInterval(t);
}, 100);
