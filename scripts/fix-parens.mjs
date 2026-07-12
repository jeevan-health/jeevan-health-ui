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
  let s = fs.readFileSync(f, 'utf8');
  const o = s;
  // Missing closing paren for if: if (!(await confirmDialog(...))) return
  // Broken form has only )) before return
  s = s.replace(
    /if\s*\(\s*!\s*\(\s*await confirmDialog\(([^;]*?)\)\)\s*return/g,
    (match, inner) => {
      // if already has ))) return, skip
      if (/\)\)\)\s*return/.test(match)) return match;
      return `if (!(await confirmDialog(${inner}))) return`;
    }
  );

  // const handleX = (args) => { if (await  without async
  s = s.replace(
    /(const\s+\w+\s*=\s*)\(([^)]*)\)\s*=>\s*\{\s*\n?\s*if\s*\(await confirmDialog/g,
    '$1async ($2) => {\n    if (await confirmDialog'
  );
  s = s.replace(
    /(const\s+\w+\s*=\s*)\(([^)]*)\)\s*=>\s*\{\s*\n?\s*if\s*\(!\(await confirmDialog/g,
    '$1async ($2) => {\n    if (!(await confirmDialog'
  );

  if (s !== o) {
    fs.writeFileSync(f, s);
    n++;
    console.log(path.relative(process.cwd(), f));
  }
}
console.log('fixed', n);
