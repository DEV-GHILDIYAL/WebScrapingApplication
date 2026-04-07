'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useJobs } from '@/hooks/useJobs';
import { Button, EmptyState, TableSkeleton, useToast } from '@/components/ui';
import JobTable from '@/components/dashboard/JobTable';
import JobFilters from '@/components/dashboard/JobFilters';
import { Plus, RefreshCcw } from 'lucide-react';

export default function JobsPage() {
  const { jobs, loading, error, refresh, deleteJob, runJob } = useJobs();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = 
        job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.targetUrl.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchTerm, statusFilter]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      const result = await deleteJob(id);
      if (result?.success) {
        toastSuccess('Job Deleted', 'The job has been removed from your workspace.');
      } else {
        toastError('Deletion Failed', 'An error occurred while removing the job.');
      }
    }
  };

  const handleRun = async (id: string) => {
    toastInfo('Starting Job', 'Connecting to scraping node...');
    const result = await runJob(id);
    if (result.success) {
       toastSuccess('Job Running', 'The scraping process has started successfully.');
    } else {
       toastError('Execution Failed', result.error || 'Check your configuration and try again.');
    }
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-64 bg-slate-50 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
        <TableSkeleton rows={6} cols={5} />
      </div>
    );
  }

  if (error && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 animate-fade-in">
        <div className="bg-danger-50 text-danger-600 p-4 rounded-full mb-4 border border-danger-100 shadow-sm">
          <RefreshCcw size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Failed to load jobs</h3>
        <p className="text-slate-500 max-w-xs mt-2">{error}</p>
        <Button 
          variant="secondary" 
          onClick={() => {
            toastInfo('Refreshing', 'Attempting to reconnect...');
            refresh();
          }} 
          className="mt-6"
          leftIcon={<RefreshCcw size={18} />}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Scraping Jobs</h1>
          <p className="text-slate-500">Manage and monitor your automated data extractors.</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button leftIcon={<Plus size={18} />}>
            Create New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No jobs yet"
          description="Create your first scraping job to start extracting data from the web automatically."
          actionLabel="Create First Job"
          onAction={() => window.location.href = '/dashboard/jobs/new'}
        />
      ) : (
        <>
          <JobFilters 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
          
          <JobTable 
            jobs={filteredJobs} 
            onDelete={handleDelete}
            onRun={handleRun}
          />

          <div className="flex items-center justify-between mt-6 text-sm text-slate-500">
            <p>Showing {filteredJobs.length} of {jobs.length} jobs</p>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" disabled>Previous</Button>
              <Button variant="secondary" size="sm" disabled>Next</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
