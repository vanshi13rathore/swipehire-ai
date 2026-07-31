const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data, error } = await supabase.from('resume_versions').select('*');
  if (error) console.error(error);
  console.log("Resumes found:", data ? data.length : 0);
  if (data && data.length > 0) {
    console.log("First resume ID:", data[0].id);
    console.log("User ID:", data[0].user_id);
    console.log("Is Default:", data[0].is_default);
  }
}
check();
