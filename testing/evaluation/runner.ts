import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import { analyzeResumeText } from '../../frontend/lib/ai/resume-analyzer';

if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is missing!");
  process.exit(1);
}

const DATASET_PATH = path.join(__dirname, '../resume_data.csv');
const OUTPUT_PATH = path.join(__dirname, 'raw_results.json');
const SAMPLE_SIZE = 100;

interface ResumeRecord {
  job_position_name: string;
  skills: string;
  educational_institution_name: string;
  degree_names: string;
  major_field_of_studies: string;
  professional_company_names: string;
  positions: string;
  responsibilities: string;
  certification_providers: string;
  certification_skills: string;
  career_objective: string;
  matched_score: string;
  languages: string;
  skills_required: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function buildResumeText(record: ResumeRecord): string {
  return `
    Objective: ${record.career_objective}
    
    Skills: ${record.skills}
    
    Experience:
    Companies: ${record.professional_company_names}
    Positions: ${record.positions}
    Responsibilities: ${record.responsibilities}
    
    Education:
    Institutions: ${record.educational_institution_name}
    Degrees: ${record.degree_names}
    Majors: ${record.major_field_of_studies}
    
    Certifications:
    Providers: ${record.certification_providers}
    Skills: ${record.certification_skills}
  `.trim();
}

async function run() {
  console.log("Loading dataset...");
  const fileContent = fs.readFileSync(DATASET_PATH, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as ResumeRecord[];
  
  // Deterministic sampling
  const step = Math.floor(records.length / SAMPLE_SIZE);
  const sample = [];
  for (let i = 0; i < SAMPLE_SIZE; i++) {
    sample.push(records[i * step]);
  }
  
  let results: any[] = [];
  
  // Load checkpoint
  if (fs.existsSync(OUTPUT_PATH)) {
    const existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    results = existing;
    console.log(`Loaded checkpoint with ${results.length} records.`);
  } else {
    // Initialize with pending status
    results = sample.map((rec, i) => ({
      id: i,
      target_role: rec.job_position_name,
      status: 'Pending',
      dataset_match_score: rec.matched_score
    }));
  }
  
  let quotaExhausted = false;
  
  for (let i = 0; i < sample.length; i++) {
    if (results[i].status === 'Success' || results[i].status === 'Failed') {
      continue; // Skip already processed
    }
    
    if (quotaExhausted) {
      break;
    }
    
    const record = sample[i];
    console.log(`[${i + 1}/${SAMPLE_SIZE}] Analyzing resume for target role: ${record.job_position_name}...`);
    
    const syntheticText = buildResumeText(record);
    
    const startEndToEnd = performance.now();
    let success = false;
    let retries = 0;
    
    while (!success && retries < 3) {
      try {
        const startGemini = performance.now();
        const response = await analyzeResumeText(syntheticText);
        if (!response.success) {
          throw new Error(response.error || "Unknown error from analyzeResumeText");
        }
        
        const endGemini = performance.now();
        
        const geminiLatencyMs = endGemini - startGemini;
        const endToEndMs = performance.now() - startEndToEnd;
        
        results[i] = {
          ...results[i],
          status: response.success ? 'Success' : 'Failed',
          ground_truth: {
            skills: record.skills,
            education: record.educational_institution_name,
            experience: record.positions,
            certifications: record.certification_skills,
            languages: record.languages || "",
            keywords: record.skills_required || ""
          },
          gemini_response: response.success ? response.data : null,
          error: response.success ? null : response.error,
          metrics: {
            gemini_latency_ms: geminiLatencyMs,
            end_to_end_ms: endToEndMs
          }
        };
        
        success = true;
      } catch (err: any) {
        const errMsg = err.message || "";
        const isQuota = errMsg.includes("429") || errMsg.includes("Quota") || errMsg.includes("quota") || err.status === 429;
        
        if (isQuota) {
          retries++;
          if (retries >= 3) {
            console.warn(`[429 Quota Exhausted] Failed after 3 retries. Assuming daily quota hit. Stopping pipeline.`);
            quotaExhausted = true;
            break;
          } else {
            console.warn(`[429 Rate Limit] Retrying in ${retries * 15}s...`);
            await delay(retries * 15000);
          }
        } else {
          console.error(`Error analyzing record ${i}:`, err.message);
          results[i] = {
            ...results[i],
            status: 'Failed',
            error: err.message,
            metrics: {
              end_to_end_ms: performance.now() - startEndToEnd
            }
          };
          break;
        }
      }
    }
    
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
    
    if (quotaExhausted) break;
    
    // Base delay for RPM limits
    if (i < sample.length - 1) {
      await delay(5000);
    }
  }
  
  const completed = results.filter(r => r.status === 'Success' || r.status === 'Failed').length;
  console.log(`Pipeline stopped. Evaluated ${completed} out of ${SAMPLE_SIZE} resumes.`);
  if (quotaExhausted) {
    console.log("Run again tomorrow when the quota resets to continue.");
  }
}

run().catch(console.error);
