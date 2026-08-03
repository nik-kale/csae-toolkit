// Zips the built dist/ into a versioned, load-unpacked / Web-Store-ready archive.
// Run via `npm run package`, which builds first.
import { execSync } from 'node:child_process';
import { existsSync, rmSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

if (!existsSync(distDir)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const out = path.join(root, `csae-toolkit-v${pkg.version}.zip`);
if (existsSync(out)) rmSync(out);

// -r recurse, -X strip extra macOS attributes for a clean archive.
execSync(`zip -r -X "${out}" .`, { cwd: distDir, stdio: 'inherit' });
console.log(`\nPackaged extension -> ${path.relative(root, out)}`);
