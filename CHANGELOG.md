# Changelog

All notable changes to the SwipeHire project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.2.0] - 2026-08-01

### Added
- **Hybrid ATS Scoring System**: Replaced the purely LLM-hallucinated ATS score with a robust, explainable, hybrid deterministic scoring algorithm in TypeScript.
- **QA Checklist**: Introduced a rigorous end-to-end `QA_TESTING.md` manual checklist.
- **Changelog**: Initialized the project changelog.

### Fixed
- Fixed critical atomic deployment bugs related to Supabase RPC migrations (`create_resume_atomic`, `set_default_resume_atomic`) which previously caused `23505 duplicate key value` errors.

## [v1.1.0] - 2026-07-31

### Added
- **AI Evaluation Pipeline**: Developed a scientifically valid, mathematically robust multi-day evaluation pipeline leveraging 100 benchmark resumes.
- **Explainability Reports**: Implemented deep Set Theory difference tracking to highlight missing and hallucinated skills.
- **Regression Testing**: Added `regression_log.csv` to track performance and latency over time.
- **HTML Dashboard**: Built an automated Evaluation Dashboard summarizing system extraction metrics (Precision, Recall, MAE).
- **Graceful Quota Handling**: Handled Google Cloud API `429` rate limits with exponential backoff and safe state checkpointing.

## [v1.0.0] - 2026-07-30

### Added
- **Initial Release**: Core SwipeHire functionality.
- **Authentication**: Full user authentication via Supabase.
- **Resume Parsing**: Zero-shot structured JSON extraction using Gemini 2.5 Flash API.
- **Career DNA**: AI-driven analysis of candidate strengths and weaknesses.
- **Job Matching**: Intelligent job title recommendation based on parsed experience.
- **UI Architecture**: Fully responsive dashboard built with Next.js App Router and Tailwind CSS.
