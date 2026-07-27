/**
 * Placeholder interfaces for future Supabase Database integration.
 * These will eventually extend or wrap the auto-generated `database.types.ts`.
 */

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  location?: string;
  currentRole?: string;
  yearsOfExperience?: number;
  preferredJobTitle?: string;
  skills: string[];
  preferredSalary?: string;
  workStyle?: 'remote' | 'hybrid' | 'onsite';
  preferredLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  skillsExtracted: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  experienceDetected: any[]; // Placeholder for future structured experience
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  educationRecognized: any[]; // Placeholder for future structured education
  atsScore?: number;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  location: string;
  isRemote: boolean;
  salary: string;
  employmentType: string;
  experienceLevel: string;
  skillsRequired: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string;
}


export interface ResumeAnalysisRecord {
  id: string;
  userId: string;
  resumeFilename: string;
  resumeUpdatedAt: string;
  analysis: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SavedJob {
  id: string;
  user_id: string;
  job_id: string;
  job_data: Record<string, unknown>;
  saved_at: string;
}

export type ApplicationStatus = 
  | 'Applied' 
  | 'Interview' 
  | 'Assessment' 
  | 'Offer' 
  | 'Rejected' 
  | 'Accepted' 
  | 'Withdrawn';

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  job_data: Record<string, unknown>;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
}

export interface ResumeVersion {
  id: string;
  user_id: string;
  title: string;
  resume_data: ResumeData;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface CareerChat {
  id: string;
  user_id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

export interface InterviewQuestion {
  id: string;
  text: string;
  category: 'Behavioral' | 'Technical' | 'Resume-based' | 'Job-specific';
}

export interface InterviewFeedback {
  communication: number;
  technicalDepth: number;
  confidence: number;
  problemSolving: number;
  starFormat: number;
  grammar: number;
  professionalism: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  missedConcepts: string[];
  suggestedImprovements: string[];
  recommendedResources: string[];
  questionFeedback: Record<string, string>;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  role: string;
  company: string | null;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  job_description: string | null;
  questions: InterviewQuestion[];
  answers: Record<string, string>;
  feedback: InterviewFeedback | null;
  overall_score: number | null;
  status: 'Not Started' | 'In Progress' | 'Completed';
  created_at: string;
  updated_at: string;
}

export interface ResumeData {
  header: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    url?: string;
  }>;
  achievements: string[];
  certifications: string[];
  links: Array<{
    id: string;
    name: string;
    url: string;
  }>;
}

export interface CareerGoal {
  id: string;
  user_id: string;
  title: string;
  target_value: number;
  current_value: number;
  metric: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DashboardShare {
  id: string;
  user_id: string;
  token: string;
  is_active: boolean;
  created_at: string;
}
