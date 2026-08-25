/**
 * Restore a plain SQL backup (from `npm run db:backup`) into PostgreSQL.
 *
 * Use your **Railway** Postgres URL only here — do not put it in backend/.env if that file is shared.
 *
 * PowerShell (one line):
 *   $env:RESTORE_DATABASE_URL = "postgresql://postgres:PASSWORD@HOST:PORT/railway?sslmode=require"
 *   cd backend
 *   npm run db:restore -- backups/nita_clinics_backup_2026-04-05T10-07-35.sql
 *
 * Or without npm:
 *   psql "$RESTORE_DATABASE_URL" -v ON_ERROR_STOP=1 -f backups/your_backup.sql
 *
 * Railway: Project → Postgres service → Variables → copy DATABASE_URL (or connect tab).
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function normalizeUrl(raw) {
  let s = raw.trim();
  if (s.startsWith('postgres://')) {
    s = 'postgresql://' + s.slice('postgres://'.length);
  }
  if (!s.includes('sslmode=') && !process.env.PGSSLMODE) {
    try {
      const u = new URL(s);
      if (u.hostname && u.hostname !== 'localhost' && u.hostname !== '127.0.0.1') {
        u.searchParams.set('sslmode', 'require');
        s = u.toString();
      }
    } catch {
      /* use as-is */
    }
  }
  return s;
}

function main() {
  const dbUrl = process.env.RESTORE_DATABASE_URL || process.env.RAILWAY_DATABASE_URL;
  if (!dbUrl) {
    console.error(
      'Set RESTORE_DATABASE_URL to your Railway Postgres connection string, then run:\n' +
        '  npm run db:restore -- backups/your_backup.sql\n',
    );
    process.exit(1);
  }

  const sqlArg = process.argv[2];
  const sqlPath = sqlArg
    ? path.resolve(process.cwd(), sqlArg)
    : null;

  if (!sqlPath || !fs.existsSync(sqlPath)) {
    console.error('Usage: RESTORE_DATABASE_URL="postgresql://..." npm run db:restore -- backups/file.sql');
    process.exit(1);
  }

  const url = normalizeUrl(dbUrl);
  const env = { ...process.env };
  if (!env.PGSSLMODE && url.includes('sslmode=require')) {
    env.PGSSLMODE = 'require';
  }

  console.log('Restoring into:', url.replace(/:[^:@/]+@/, ':****@'));
  console.log('From file:', sqlPath);

  const r = spawnSync(
    'psql',
    [url, '-v', 'ON_ERROR_STOP=1', '-f', sqlPath],
    { env, stdio: 'inherit', shell: false },
  );

  if (r.error) {
    console.error(r.error.message);
    console.error('\nInstall PostgreSQL client tools and ensure `psql` is on your PATH.');
    process.exit(1);
  }
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
  console.log('\nRestore finished.');
}

main();
