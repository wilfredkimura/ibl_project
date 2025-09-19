const { Pool } = require("pg");
require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Render-managed PostgreSQL requires SSL; disable in local dev
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
