const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Get list of changed files compared to origin/main
const changedFiles = execSync('git diff --name-only --diff-filter=AM --relative origin/main...HEAD', {stdio: 'pipe'})
  .toString()
  .trim()
  .split('\n')
  .filter(Boolean);

console.log('Changed files:');
changedFiles.forEach(f => {
  const stats = fs.statSync(f);
  const content = fs.readFileSync(f);
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  console.log(`${f} | ${stats.size} bytes | sha256:${hash.substr(0, 16)}...`);
});