// Self-healing launcher: installs/builds only when needed, then serves on 0.0.0.0:3000.
// Usage: npm run resume
import { existsSync } from 'node:fs';
import { spawnSync, spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(args) {
  const result = spawnSync(npm, args, { stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`[resume] command failed: npm ${args.join(' ')}`);
    process.exit(result.status ?? 1);
  }
}

if (!existsSync('node_modules')) {
  console.log('[resume] node_modules missing -> installing dependencies');
  run(['ci', '--no-audit', '--no-fund']);
} else {
  console.log('[resume] dependencies present -> skipping install');
}

if (!existsSync('.next/BUILD_ID')) {
  console.log('[resume] production build missing -> building');
  run(['run', 'build']);
} else {
  console.log('[resume] production build present -> skipping build');
}

console.log('[resume] starting Next.js on 0.0.0.0:3000');
const child = spawn(npm, ['run', 'start'], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 0));
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => child.kill(signal));
}
