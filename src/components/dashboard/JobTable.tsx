'use client';

import React from 'react';
import Link from 'next/link';
import { Badge, Button } from '@/components/ui';
import { Job, JobStatus } from '@/lib/types';
import { Edit2, Trash2, ExternalLink, Play, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface JobTableProps {
  jobs: Job[];
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
}

const getStatusVariant = (status: JobStatus) => {
  switch (status) {
    case JobStatus.COMPLETED:
      return 'success';
    case JobStatus.RUNNING:
      return 'info';
    case JobStatus.FAILED:
      return 'danger';
    case JobStatus.QUEUED:
      return 'warning';
    default:
      return 'neutral';
  }
};

export default function JobTable({ jobs, onDelete, onRun }: JobTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <p className="text-slate-500">No jobs match your filters.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Target URL</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Run</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-25 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{job.name}</span>
                    <span className="text-xs text-slate-400 font-mono">{job.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 max-w-xs overflow-hidden">
                    <span className="text-sm text-slate-600 truncate">{job.targetUrl}</span>
                    <a 
                      href={job.targetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-brand-600 transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(job.status)}>
                    {job.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-700">
                      {job.lastRunAt 
                        ? formatDistanceToNow(new Date(job.lastRunAt), { addSuffix: true }) 
                        : 'Never'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {job.runCount} total runs
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Clock size={14} className="text-slate-400" />
                    <span>
                      {job.scheduleConfig.type === 'manual' 
                        ? 'Manual' 
                        : job.scheduleConfig.type === 'interval'
                        ? `Every ${job.scheduleConfig.intervalMinutes}m`
                        : 'Cron Schedule'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => onRun(job.id)}
                      title="Run now"
                    >
                      <Play size={14} />
                    </Button>
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      <Button variant="secondary" size="sm" title="Edit job">
                        <Edit2 size={14} />
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => onDelete(job.id)}
                      className="hover:text-danger-600 hover:border-danger-200"
                      title="Delete job"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
