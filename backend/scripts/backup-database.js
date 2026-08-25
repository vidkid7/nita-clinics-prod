/**
 * PostgreSQL backup for local → Railway (or any Postgres) restore.
 *
 * Prerequisites: PostgreSQL client tools installed (`pg_dump` on PATH).
 *   Windows: install PostgreSQL or "Command Line Tools" and add bin to PATH.
 *
 * Usage (from backend folder):
 *   npm run db:backup
 *
 * Output: backend/backups/nita_clinics_backup_<timestamp>.sql
 * (SQL files are gitignored.)
 *
 * Restore on Railway (from your machine, with Railway DATABASE_URL):
 *   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f backend/backups/nita_clinics_backup_....sql
 *
 * Or: Railway dashboard → Postgres → Query / connect with psql using the public URL.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

function normalizeDatabaseUrl(raw) {
  let s = raw.trim();
  if (s.startsWith('postgres://')) {
    s = 'postgresql://' + s.slice('postgres://'.length);
  }
  return s;
}

function configFromEnv() {
  const rawUrl = process.env.DATABASE_URL?.trim();
  if (rawUrl) {
    try {
      const s = normalizeDatabaseUrl(rawUrl);
      const u = new URL(s);
      const dbName = u.pathname.replace(/^\//, '').split('?')[0];
      if (!dbName) {
        throw new Error('DATABASE_URL has no database name in path');
      }
      return {
        host: u.hostname,
        port: u.port || '5432',
        user: decodeURIComponent(u.username || ''),
        password: decodeURIComponent(u.password || ''),
        database: dbName,
        sslmode: u.searchParams.get('sslmode') || undefined,
      };
    } catch (e) {
      console.error('Invalid DATABASE_URL:', e.message);
      process.exit(1);
    }
  }

  const user = process.env.DATABASE_USER;
  const database = process.env.DATABASE_NAME;
  if (!user || !database) {
    console.error(
      'Missing database config. Set DATABASE_URL or DATABASE_USER + DATABASE_NAME (+ host/port/password) in backend/.env',
    );
    process.exit(1);
  }
  return {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT || '5432',
    user,
    password: process.env.DATABASE_PASSWORD || '',
    database,
    sslmode: undefined,
  };
}

function main() {
  const c = configFromEnv();
  const outDir = path.join(__dirname, '..', 'backups');
  fs.mkdirSync(outDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const outfile = path.join(outDir, `nita_clinics_backup_${stamp}.sql`);

  const env = { ...process.env, PGPASSWORD: c.password };
  if (c.sslmode) {
    env.PGSSLMODE = c.sslmode;
  } else if (process.env.PGSSLMODE) {
    env.PGSSLMODE = process.env.PGSSLMODE;
  }

  const args = [
    '-h',
    c.host,
    '-p',
    String(c.port),
    '-U',
    c.user,
    '-d',
    c.database,
    '--format=plain',
    '--no-owner',
    '--no-acl',
    '--if-exists',
    '--clean',
    '-f',
    outfile,
  ];

  const r = spawnSync('pg_dump', args, {
    env,
    stdio: 'inherit',
    shell: false,
  });

  if (r.error) {
    console.error(r.error.message);
    console.error('\nInstall PostgreSQL client tools and ensure `pg_dump` is on your PATH.');
    process.exit(1);
  }
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }

  const stat = fs.statSync(outfile);
  console.log(`\nBackup written: ${outfile} (${(stat.size / 1024).toFixed(1)} KB)`);
}

main();
