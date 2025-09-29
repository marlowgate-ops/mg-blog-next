import { createHash } from 'crypto';
import { statSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

try {
  const list = execSync('git diff --name-only origin/main...HEAD')
    .toString()
    .trim()
    .split('\n')
    .filter(Boolean);

  console.log('# Modified Files Metrics\n');
  console.log('| File | Bytes | SHA256 |');
  console.log('|------|-------|--------|');

  for (const f of list) {
    try {
      const b = statSync(f).size;
      const sha = createHash('sha256').update(readFileSync(f)).digest('hex');
      console.log(`| ${f} | ${b} | ${sha.substring(0, 16)}... |`);
    } catch (error) {
      console.log(`| ${f} | - | (file removed or moved) |`);
    }
  }
} catch (error) {
  console.error('Error generating file metrics:', error);
}