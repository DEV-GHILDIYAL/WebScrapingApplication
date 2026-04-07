'use client';

import React from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Spinner, EmptyState, Button, Card } from '@/components/ui';
import ExportTable from '@/components/dashboard/ExportTable';
import { Download, RefreshCcw, LayoutPanelLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExportsPage() {
  const { jobs, runs, loading, error, refresh } = useJobs();

  if (loading && runs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
        <p className="mt-4 text-slate-500 animate-pulse font-medium">Loading execution history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center max-w-sm mx-auto">
        <div className="w-16 h-16 bg-danger-50 text-danger-600 rounded-full flex items-center justify-center mb-4 border border-danger-100 shadow-sm">
          <RefreshCcw size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to load exports</h2>
        <p className="text-slate-500 text-sm">{error}</p>
        <Button variant="secondary" className="mt-6 gap-2" onClick={refresh}>
          <RefreshCcw size={16} />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <LayoutPanelLeft className="text-brand-600" size={24} />
            Data Exports
          </h1>
          <p className="text-slate-500 text-sm mt-1">Download and manage your extracted data records.</p>
        </div>
        <Button variant="secondary" onClick={refresh} className="gap-2">
          <RefreshCcw size={16} />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      {runs.length > 0 ? (
        <div className="space-y-6">
          <ExportTable runs={runs} jobs={jobs} />
          <p className="text-xs text-slate-400 italic text-center">
            Note: Export history is maintained for 30 days on your current plan.
          </p>
        </div>
      ) : (
        <Card className="p-12 border-slate-200 border-dashed bg-slate-50/30">
          <EmptyState
            title="No data exports yet"
            description="Run your first scraping job to start generating data exports for download."
            actionLabel="View Jobs List"
            onAction={() => window.location.href = '/dashboard/jobs'}
          />
        </Card>
      )}

      {/* Export Quick Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card className="p-5 border-slate-200 bg-white">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-success-50 text-success-600 flex items-center justify-center flex-shrink-0">
              <Download size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Structured Formats</h3>
              <p className="text-sm text-slate-500 mt-1">
                Download your data in JSON or CSV. Our system automatically formats headers based on your field definitions.
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-5 border-slate-200 bg-white">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
              <RefreshCcw size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Real-time Updates</h3>
              <p className="text-sm text-slate-500 mt-1">
                Completed job runs appear here instantly. Use the refresh button to see the latest execution status.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
