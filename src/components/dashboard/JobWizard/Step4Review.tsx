'use client';

import React from 'react';
import { Card, Badge } from '@/components/ui';
import { Job, OutputFormat } from '@/lib/types';
import { Info, Globe, Shield, Calendar, Layers, Terminal } from 'lucide-react';

interface Step4Props {
  data: Partial<Job>;
}

export default function Step4Review({ data }: Step4Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Review & Create</h2>
        <p className="text-sm text-slate-500">Double-check your configuration before launching the job.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Info Summary */}
        <Card className="p-4 bg-slate-50">
          <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold">
            <Globe size={16} className="text-brand-600" />
            <h3 className="text-sm">Source</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Job Name</span>
              <span className="font-semibold text-slate-900">{data.name}</span>
            </div>
            <div className="flex flex-col text-xs pt-1">
              <span className="text-slate-500 mb-1">Target URL</span>
              <span className="font-mono text-[10px] break-all bg-white p-2 rounded border border-slate-200">
                {data.targetUrl}
              </span>
            </div>
          </div>
        </Card>

        {/* Configuration Summary */}
        <Card className="p-4 bg-slate-50">
          <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold">
            <Shield size={16} className="text-brand-600" />
            <h3 className="text-sm">Engine</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Proxy Mode</span>
              <span className="font-semibold text-slate-900">
                {data.proxyConfig?.rotationEnabled ? 'Automatic Rotation' : 'Single IP'}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Schedule</span>
              <span className="font-semibold text-slate-900 uppercase">
                {data.scheduleConfig?.type}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Export Format</span>
              <Badge variant="neutral">{data.outputFormat}</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Field Extraction Summary */}
      <Card className="p-4 border-slate-200">
        <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
          <Layers size={16} className="text-brand-600" />
          <h3 className="text-sm">Extraction Fields ({data.fields?.length || 0})</h3>
        </div>
        <div className="space-y-3">
          {data.fields?.map((field) => (
            <div key={field.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded shadow-sm">
                  <Terminal size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{field.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono italic">{field.selector}</p>
                </div>
              </div>
              <Badge variant="neutral" className="text-[10px]">
                {field.type} {field.multiple ? '(List)' : ''}
              </Badge>
            </div>
          ))}
          {!data.fields?.length && (
            <p className="text-xs text-slate-500 italic text-center py-4">No fields defined. Only raw HTML will be stored.</p>
          )}
        </div>
      </Card>

      <div className="bg-success-50 border border-success-100 rounded-xl p-5 flex gap-4">
        <div className="bg-success-500 text-white p-2 rounded-full h-fit flex-shrink-0">
          <Info size={16} />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-success-900">Ready to go!</h4>
          <p className="text-xs text-success-800 leading-relaxed">
            Upon creation, the job will be queued for its first run based on your schedule. You can monitor the progress and download the results from the Jobs dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
