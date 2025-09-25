/*
  Simple migration runner for Render.
  It reads backend/schema.sql and executes it against the DATABASE_URL.
*/
const fs = require('fs');
const path = require('path');
const pool = require('../db');

(async () => {
  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    if (!sql || !sql.trim()) {
      console.log('No SQL found in schema.sql, skipping.');
      process.exit(0);
    }
    console.log('[migrate] Applying schema from', schemaPath);
    console.log('[migrate] Schema length (chars):', sql.length);
    await pool.query(sql);
    console.log('Database schema applied successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to apply database schema:', err?.stack || err);
    process.exit(1);
  }
})();
