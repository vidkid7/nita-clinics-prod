#!/usr/bin/env node
/**
 * One-off: dump the local `nita` schema (DDL + INSERTs) to a SQL file
 * suitable for pasting into Supabase SQL Editor.
 *
 * Output: D:\Nita_clinik\nita_remote_seed.sql
 */
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const SCHEMA = 'nita';
const OUT = path.join(__dirname, '..', '..', 'nita_remote_seed.sql');

const TABLES_SKIP = new Set([
  // typeorm internal — not data
  'typeorm_metadata',
  // We DO want these even if empty, so the schema matches locally
]);

function sqlEscape(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (v instanceof Date) return `'${v.toISOString()}'`;
  if (Buffer.isBuffer(v)) return `'\\\\x${v.toString('hex')}'`;
  if (typeof v === 'object') return `'${JSON.stringify(v).replace(/'/g, "''")}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
}

async function main() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    user: process.env.DATABASE_USERNAME || 'dental_user',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || 'dental_db',
  });
  await client.connect();
  console.log('✓ Connected to local DB');

  // 1. list user tables in nita schema (topologically ordered by FK)
  const { rows: tablesRaw } = await client.query(`
    SELECT
      c.relname AS table_name,
      obj_description(c.oid, 'pg_class') AS comment
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = $1
      AND c.relkind = 'r'
      AND c.relname <> 'typeorm_metadata'
    ORDER BY c.relname
  `, [SCHEMA]);
  const tableNames = tablesRaw.map((r) => r.table_name);
  console.log(`✓ Found ${tableNames.length} tables: ${tableNames.join(', ')}`);

  // Topo sort by FK dependency
  const { rows: fkRows } = await client.query(`
    SELECT
      tc.table_name AS src,
      ccu.table_name AS dst
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = $1
  `, [SCHEMA]);

  const deps = new Map(tableNames.map((t) => [t, new Set()]));
  for (const fk of fkRows) {
    if (deps.has(fk.src) && deps.has(fk.dst) && fk.src !== fk.dst) {
      deps.get(fk.src).add(fk.dst);
    }
  }
  // Kahn's algorithm
  const order = [];
  const visited = new Set();
  function visit(t) {
    if (visited.has(t)) return;
    visited.add(t);
    for (const d of deps.get(t) || []) visit(d);
    order.push(t);
  }
  tableNames.forEach(visit);

  // 2. For each table, build CREATE TABLE + INSERTs
  const out = [];
  out.push('-- ============================================================');
  out.push('-- Nita Clinics — nita schema seed for Supabase');
  out.push('-- Generated ' + new Date().toISOString());
  out.push('-- Paste this entire file into Supabase SQL Editor and Run');
  out.push('-- ============================================================');
  out.push('');
  out.push('CREATE SCHEMA IF NOT EXISTS nita;');
  out.push('SET search_path TO nita, public;');
  out.push('');
  // Enable uuid-ossp (idempotent)
  out.push('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  out.push('');

  // 1b. ENUM types (must come before CREATE TABLE since columns reference them)
  const { rows: enumRows } = await client.query(`
    SELECT t.typname AS name,
           array_to_string(array_agg(e.enumlabel ORDER BY e.enumsortorder), ',') AS labels
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE n.nspname = $1 AND t.typtype = 'e'
    GROUP BY t.typname
    ORDER BY t.typname
  `, [SCHEMA]);
  for (const en of enumRows) {
    const labels = String(en.labels || '').split(',').map((l) => `'${l}'`).join(', ');
    out.push(`CREATE TYPE nita.${en.name} AS ENUM (${labels});`);
  }
  if (enumRows.length) out.push('');

  for (const table of order) {
    // Get CREATE TABLE statement via pg_dump emulation
    const { rows: cols } = await client.query(`
      SELECT
        a.attname AS name,
        format_type(a.atttypid, a.atttypmod) AS type,
        NOT a.attnotnull AS nullable,
        pg_get_expr(d.adbin, d.adrelid) AS default_expr,
        a.attidentity AS identity
      FROM pg_attribute a
      JOIN pg_class c ON c.oid = a.attrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
      WHERE n.nspname = $1
        AND c.relname = $2
        AND a.attnum > 0
        AND NOT a.attisdropped
      ORDER BY a.attnum
    `, [SCHEMA, table]);

    out.push(`-- Table: nita.${table}`);
    out.push(`CREATE TABLE IF NOT EXISTS nita.${table} (`);
    const colDefs = cols.map((c) => {
      let def = `  "${c.name}" ${c.type}`;
      if (c.identity && c.identity !== '') def += ' GENERATED BY DEFAULT AS IDENTITY';
      if (!c.nullable) def += ' NOT NULL';
      if (c.default_expr) def += ` DEFAULT ${c.default_expr}`;
      return def;
    });
    out.push(colDefs.join(',\n'));
    out.push(');');
    out.push('');

    // Get primary key
    const { rows: pkRows } = await client.query(`
      SELECT a.attname
      FROM pg_index i
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE i.indrelid = 'nita.${table}'::regclass AND i.indisprimary
      ORDER BY a.attnum
    `);
    if (pkRows.length > 0) {
      const pkCols = pkRows.map((r) => `"${r.attname}"`).join(', ');
      out.push(`ALTER TABLE nita.${table} ADD CONSTRAINT "${table}_pkey" PRIMARY KEY (${pkCols});`);
    }

    // Get unique constraints
    const { rows: uqRows } = await client.query(`
      SELECT
        idx.relname AS constraint_name,
        array_to_string(ARRAY_AGG(a.attname ORDER BY array_position(i.indkey, a.attnum)), ',') AS cols
      FROM pg_index i
      JOIN pg_class c ON c.oid = i.indrelid
      JOIN pg_class idx ON idx.oid = i.indexrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
      WHERE n.nspname = $1 AND c.relname = $2
        AND i.indisunique AND NOT i.indisprimary
      GROUP BY c.relname, idx.relname
    `, [SCHEMA, table]);
    for (const uq of uqRows) {
      const cols = String(uq.cols || '').split(',').filter(Boolean).map((c) => `"${c}"`).join(', ');
      if (cols) out.push(`CREATE UNIQUE INDEX IF NOT EXISTS "${uq.constraint_name}" ON nita.${table} (${cols});`);
    }

    out.push('');

    // Get FK constraints (after CREATE TABLE so referent exists)
    const { rows: fkDefs } = await client.query(`
      SELECT
        con.conname AS constraint_name,
        string_agg(att.attname, ',' ORDER BY array_position(con.conkey, att.attnum)) AS src_cols,
        confrel.relname AS dst_table,
        string_agg(att2.attname, ',' ORDER BY array_position(con.confkey, att2.attnum)) AS dst_cols,
        confdeltype AS on_delete,
        confupdtype AS on_update
      FROM pg_constraint con
      JOIN pg_class rel ON rel.oid = con.conrelid
      JOIN pg_namespace n ON n.oid = rel.relnamespace
      JOIN pg_class confrel ON confrel.oid = con.confrelid
      JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY(con.conkey)
      JOIN pg_attribute att2 ON att2.attrelid = con.confrelid AND att2.attnum = ANY(con.confkey)
      WHERE con.contype = 'f' AND n.nspname = $1 AND rel.relname = $2
      GROUP BY con.conname, confrel.relname, confdeltype, confupdtype
    `, [SCHEMA, table]);
    for (const fk of fkDefs) {
      // pg node driver may return arrays as "{a,b}" or just strings; normalise
      const norm = (v) => String(v ?? '').replace(/[{}]/g, '').replace(/^\"|\"$/g, '').trim();
      const srcCols = norm(fk.src_cols).split(',').filter(Boolean).map((c) => `"${c.trim()}"`).join(', ');
      const dstCols = norm(fk.dst_cols).split(',').filter(Boolean).map((c) => `"${c.trim()}"`).join(', ');
      const onDelete = fk.on_delete !== 'a' ? ` ON DELETE ${({ r: 'CASCADE', c: 'CASCADE', n: 'SET NULL', d: 'SET DEFAULT', a: 'NO ACTION' }[fk.on_delete] || 'NO ACTION')}` : '';
      out.push(`ALTER TABLE nita.${table} ADD CONSTRAINT "${fk.constraint_name}" FOREIGN KEY (${srcCols}) REFERENCES nita.${fk.dst_table} (${dstCols})${onDelete};`);
    }
    if (fkDefs.length > 0) out.push('');

    // Get data
    const { rows: data } = await client.query(`SELECT * FROM nita.${table}`);
    if (data.length === 0) {
      out.push(`-- (no rows for nita.${table})`);
      out.push('');
      continue;
    }
    out.push(`-- Data for nita.${table} (${data.length} rows)`);
    const colNames = Object.keys(data[0]);
    const colList = colNames.map((c) => `"${c}"`).join(', ');
    for (const row of data) {
      const values = colNames.map((c) => sqlEscape(row[c])).join(', ');
      out.push(`INSERT INTO nita.${table} (${colList}) VALUES (${values});`);
    }
    out.push('');
  }

  out.push('-- Done.');

  // Supabase has pgcrypto preinstalled but not uuid-ossp; normalise DEFAULT to gen_random_uuid().
  let finalSql = out.join('\n').replace(/uuid_generate_v4\(\)/g, 'gen_random_uuid()');
  if (!finalSql.includes('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')) {
    finalSql = finalSql.replace(
      'CREATE SCHEMA IF NOT EXISTS nita;',
      'CREATE SCHEMA IF NOT EXISTS nita;\n\n-- Supabase has pgcrypto preinstalled; uuid-ossp is not enabled by default.\nCREATE EXTENSION IF NOT EXISTS "pgcrypto";',
    );
  }

  fs.writeFileSync(OUT, finalSql, 'utf8');
  console.log(`✓ Wrote ${OUT} (${(fs.statSync(OUT).size / 1024).toFixed(1)} KB, ${finalSql.split('\n').length} lines)`);

  await client.end();
}

main().catch((e) => {
  console.error('✗ FAILED:', e.message);
  console.error(e.stack);
  process.exit(1);
});
