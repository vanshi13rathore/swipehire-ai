import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://esrnnbwrdrpuugsdifvf.supabase.co';
const supabaseKey = 'sb_publishable_xfXM-VmNFsmMdpaJrhx6JQ_YF3L5yFO';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testRpc() {
  // 1. Sign up a dummy user
  const email = `test_${Date.now()}@example.com`;
  const password = 'testpassword123';
  
  console.log(`Signing up user: ${email}`);
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }
  
  console.log(`User created: ${authData.user?.id}`);

  // 2. Insert first resume (should be default)
  console.log("\n--- Upload 1 ---");
  const { data: res1, error: err1 } = await supabase.rpc('create_resume_atomic', {
    p_title: 'Resume 1',
    p_resume_data: { test: 1 },
    p_is_default: true
  });
  
  if (err1) {
    console.error("Error on upload 1:", err1);
    // Let's check if the function exists
    console.log("Checking if we get 23505 or something else.");
  } else {
    console.log("Upload 1 success:", res1);
  }

  // 3. Insert second resume (should be default and unset first)
  console.log("\n--- Upload 2 ---");
  const { data: res2, error: err2 } = await supabase.rpc('create_resume_atomic', {
    p_title: 'Resume 2',
    p_resume_data: { test: 2 },
    p_is_default: true
  });

  if (err2) {
    console.error("Error on upload 2:", err2);
  } else {
    console.log("Upload 2 success:", res2);
  }
}

testRpc();
