const { createClient } = require("@supabase/supabase-js");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config({path: "/Users/vanshikarathore/Desktop/SwipeHire/frontend/.env.local"});
global.WebSocket = require('ws'); 

async function auditPipeline() {
  console.log("--- SWIPEHIRE PRODUCTION AUDIT ---");
  
  // 1. Check Env Vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  console.log(`1. Supabase URL: ${supabaseUrl ? "EXISTS" : "MISSING"}`);
  console.log(`2. Supabase Key: ${supabaseKey ? "EXISTS" : "MISSING"}`);
  console.log(`3. Gemini Key: ${geminiKey ? "EXISTS" : "MISSING"}`);

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase config missing.");
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log("\n--- AUTHENTICATION ---");
  const email = `test_${Date.now()}@example.com`;
  const password = "TestPassword123!";
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
     console.error("Auth Failed:", authError.message);
     return;
  }
  console.log(`User Authenticated: ${authData.user.id}`);
  
  const userId = authData.user.id;

  console.log("\n--- STORAGE ---");
  const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
  if (bucketError) {
     console.error("Failed to list buckets:", bucketError.message);
  } else {
     const hasResumes = buckets.find(b => b.name === "resumes");
     if (!hasResumes) {
         console.error("resumes bucket DOES NOT EXIST!");
     } else {
         console.log("resumes bucket EXISTS.");
     }
  }

  console.log("\n--- UPLOAD PDF ---");
  const dummyPdfBytes = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 53, 10, 37, 226, 227, 207, 211, 10]); 
  const filePath = `${userId}/resume.pdf`;
  
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, dummyPdfBytes, { contentType: "application/pdf", upsert: true });

  if (uploadError) {
     console.error("Storage upload failed:", uploadError.message);
  } else {
     console.log("Storage upload SUCCESS.");
  }

  console.log("\n--- GEMINI ---");
  if (!geminiKey) {
     console.error("Missing Gemini key");
  } else {
     try {
       const ai = new GoogleGenAI({ apiKey: geminiKey });
       const response = await ai.models.generateContent({
         model: "gemini-2.5-flash",
         contents: "Reply with the exact word SUCCESS",
       });
       console.log("Gemini response:", response.text.trim());
     } catch (err) {
       console.error("Gemini failed:", err.message);
     }
  }

  console.log("\n--- DATABASE INSERT ---");
  const { error: dbError } = await supabase
    .from('resume_versions')
    .insert({
      user_id: userId,
      title: "test.pdf",
      resume_data: { test: true },
      is_default: true
    });

  if (dbError) {
      console.error("resume_versions insert failed:", dbError.message);
  } else {
      console.log("resume_versions insert SUCCESS.");
  }

}

auditPipeline().catch(console.error);
