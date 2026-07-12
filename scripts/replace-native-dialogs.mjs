/**
 * Replace native alert/confirm with notify + confirmDialog.
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src');
const files = [];

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (/\.(jsx?)$/.test(ent.name)) files.push(p);
  }
}
walk(ROOT);

function relImport(fromFile, absTarget) {
  let rel = path.relative(path.dirname(fromFile), absTarget).replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return rel.replace(/\.js$/, '');
}

function injectImport(src, impLine) {
  if (src.includes(impLine.replace(/;$/, ''))) return src;
  const lines = src.split('\n');
  let lastImport = -1;
  for (let i = 0; i < Math.min(lines.length, 100); i++) {
    if (/^import\s/.test(lines[i])) lastImport = i;
  }
  if (lastImport >= 0) {
    lines.splice(lastImport + 1, 0, impLine);
    return lines.join('\n');
  }
  return `${impLine}\n${src}`;
}

let changed = 0;

for (const file of files) {
  // Skip infrastructure
  if (/dialogStore|ConfirmDialogHost|toastBus|Toast\.jsx|replace-native/.test(file)) continue;

  let src = fs.readFileSync(file, 'utf8');
  if (!/\balert\s*\(|\bconfirm\s*\(|window\.alert|window\.confirm/.test(src)) continue;

  const original = src;

  src = src.replace(/\bwindow\.alert\s*\(/g, 'notify.info(');
  src = src.replace(/(?<![\w.])alert\s*\(/g, 'notify.info(');

  src = src.replace(
    /if\s*\(\s*!\s*(?:window\.)?confirm\s*\(([^)]*)\)\s*\)\s*return/g,
    'if (!(await confirmDialog($1))) return'
  );
  src = src.replace(
    /if\s*\(\s*(?:window\.)?confirm\s*\(([^)]*)\)\s*\)\s*\{/g,
    'if (await confirmDialog($1)) {'
  );
  src = src.replace(/\bwindow\.confirm\s*\(/g, 'confirmDialog(');
  src = src.replace(/(?<![\w.])confirm\s*\(/g, 'confirmDialog(');

  // async onClick arrow when it now awaits confirmDialog
  src = src.replace(
    /onClick=\{\(\)\s*=>\s*\{(\s*if\s*\(await confirmDialog)/g,
    'onClick={async () => {$1'
  );
  src = src.replace(
    /onClick=\{\(\)\s*=>\s*\{([\s\S]{0,200}?await confirmDialog)/g,
    (m, body) => (m.includes('async') ? m : `onClick={async () => {${body}`)
  );

  // const handleX = () => { ... await confirmDialog
  src = src.replace(
    /(const\s+\w+\s*=\s*)\(\)\s*=>\s*\{(\s*if\s*\(!\(await confirmDialog)/g,
    '$1async () => {$2'
  );
  src = src.replace(
    /(const\s+\w+\s*=\s*)\(\s*([^)]*)\s*\)\s*=>\s*\{(\s*if\s*\(!\(await confirmDialog)/g,
    '$1async ($2) => {$3'
  );
  src = src.replace(
    /(const\s+\w+\s*=\s*)\(\s*([^)]*)\s*\)\s*=>\s*\{(\s*if\s*\(await confirmDialog)/g,
    '$1async ($2) => {$3'
  );

  // function handleX() {
  src = src.replace(
    /(?<!async\s)function\s+(\w+)\s*\(([^)]*)\)\s*\{(\s*if\s*\(!\(await confirmDialog)/g,
    'async function $1($2) {$3'
  );
  src = src.replace(
    /(?<!async\s)function\s+(\w+)\s*\(([^)]*)\)\s*\{(\s*if\s*\(await confirmDialog)/g,
    'async function $1($2) {$3'
  );

  const confPath = relImport(file, path.join(ROOT, 'stores/dialogStore.js'));
  const toastPath = relImport(file, path.join(ROOT, 'lib/toastBus.js'));

  if (/\bconfirmDialog\s*\(/.test(src) && !/from ['"].*dialogStore['"]/.test(src)) {
    src = injectImport(src, `import { confirmDialog } from '${confPath}';`);
  }
  if (/\bnotify\./.test(src) && !/from ['"].*toastBus['"]/.test(src)) {
    src = injectImport(src, `import { notify } from '${toastPath}';`);
  }

  if (src !== original) {
    fs.writeFileSync(file, src);
    changed += 1;
    console.log('updated', path.relative(process.cwd(), file));
  }
}

console.log('files changed:', changed);
