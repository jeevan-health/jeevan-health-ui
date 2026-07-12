const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '../src/data/healthPackages.js'), 'utf8');
const start = code.indexOf('const packages = [');
if (start < 0) throw new Error('packages array not found');

let i = start + 'const packages = '.length;
let depth = 0;
let end = -1;
for (; i < code.length; i++) {
  if (code[i] === '[') depth++;
  else if (code[i] === ']') {
    depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
}
if (end < 0) throw new Error('packages array end not found');

function grab(name) {
  const re = new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]);\\r?\\n`);
  const m = code.match(re);
  return m ? m[1] : '[]';
}

const arr = code.slice(start + 'const packages = '.length, end + 1);
const full = [
  `const ESSENTIAL_TESTS = ${grab('ESSENTIAL_TESTS')};`,
  `const ADVANCED_TESTS = ${grab('ADVANCED_TESTS')};`,
  `const EXECUTIVE_TESTS = ${grab('EXECUTIVE_TESTS')};`,
  `module.exports = ${arr};`,
  '',
].join('\n');

const tmp = path.join(__dirname, 'tmp-packages-extract.cjs');
fs.writeFileSync(tmp, full);
const pkgs = require(tmp);
fs.unlinkSync(tmp);

const slim = pkgs.map((p) => ({
  slug: p.id,
  name: p.name,
  priority: p.priority || 3,
  target: p.target || '',
  test_count: p.testCount || (p.testsIncluded || []).length,
  mrp: p.mrp,
  offer_price: p.offerPrice,
  discount: p.discount || 0,
  rating: p.rating || 4.5,
  bookings: p.bookings || '',
  report_time: p.reportTime || '24-48 hours',
  color: p.color || '#1866C9',
  icon: p.icon || '📦',
  description: p.description || '',
  benefits: p.benefits || [],
  who_should_take: p.whoShouldTake || [],
  preparation: p.preparation || '',
  conditions: p.conditions || [],
  tests_included: p.testsIncluded || [],
  faqs: p.faqs || [],
}));

const out = path.join(__dirname, '../../jeevan-health-api/src/config/packages-seed.json');
fs.writeFileSync(out, JSON.stringify(slim));
console.log(`Wrote ${slim.length} packages to ${out} (${fs.statSync(out).size} bytes)`);
