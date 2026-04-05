'use client';

import { useState, useCallback, useEffect } from 'react';
import { Job, JobRun, JobStatus, ApiResponse } from '../lib/types';
import { jobsService } from '../services/jobs';
import { delay, generateId } from '../lib/utils';

/**
 * Hook to manage job list and job operations
 */
export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const resp = await jobsService.getJobs();
    if (resp.success && resp.data) {
      setJobs(resp.data);
    } else {
      setError(resp.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const createJob = async (jobData: Partial<Job>) => {
    const resp = await jobsService.createJob(jobData);
    if (resp.success && resp.data) {
      setJobs(prev => [resp.data!, ...prev]);
      return resp;
    }
    return resp;
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    const resp = await jobsService.updateJob(id, updates);
    if (resp.success && resp.data) {
      setJobs(prev => prev.map(j => j.id === id ? resp.data! : j));
    }
    return resp;
  };

  const deleteJob = async (id: string) => {
    const resp = await jobsService.deleteJob(id);
    if (resp.success) {
      setJobs(prev => prev.filter(j => j.id !== id));
    }
    return resp;
  };

  /**
   * Simulate a job execution lifecycle: 
   * QUEUED -> RUNNING -> COMPLETED/FAILED
   */
  const runJob = async (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    // 1. Transition to QUEUED
    await updateJob(id, { status: JobStatus.QUEUED });
    
    // Simulate Step Function trigger latency
    await delay(1000); 

    // 2. Transition to RUNNING
    const runId = generateId('run_');
    const startedAt = new Date().toISOString();
    await updateJob(id, { status: JobStatus.RUNNING, lastRunAt: startedAt });

    // Simulate scraping duration
    await delay(3000 + Math.random() * 5000);

    // 3. Complete or Fail (85% success)
    const isSuccess = Math.random() < 0.85;
    const recordsExtracted = isSuccess ? Math.floor(Math.random() * 2000) + 100 : 0;
    const completedAt = new Date().toISOString();
    
    const finalStatus = isSuccess ? JobStatus.COMPLETED : JobStatus.FAILED;

    const runRecord: JobRun = {
      id: runId,
      jobId: id,
      status: finalStatus,
      startedAt,
      completedAt,
      recordsExtracted,
      error: isSuccess ? undefined : 'Scraping failed: Connection refused by target server.'
    };

    // Store the run and update the job record
    await jobsService.addJobRun(runRecord);
    await updateJob(id, { 
      status: finalStatus,
      runCount: job.runCount + 1,
      successCount: job.successCount + (isSuccess ? 1 : 0),
      failureCount: job.failureCount + (isSuccess ? 0 : 1)
    });
  };

  return {
    jobs,
    loading,
    error,
    refresh: fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    runJob
  };
}
