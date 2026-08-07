import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JobFeed } from './components/jobs/job-feed';
import * as React from 'react';
import type { JobWithScores } from '@/lib/ai/types';

// Mock useRouter
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() })
}));

// Mock useInView
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: false })
}));

// Mock supabase functions
vi.mock('@/lib/supabase/saved-jobs', () => ({
  getSavedJobIds: () => Promise.resolve([]),
  isJobSaved: () => false,
  saveJob: vi.fn(),
  unsaveJob: vi.fn()
}));
vi.mock('@/lib/supabase/applications', () => ({
  getAppliedJobIds: () => Promise.resolve([]),
  isApplied: () => false,
  applyToJob: vi.fn()
}));

const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: { name: 'TechCorp', logoUrl: '' },
    location: 'Remote',
    isRemote: true,
    experienceLevel: 'Senior',
    employmentType: 'Full-time',
    salary: '₹30 LPA+',
    skills: ['React', 'TypeScript', 'Next.js'],
    postedAt: new Date().toISOString(),
    recommendationScore: 95,
  },
  {
    id: '2',
    title: 'Backend Developer',
    company: { name: 'DataSys', logoUrl: '' },
    location: 'USA',
    isRemote: false,
    experienceLevel: 'Mid-Level',
    employmentType: 'Contract',
    salary: '₹20 LPA+',
    skills: ['Node.js', 'Python', 'AWS'],
    postedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    recommendationScore: 85,
  },
  {
    id: '3',
    title: 'Junior Data Scientist',
    company: { name: 'AI Inc', logoUrl: '' },
    location: 'India',
    isRemote: false,
    experienceLevel: 'Entry Level',
    employmentType: 'Full-time',
    salary: '₹10 LPA+',
    skills: ['Python', 'Machine Learning', 'SQL'],
    postedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    recommendationScore: 75,
  }
];

describe('JobFeed Filters', () => {
  it('Search works', async () => {
    render(<JobFeed jobs={mockJobs as unknown as JobWithScores[]} hasResume={true} />);
    await waitFor(() => expect(screen.queryByText('Senior Frontend Engineer')).toBeInTheDocument());
    
    const searchInput = screen.getByPlaceholderText('Search by title, company, or keywords...');
    fireEvent.change(searchInput, { target: { value: 'Backend' } });
    
    // Only job 2 should be visible
    expect(screen.queryByText('Senior Frontend Engineer')).not.toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.queryByText('Junior Data Scientist')).not.toBeInTheDocument();
  });

  it('Location filter works', async () => {
    render(<JobFeed jobs={mockJobs as unknown as JobWithScores[]} hasResume={true} />);
    await waitFor(() => expect(screen.queryByText('Senior Frontend Engineer')).toBeInTheDocument());
    
    const locationSelect = screen.getByLabelText(/Location/i, { selector: 'select' });
    fireEvent.change(locationSelect, { target: { value: 'USA' } });
    
    expect(screen.queryByText('Senior Frontend Engineer')).not.toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
  });

  it('Experience filter works', async () => {
    render(<JobFeed jobs={mockJobs as unknown as JobWithScores[]} hasResume={true} />);
    await waitFor(() => expect(screen.queryByText('Senior Frontend Engineer')).toBeInTheDocument());
    
    const experienceSelect = screen.getByLabelText(/Experience/i, { selector: 'select' });
    fireEvent.change(experienceSelect, { target: { value: 'Entry Level' } });
    
    expect(screen.getByText('Junior Data Scientist')).toBeInTheDocument();
    expect(screen.queryByText('Backend Developer')).not.toBeInTheDocument();
  });

  it('Employment type filter works', async () => {
    render(<JobFeed jobs={mockJobs as unknown as JobWithScores[]} hasResume={true} />);
    await waitFor(() => expect(screen.queryByText('Senior Frontend Engineer')).toBeInTheDocument());
    
    const typeSelect = screen.getByLabelText(/Type/i, { selector: 'select' });
    fireEvent.change(typeSelect, { target: { value: 'Contract' } });
    
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.queryByText('Senior Frontend Engineer')).not.toBeInTheDocument();
  });

  it('AI Match filter works', async () => {
    render(<JobFeed jobs={mockJobs as unknown as JobWithScores[]} hasResume={true} />);
    await waitFor(() => expect(screen.queryByText('Senior Frontend Engineer')).toBeInTheDocument());
    
    const aiMatchSelect = screen.getByLabelText(/AI Match/i, { selector: 'select' });
    fireEvent.change(aiMatchSelect, { target: { value: '90%+' } });
    
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.queryByText('Backend Developer')).not.toBeInTheDocument();
  });

  it('Skills filter works', async () => {
    render(<JobFeed jobs={mockJobs as unknown as JobWithScores[]} hasResume={true} />);
    await waitFor(() => expect(screen.queryByText('Senior Frontend Engineer')).toBeInTheDocument());
    
    const pythonSkill = screen.getAllByText('Python').find(e => e.tagName === 'BUTTON');
    if (pythonSkill) fireEvent.click(pythonSkill);
    
    expect(screen.queryByText('Senior Frontend Engineer')).not.toBeInTheDocument();
    expect(screen.getByText('Backend Developer')).toBeInTheDocument();
    expect(screen.getByText('Junior Data Scientist')).toBeInTheDocument();
  });

  it('Reset Filters works', async () => {
    render(<JobFeed jobs={mockJobs as unknown as JobWithScores[]} hasResume={true} />);
    await waitFor(() => expect(screen.queryByText('Senior Frontend Engineer')).toBeInTheDocument());
    
    const searchInput = screen.getByPlaceholderText('Search by title, company, or keywords...');
    fireEvent.change(searchInput, { target: { value: 'Nowhere' } });
    expect(screen.queryByText('Senior Frontend Engineer')).not.toBeInTheDocument();
    
    const clearBtn = screen.getByText('Clear all');
    fireEvent.click(clearBtn);
    
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
  });

  it('Metrics update correctly after filtering', async () => {
    render(<JobFeed jobs={mockJobs as unknown as JobWithScores[]} hasResume={true} />);
    await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument()); // 3 total jobs initially
    
    const searchInput = screen.getByPlaceholderText('Search by title, company, or keywords...');
    fireEvent.change(searchInput, { target: { value: 'Backend' } });
    
    // Total jobs should update to 1
    expect(screen.getByText('1')).toBeInTheDocument();
    // Remote jobs should update to 0
    // Math logic inside expects...
  });
});
