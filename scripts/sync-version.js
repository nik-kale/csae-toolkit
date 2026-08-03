// Keeps the version consistent across package.json, public/manifest.json, and
// the README badge. Run with `--write` to fix drift, or without to verify (CI).
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const write = process.argv.includes('--write');

const pkgPath = path.join(root, 'package.json');
const manifestPath = path.join(root, 'public', 'manifest.json');
const readmePath = path.join(root, 'README.md');

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const readme = readFileSync(readmePath, 'utf8');
const badgeRe = /(version-)(\d+\.\d+\.\d+)(-blue)/;
const badgeMatch = readme.match(badgeRe);
const readmeVersion = badgeMatch ? badgeMatch[2] : null;

if (write) {
  if (manifest.version !== version) {
    manifest.version = version;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  }
  if (badgeMatch && readmeVersion !== version) {
    writeFileSync(readmePath, readme.replace(badgeRe, `$1${version}$3`));
  }
  console.log(`Synced version references to ${version}`);
  process.exit(0);
}

const mismatches = [];
if (manifest.version !== version) mismatches.push(`public/manifest.json is ${manifest.version}`);
if (readmeVersion !== version) mismatches.push(`README badge is ${readmeVersion}`);

if (mismatches.length) {
  console.error(`Version mismatch. package.json is ${version} but:`);
  for (const m of mismatches) console.error(`  - ${m}`);
  console.error('Run `npm run sync-version` to fix.');
  process.exit(1);
}

console.log(`Version ${version} is consistent across package.json, manifest.json, and README.`);
