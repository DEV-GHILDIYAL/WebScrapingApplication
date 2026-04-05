import React from 'react';
import { Card, CardHeader, CardTitle, Badge } from '@/components/ui';
import { Zap, Activity, Database, CheckCircle2, Clock } from 'lucide-react';

export default function DashboardPreview() {
  const stats = [
    { label: 'Jobs Running', value: '12', icon: <Activity size={18} />, color: 'text-brand-600' },
    { label: 'Total Records', value: '1.2M', icon: <Database size={18} />, color: 'text-success-600' },
    { label: 'Success Rate', value: '99.4%', icon: <Zap size={18} />, color: 'text-amber-600' },
  ];

  const jobs = [
    { name: 'Amazon Product Data', status: 'RUNNING', extracted: 14502, time: '2m ago' },
    { name: 'eBay Price Monitor', status: 'COMPLETED', extracted: 4521, time: '15m ago' },
    { name: 'Crypto Exchange Feed', status: 'QUEUED', extracted: 0, time: 'Just now' },
  ];

  return (
    <div className="relative animate-fade-in">
      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="sm" className="bg-slate-50/50 border-slate-100">
            <div className={`mb-1 ${stat.color}`}>{stat.icon}</div>
            <div className="text-xl font-bold text-slate-900">{stat.value}</div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Job List Card */}
      <Card padding="none" className="overflow-hidden shadow-elevated">
        <div className="bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            Recent Activity
          </h4>
          <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100">
            REALTIME
          </span>
        </div>
        
        <div className="divide-y divide-slate-50">
          {jobs.map((job) => (
            <div key={job.name} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  job.status === 'RUNNING' ? 'bg-brand-50 text-brand-600' :
                  job.status === 'COMPLETED' ? 'bg-success-50 text-success-600' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {job.status === 'RUNNING' ? <Activity size={16} /> : 
                   job.status === 'COMPLETED' ? <CheckCircle2 size={16} /> : 
                   <Clock size={16} />}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{job.name}</div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    {job.extracted.toLocaleString()} records • {job.time}
                  </div>
                </div>
              </div>
              <Badge 
                variant={
                  job.status === 'RUNNING' ? 'info' : 
                  job.status === 'COMPLETED' ? 'success' : 
                  'neutral'
                }
                size="sm"
                dot={job.status === 'RUNNING'}
              >
                {job.status.toLowerCase()}
              </Badge>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 px-5 py-3 text-center">
          <span className="text-[10px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
            VIEW ALL ACTIVE JOBS
          </span>
        </div>
      </Card>

      {/* Floating Badge (Decorative) */}
      <div className="absolute -bottom-4 -left-4 hidden lg:block animate-pulse-subtle">
        <Badge variant="success" size="md" className="shadow-lg border-2 border-white scale-110">
          Scraping 2.4k requests/sec
        </Badge>
      </div>
    </div>
  );
}
