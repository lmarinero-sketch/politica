require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testAll() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = process.env.SUPABASE_PROJECT_REF;

  console.log('Testing Supabase Client (Service Role)...');
  const supabase = createClient(url, serviceKey);

  // Test 1: Fetch using Supabase client
  try {
    const { data, error } = await supabase.from('_test_').select('*').limit(1);
    console.log('Supabase JS test result: error =', error ? error.message : null);
  } catch (e) {
    console.error('Supabase JS catch:', e.message);
  }

  // Test 2: Supabase Management API with SUPABASE_ACCESS_TOKEN
  console.log('\nTesting Supabase Management API (Token)...');
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${ref}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Project info status:', res.status);
    const data = await res.json();
    console.log('Project name:', data.name, '| Status:', data.status, '| Region:', data.region);
  } catch (e) {
    console.error('Management API error:', e.message);
  }

  // Test 3: SQL Execution via Management API
  console.log('\nTesting SQL query via Management API...');
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: 'SELECT version();' })
    });
    console.log('SQL query status:', res.status);
    const sqlData = await res.json();
    console.log('SQL result:', sqlData);
  } catch (e) {
    console.error('SQL query error:', e.message);
  }
}

testAll();
