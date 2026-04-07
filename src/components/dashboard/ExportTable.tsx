'use client';

import React, { useState } from 'react';
import { Badge, Button } from '@/components/ui';
import { Job, JobRun, JobStatus, OutputFormat } from '@/lib/types';
import { Download, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { downloadFile, convertToCSV, generateRealisticData } from '@/lib/utils';

interface ExportTableProps {
  runs: JobRun[];
  jobs: Job[];
}

export default function ExportTable({ runs, jobs }: ExportTableProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (run: JobRun, formatType: OutputFormat) => {
    setDownloadingId(run.id);
    
    // Find the associated job to get field definitions
    const job = jobs.find(j => j.id === run.jobId);
    if (!job) {
      setDownloadingId(null);
      return;
    }

    // Simulate a brief generation delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate realistic data based on job fields
    const mockData = generateRealisticData(job.fields, run.recordsExtracted || 20);
    
    const filename = `export_${job.name.toLowerCase().replace(/\s+/g, '_')}_${run.id}.${formatType.toLowerCase()}`;
    
    if (formatType === OutputFormat.JSON) {
      downloadFile(JSON.stringify(mockData, null, 2), filename, 'application/json');
    } else {
      const csv = convertToCSV(mockData);
      downloadFile(csv, filename, 'text/csv');
    }

    setDownloadingId(null);
  };

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED:
        return <CheckCircle size={16} className="text-success-500" />;
      case JobStatus.FAILED:
        return <XCircle size={16} className="text-danger-500" />;
      case JobStatus.RUNNING:
        return <Clock size={16} className="text-brand-500 animate-pulse" />;
      default:
        return <Clock size={16} className="text-slate-400" />;
    }
  };

  if (runs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
        <p className="text-slate-500">No export history available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Records</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Format</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {runs.map((run) => {
              const job = jobs.find(j => j.id === run.jobId);
              const isDownloading = downloadingId === run.id;
              const canDownload = run.status === JobStatus.COMPLETED && run.recordsExtracted > 0;
              
              return (
                <tr key={run.id} className="hover:bg-slate-25 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900">{job?.name || 'Unknown Job'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(run.status)}
                      <span className="text-xs font-medium text-slate-600">{run.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700 font-medium">
                      {(run.recordsExtracted || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="neutral" size="sm" className="font-mono uppercase">
                      {job?.outputFormat || 'JSON'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-slate-500">
                      {format(new Date(run.startedAt), 'MMM dd, yyyy HH:mm')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant={canDownload ? 'secondary' : 'ghost'}
                      size="sm"
                      disabled={!canDownload || isDownloading}
                      isLoading={isDownloading}
                      leftIcon={<Download size={14} />}
                      onClick={() => handleDownload(run, job?.outputFormat || OutputFormat.JSON)}
                      className="text-xs h-8"
                    >
                      {isDownloading ? 'Downloading...' : 'Download'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
