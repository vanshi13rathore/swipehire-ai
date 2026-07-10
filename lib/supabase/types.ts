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

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  resumeId: string;
  status: 'applied' | 'reviewing' | 'interview' | 'rejected' | 'accepted';
  appliedAt: string;
  updatedAt: string;
}
