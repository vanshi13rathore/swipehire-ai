 
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const lines = env.split('\n');
let url = '';
let key = '';

for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    url = line.split('=')[1].replace(/"/g, '').trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    key = line.split('=')[1].replace(/"/g, '').trim();
  }
}

async function check() {
  const res = await fetch(`${url}/rest/v1/resume_versions`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      user_id: "00000000-0000-0000-0000-000000000000",
      title: "test",
      resume_data: {},
      is_default: false
    })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}
check();
