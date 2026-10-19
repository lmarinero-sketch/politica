require('dotenv').config();

async function runSql(sql) {
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF;

  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`SQL error (${res.status}): ${txt}`);
  }
  return await res.json();
}

async function testTableCreation() {
  console.log('Testing table creation...');
  await runSql(`
    CREATE TABLE IF NOT EXISTS _test_migration (
      id SERIAL PRIMARY KEY,
      test_field TEXT
    );
  `);
  console.log('Table created!');

  await runSql(`INSERT INTO _test_migration (test_field) VALUES ('hello Supabase');`);
  console.log('Row inserted!');

  const rows = await runSql(`SELECT * FROM _test_migration;`);
  console.log('Selected:', rows);

  await runSql(`DROP TABLE _test_migration;`);
  console.log('Table dropped cleanly!');
}

testTableCreation().catch(console.error);
