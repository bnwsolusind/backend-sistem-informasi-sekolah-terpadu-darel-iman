const { spawn } = require('child_process');
const path = require('path');

const libsDir = path.resolve(__dirname, 'libs');
const rawCmd = process.argv.slice(2).join(' ');

const fallbackPath = `${libsDir}:/usr/local/opt/libpq/lib:/usr/local/lib:/usr/lib`;
const fullCmd = `DYLD_FALLBACK_LIBRARY_PATH="${fallbackPath}" DYLD_LIBRARY_PATH="${fallbackPath}" ${rawCmd}`;

console.log('Executing:', fullCmd);

const child = spawn('/bin/sh', ['-c', fullCmd], {
  cwd: path.resolve(__dirname)
});

child.stdout.on('data', (data) => {
  process.stdout.write('[STDOUT] ' + data.toString());
});

child.stderr.on('data', (data) => {
  process.stderr.write('[STDERR] ' + data.toString());
});

child.on('close', (code) => {
  console.log('[PROCESS EXIT CODE]', code);
  process.exit(code || 0);
});
