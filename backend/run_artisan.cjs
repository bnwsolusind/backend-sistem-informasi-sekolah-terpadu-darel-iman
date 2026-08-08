const { execSync } = require('child_process');
const path = require('path');

const libsDir = path.resolve(__dirname, 'libs');
const args = process.argv.slice(2).join(' ');
const cmd = `DYLD_FALLBACK_LIBRARY_PATH="${libsDir}" php artisan ${args}`;

try {
  const output = execSync(cmd, {
    cwd: path.resolve(__dirname),
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 15000
  });
  console.log(output);
} catch (err) {
  console.error('Command failed or timed out:');
  if (err.stdout) console.log(err.stdout);
  if (err.stderr) console.error(err.stderr);
  process.exit(1);
}
