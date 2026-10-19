const { Client } = require('pg');
require('dotenv').config();

async function testConnection() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Successfully connected to Supabase PostgreSQL!');

    const res = await client.query(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      ORDER BY table_schema, table_name;
    `);

    console.log('Existing tables in database:');
    console.table(res.rows);

    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

testConnection();
