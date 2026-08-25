const { Client } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
(async () => {
  const c = new Client({
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER || process.env.DATABASE_USERNAME || 'dental_user',
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  });
  await c.connect();
  const r = await c.query(
    "SELECT t.typname, array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels " +
    "FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace " +
    "JOIN pg_enum e ON e.enumtypid = t.oid " +
    "WHERE n.nspname='nita' AND t.typtype = 'e' " +
    "GROUP BY t.typname"
  );
  console.log(JSON.stringify(r.rows, null, 2));
  await c.end();
})();
