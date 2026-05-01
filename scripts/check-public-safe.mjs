import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

const root = process.cwd();
const forbidden = [
  'sk-ant-',
  'sk-or-',
  'ntn_',
  'xoxb-',
  'AAH9g',
  'AAHGG',
];

function* files(dir) {
  for (const name of readdirSync(dir)) {
    if (['.git', 'node_modules', '.private'].includes(name)) continue;
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) yield* files(path);
    else yield path;
  }
}

let failed = false;
for (const file of files(root)) {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('scripts/check-public-safe.mjs')) continue;
  for (const needle of forbidden) {
    if (text.includes(needle)) {
      console.error(`Forbidden public content ${JSON.stringify(needle)} in ${file}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('public-safe check passed');
