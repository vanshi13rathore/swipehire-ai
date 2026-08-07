# SwipeHire Hybrid ATS Scoring Formula

SwipeHire calculates an Applicant Tracking System (ATS) score using a Hybrid Engine. Rather than relying solely on the LLM to output a black-box score, we use the LLM exclusively for structured entity extraction and qualitative review. The numerical score is computed purely deterministically in TypeScript (`frontend/lib/ai/resume-analyzer.ts`).

## Scoring Breakdown (100 Points Total)

### 1. Section Completeness (30%)
Evaluates whether the resume contains the fundamental foundational sections.
- **Professional Summary:** +10 points (Must be >20 characters)
- **Work Experience:** +10 points (Array must have >0 entries)
- **Education:** +10 points (Array must have >0 entries)

### 2. Quantifiable Achievements (20%)
ATS systems and human recruiters heavily prioritize impact metrics (%, $, volume, counts).
- **Extraction:** We use RegEx (`/\\d+/g`) to count instances of numbers within the bullet points of the Experience section, plus explicitly extracted achievements.
- **Scoring:** +2 points for every numerical metric found.
- **Maximum:** 20 points (10+ metrics found).

### 3. Formatting Consistency (20%)
Evaluates basic structured integrity expected by standard ATS parsers.
- **Contact Info:** -10 penalty if Email or Phone is missing.
- **Skill Depth:** -10 penalty if fewer than 5 core skills are extracted.
- **Base Score:** 20 points minus any penalties.

### 4. LLM Qualitative Penalty (30%)
The LLM evaluates the qualitative aspects of the text (Grammar, Weaknesses, missing expected skills).
- **Grammar & Tense:** -10 penalty if the LLM flags poor grammar, tense inconsistencies, or spelling errors.
- **Missing Core Skills:** -2 penalty for *each* industry-standard skill missing from the resume based on the inferred role.
- **Qualitative Weaknesses:** -3 penalty for *each* additional weakness flagged by the LLM (e.g. "Too much jargon", "Vague descriptions").
- **Base Score:** 30 points minus any penalties.

---

## Example Calculation

**Resume A (Mid-Level Frontend Engineer)**
- **Section Completeness:** 30 points (Summary, Exp, Edu all present)
- **Achievements:** 12 points (6 numerical metrics found)
- **Formatting:** 20 points (Full contact info, 15+ skills)
- **LLM Penalty:** 24 points (-6 points penalty for missing "React Testing Library" and "Docker")

**Final ATS Score:** 86/100
