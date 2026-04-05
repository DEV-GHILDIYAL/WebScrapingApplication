import { Job, JobRun, JobStatus, ApiResponse } from '../lib/types';
import { MOCK_JOBS, MOCK_JOB_RUNS } from '../lib/mock-data';
import { delay, shouldFail, generateId } from '../lib/utils';

/**
 * Mock Jobs Service (DynamoDB + SQS abstraction)
 * Persists to localStorage as requested.
 */

const STORAGE_KEYS = {
  JOBS: 'sf_jobs',
  RUNS: 'sf_job_runs',
};

const getStoredJobs = (): Job[] => {
  if (typeof window === 'undefined') return MOCK_JOBS;
  const stored = localStorage.getItem(STORAGE_KEYS.JOBS);
  return stored ? JSON.parse(stored) : MOCK_JOBS;
};

const setStoredJobs = (jobs: Job[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }
};

const getStoredRuns = (): JobRun[] => {
  if (typeof window === 'undefined') return MOCK_JOB_RUNS;
  const stored = localStorage.getItem(STORAGE_KEYS.RUNS);
  return stored ? JSON.parse(stored) : MOCK_JOB_RUNS;
};

const setStoredRuns = (runs: JobRun[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(runs));
  }
};

export const jobsService = {
  async getJobs(): Promise<ApiResponse<Job[]>> {
    await delay(Math.random() * 700 + 800);
    if (shouldFail(0.1)) return { success: false, data: null, error: 'Failed to fetch jobs from database.' };
    
    return { success: true, data: getStoredJobs(), error: null };
  },

  async getJobById(id: string): Promise<ApiResponse<Job>> {
    await delay(1000);
    const jobs = getStoredJobs();
    const job = jobs.find(j => j.id === id);
    
    if (!job) return { success: false, data: null, error: 'Job not found.' };
    return { success: true, data: job, error: null };
  },

  async createJob(jobData: Partial<Job>): Promise<ApiResponse<Job>> {
    await delay(1500);
    if (shouldFail(0.15)) return { success: false, data: null, error: 'Error creating job entry.' };

    const newJob: Job = {
      id: generateId('job_'),
      name: jobData.name || 'Untitled Job',
      targetUrl: jobData.targetUrl || '',
      status: JobStatus.QUEUED,
      fields: jobData.fields || [],
      proxyConfig: jobData.proxyConfig || { providerId: 'default', rotationEnabled: true },
      scheduleConfig: jobData.scheduleConfig || { type: 'manual' },
      outputFormat: jobData.outputFormat || 'JSON' as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runCount: 0,
      successCount: 0,
      failureCount: 0,
    };

    const jobs = getStoredJobs();
    const updatedJobs = [newJob, ...jobs];
    setStoredJobs(updatedJobs);

    return { success: true, data: newJob, error: null };
  },

  async updateJob(id: string, updates: Partial<Job>): Promise<ApiResponse<Job>> {
    await delay(1200);
    const jobs = getStoredJobs();
    const index = jobs.findIndex(j => j.id === id);
    
    if (index === -1) return { success: false, data: null, error: 'Job not found.' };

    const updatedJob = { 
      ...jobs[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    jobs[index] = updatedJob;
    setStoredJobs(jobs);

    return { success: true, data: updatedJob, error: null };
  },

  async deleteJob(id: string): Promise<ApiResponse<boolean>> {
    await delay(1000);
    const jobs = getStoredJobs();
    const updatedJobs = jobs.filter(j => j.id !== id);
    setStoredJobs(updatedJobs);
    
    return { success: true, data: true, error: null };
  },

  async getAllJobRuns(): Promise<ApiResponse<JobRun[]>> {
    await delay(1000);
    const runs = getStoredRuns();
    return { success: true, data: runs.sort((a, b) => b.startedAt.localeCompare(a.startedAt)), error: null };
  },

  async addJobRun(run: JobRun): Promise<void> {
    const runs = getStoredRuns();
    setStoredRuns([run, ...runs]);
  }
};
