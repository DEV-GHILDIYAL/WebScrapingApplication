'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Layers, 
  Activity, 
  Database, 
  CheckCircle2, 
  ArrowUpRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Badge, 
  StatsSkeleton,
  TableSkeleton,
  EmptyState 
} from '@/components/ui';
import { JobStatus } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

export default function DashboardPage() {
  const { jobs, runs, loading, error } = useJobs();

  // Compute Stats
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === JobStatus.RUNNING).length;
    const totalRecords = runs.reduce((sum, r) => sum + (r.recordsExtracted || 0), 0);
    
    const totalRuns = jobs.reduce((sum, j) => sum + j.runCount, 0);
    const totalSuccess = jobs.reduce((sum, j) => sum + j.successCount, 0);
    const successRate = totalRuns > 0 ? Math.round((totalSuccess / totalRuns) * 100) : 0;

    return {
      totalJobs,
      activeJobs,
      totalRecords,
      successRate
    };
  }, [jobs, runs]);

  if (loading && jobs.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
            <div className="space-y-2">
                <div className="h-8 w-48 bg-slate-100 rounded animate-pulse" />
                <div className="h-4 w-64 bg-slate-50 rounded animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-slate-100 rounded animate-pulse" />
        </div>
        <StatsSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <TableSkeleton rows={5} cols={3} />
            </div>
            <div className="space-y-6">
                <div className="h-48 bg-slate-50 rounded-xl animate-pulse" />
                <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-danger-50 text-danger-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Failed to load dashboard</h2>
        <p className="text-slate-500 max-w-md">{error}</p>
        <Button className="mt-6" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Welcome to ScrapeFlow</h2>
        <EmptyState 
          title="No scraping jobs yet"
          description="Get started by creating your first scraping job to extract data from any website."
          actionLabel="Create Your First Job"
          onAction={() => window.location.href = '/dashboard/jobs/new'}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time metrics across all your scraping rooms.</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button className="gap-2 shadow-sm">
            <Plus size={18} />
            Create New Job
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Jobs" 
          value={stats.totalJobs.toString()} 
          icon={<Layers className="text-brand-600" size={20} />} 
          description="Configured scrapers"
        />
        <StatCard 
          title="Active Jobs" 
          value={stats.activeJobs.toString()} 
          icon={<Activity className="text-warning-600" size={20} />} 
          description="Currently running"
          trend={stats.activeJobs > 0 ? "Real-time" : undefined}
          trendVariant="warning"
        />
        <StatCard 
          title="Records Extracted" 
          value={stats.totalRecords.toLocaleString()} 
          icon={<Database className="text-success-600" size={20} />} 
          description="Cumulative data rows"
        />
        <StatCard 
          title="Success Rate" 
          value={`${stats.successRate}%`} 
          icon={<CheckCircle2 className="text-brand-600" size={20} />} 
          description="Execution health"
          trend={stats.successRate >= 95 ? "Excellent" : stats.successRate >= 80 ? "Good" : "Needs Review"}
          trendVariant={stats.successRate >= 90 ? "success" : "warning"}
        />
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-4">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Link href="/dashboard/jobs" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
              View All Runs <ArrowUpRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {runs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {runs.slice(0, 5).map((run) => (
                  <ActivityItem key={run.id} run={run} jobs={jobs} />
                ))}
              </div>
            ) : (
                <div className="p-12 text-center text-slate-400 text-sm">
                  No activity recorded yet.
                </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links / Tips */}
        <div className="space-y-6">
          <Card className="border-brand-100 bg-brand-50/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Layers size={80} />
            </div>
            <CardHeader>
              <CardTitle className="text-brand-900 border-none">API Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-brand-800">
                Connect your data directly to your apps with our production-grade ScrapeFlow API.
              </p>
              <Button variant="secondary" size="sm" className="bg-white border-brand-200 text-brand-700 hover:bg-brand-50 transition-all">
                Read API Docs
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
                <CardTitle className="text-base">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">API Gateway</span>
                  <Badge variant="success" dot size="sm">Operational</Badge>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Proxy Engine</span>
                  <Badge variant="success" dot size="sm">Operational</Badge>
               </div>
               <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Worker Fleet</span>
                  <Badge variant="success" dot size="sm">98% Capable</Badge>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description, trend, trendVariant }: { 
  title: string, value: string, icon: React.ReactNode, description: string, trend?: string, trendVariant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' 
}) {
  return (
    <Card className="border-slate-200 hover:border-brand-200 transition-colors shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            {icon}
          </div>
          {trend && (
            <Badge variant={trendVariant} size="sm" className="font-bold">
              {trend}
            </Badge>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ run, jobs }: { run: any, jobs: any[] }) {
  const job = jobs.find(j => j.id === run.jobId);
  const statusLabels: Record<string, any> = {
    [JobStatus.COMPLETED]: { variant: 'success', label: 'Success' },
    [JobStatus.FAILED]: { variant: 'danger', label: 'Failed' },
    [JobStatus.RUNNING]: { variant: 'warning', label: 'In Progress' },
    [JobStatus.QUEUED]: { variant: 'neutral', label: 'Queued' },
  };

  const status = statusLabels[run.status] || { variant: 'neutral', label: run.status };

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${run.status === JobStatus.FAILED ? 'bg-danger-50 text-danger-600' : 'bg-brand-50 text-brand-600'}`}>
          <Clock size={16} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">
              {job?.name || 'Unknown Job'}
            </span>
            <Badge variant={status.variant} size="sm">{status.label}</Badge>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
             <span className="text-xs text-slate-400">
                {run.completedAt ? formatDistanceToNow(new Date(run.completedAt), { addSuffix: true }) : 'Pending'}
             </span>
             {run.recordsExtracted > 0 && (
                <>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-xs text-slate-500 font-medium">{run.recordsExtracted} records</span>
                </>
             )}
          </div>
        </div>
      </div>
      <Link href={`/dashboard/jobs/${run.jobId}`}>
        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-slate-900">
          Details
        </Button>
      </Link>
    </div>
  );
}
