import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src');
const files = [];
function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(e.name)) files.push(p);
  }
}
walk(ROOT);

let n = 0;
for (const f of files) {
  let lines = fs.readFileSync(f, 'utf8').split('\n');
  let ch = false;
  lines = lines.map((line) => {
    if (!line.includes('confirmDialog') || !line.includes('if') || !line.includes('return')) return line;
    const open = (line.match(/\(/g) || []).length;
    const close = (line.match(/\)/g) || []).length;
    if (open <= close) return line;
    // Insert missing closing parens before return
    const missing = open - close;
    const fixed = line.replace(/\s*return/, `${')'.repeat(missing)} return`);
    console.log(path.relative(process.cwd(), f));
    console.log(' ', line.trim());
    console.log('→', fixed.trim());
    ch = true;
    return fixed;
  });
  // Make non-async handlers that await confirmDialog async
  let text = lines.join('\n');
  const o = text;
  text = text.replace(
    /(const\s+\w+\s*=\s*)\(([^)]*)\)\s*=>\s*\{(\s*if\s*\(!?\(?await confirmDialog)/g,
    (m, a, args, rest) => (m.includes('async') ? m : `${a}async (${args}) => {${rest}`)
  );
  text = text.replace(
    /(const\s+\w+\s*=\s*)\(\)\s*=>\s*\{(\s*if\s*\(!?\(?await confirmDialog)/g,
    (m, a, rest) => (m.includes('async') ? m : `${a}async () => {${rest}`)
  );
  if (text !== o || ch) {
    fs.writeFileSync(f, text);
    n++;
  }
}
console.log('files', n);
