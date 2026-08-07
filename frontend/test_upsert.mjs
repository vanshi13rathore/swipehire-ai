import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const payload = {
    id: "00000000-0000-0000-0000-000000000000",
    full_name: "Test",
    email: "test@example.com",
    location: "Test",
    current_role: "fresher",
    years_of_experience: parseInt("0", 10),
    preferred_job_title: "data anyalst",
    skills: ["python"],
    preferred_salary: "1000",
    work_style: "remote", // Using remote (lowercase) as the form select actually has lowercase values
    preferred_location: "New York, NY",
    is_complete: true
  };
  
  const { error } = await supabase.from("profiles").upsert(payload);
  console.log("Upsert Error:", JSON.stringify(error, null, 2));
}
run();
