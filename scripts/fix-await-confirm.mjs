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
  if (f.includes('dialogStore')) continue;
  let s = fs.readFileSync(f, 'utf8');
  const o = s;

  // if (!confirmDialog(...)) → if (!(await confirmDialog(...)))
  s = s.replace(/if\s*\(\s*!\s*confirmDialog\s*\(/g, 'if (!(await confirmDialog(');
  // if (confirmDialog(...)) → if (await confirmDialog(...))
  s = s.replace(/if\s*\(\s*confirmDialog\s*\(/g, 'if (await confirmDialog(');
  // already has !(await — leave alone (double-fix guard)
  s = s.replace(/if\s*\(\s*!\s*\(\s*await confirmDialog/g, 'if (!(await confirmDialog');

  // onClick={() => { if (await → async
  s = s.replace(/onClick=\{\(\)\s*=>\s*\{\s*if\s*\(await confirmDialog/g, 'onClick={async () => { if (await confirmDialog');
  s = s.replace(/onClick=\{\(\)\s*=>\s*\{\s*if\s*\(!\(await confirmDialog/g, 'onClick={async () => { if (!(await confirmDialog');

  // const x = () => { if (!(await
  s = s.replace(/(const\s+\w+\s*=\s*)\(\)\s*=>\s*\{\s*if\s*\(!\(await confirmDialog/g, '$1async () => { if (!(await confirmDialog');
  s = s.replace(/(const\s+\w+\s*=\s*)\(\)\s*=>\s*\{\s*if\s*\(await confirmDialog/g, '$1async () => { if (await confirmDialog');
  s = s.replace(/(const\s+\w+\s*=\s*)\(([^)]*)\)\s*=>\s*\{\s*if\s*\(!\(await confirmDialog/g, '$1async ($2) => { if (!(await confirmDialog');
  s = s.replace(/(const\s+\w+\s*=\s*)\(([^)]*)\)\s*=>\s*\{\s*if\s*\(await confirmDialog/g, '$1async ($2) => { if (await confirmDialog');

  // function foo() { if await
  s = s.replace(/(?<!async\s)function\s+(\w+)\s*\(([^)]*)\)\s*\{\s*if\s*\(!\(await confirmDialog/g, 'async function $1($2) { if (!(await confirmDialog');
  s = s.replace(/(?<!async\s)function\s+(\w+)\s*\(([^)]*)\)\s*\{\s*if\s*\(await confirmDialog/g, 'async function $1($2) { if (await confirmDialog');

  // notify.info for failures → error when message looks like fail
  s = s.replace(/notify\.info\(([^)]*(?:[Ff]ail|[Ee]rror|Could not|Failed)[^)]*)\)/g, 'notify.error($1)');

  // danger defaults for delete confirms - string form is ok

  if (s !== o) {
    fs.writeFileSync(f, s);
    n++;
    console.log('fixed', path.relative(process.cwd(), f));
  }
}
console.log('count', n);
