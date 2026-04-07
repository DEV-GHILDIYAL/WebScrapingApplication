'use client';

import React from 'react';
import { Select, Toggle } from '@/components/ui';
import { OutputFormat, ProxyConfig, ScheduleConfig } from '@/lib/types';
import { Shield, Clock, FileJson, Info } from 'lucide-react';

interface Step3Props {
  proxyConfig: ProxyConfig;
  scheduleConfig: ScheduleConfig;
  outputFormat: OutputFormat;
  updateProxy: (updates: Partial<ProxyConfig>) => void;
  updateSchedule: (updates: Partial<ScheduleConfig>) => void;
  updateFormat: (format: OutputFormat) => void;
}

export default function Step3Configuration({
  proxyConfig,
  scheduleConfig,
  outputFormat,
  updateProxy,
  updateSchedule,
  updateFormat,
}: Step3Props) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Configuration</h2>
        <p className="text-sm text-slate-500">Fine-tune how and when your data is extracted.</p>
      </div>

      {/* Proxy Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Shield size={18} className="text-brand-600" />
          <h3>Proxy & Anti-Bot</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <Select
            label="Proxy Provider"
            options={[
              { value: 'default', label: 'ScrapeFlow Default (Shared)' },
              { value: 'prx_912384', label: 'BrightData Premium (Residential)' },
              { value: 'prx_776152', label: 'Oxylabs DC Static' },
            ]}
            value={proxyConfig.providerId}
            onChange={(e) => updateProxy({ providerId: e.target.value })}
          />
          <div className="flex flex-col justify-center">
            <Toggle
              label="Automatic Rotation"
              enabled={proxyConfig.rotationEnabled}
              onChange={(enabled) => updateProxy({ rotationEnabled: enabled })}
              description="Rotate IP addresses for every request to avoid WAF blocks."
            />
          </div>
        </div>
      </div>

      {/* Schedule Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <Clock size={18} className="text-brand-600" />
          <h3>Schedule</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
          <Select
            label="Frequency"
            options={[
              { value: 'manual', label: 'Manual (On Demand)' },
              { value: 'interval', label: 'Interval (Every X minutes)' },
              { value: 'cron', label: 'Cron Expression (Custom)' },
            ]}
            value={scheduleConfig.type}
            onChange={(e) => updateSchedule({ type: e.target.value as any })}
          />
          
          {scheduleConfig.type === 'interval' && (
            <Select
              label="Interval"
              options={[
                { value: '30', label: 'Every 30 minutes' },
                { value: '60', label: 'Every hour' },
                { value: '240', label: 'Every 4 hours' },
                { value: '1440', label: 'Daily' },
              ]}
              value={scheduleConfig.intervalMinutes?.toString() || '60'}
              onChange={(e) => updateSchedule({ intervalMinutes: parseInt(e.target.value) })}
            />
          )}

          {scheduleConfig.type === 'cron' && (
            <div className="space-y-1.5 text-sm">
              <label className="block font-medium text-slate-700">Cron Expression</label>
              <input
                type="text"
                className="block w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                placeholder="0 0 * * *"
                value={scheduleConfig.cronExpression || ''}
                onChange={(e) => updateSchedule({ cronExpression: e.target.value })}
              />
              <p className="text-[10px] text-slate-400 font-mono italic">Format: minute hour day month day-of-week</p>
            </div>
          )}
        </div>
      </div>

      {/* Output Settings */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold">
          <FileJson size={18} className="text-brand-600" />
          <h3>Output Format</h3>
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => updateFormat(OutputFormat.JSON)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
              outputFormat === OutputFormat.JSON
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className={`block font-bold mb-1 ${outputFormat === OutputFormat.JSON ? 'text-brand-700' : 'text-slate-900'}`}>JSON</span>
            <span className="text-xs text-slate-500">Ideal for developers and system integrations.</span>
          </button>
          <button
            type="button"
            onClick={() => updateFormat(OutputFormat.CSV)}
            className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${
              outputFormat === OutputFormat.CSV
                ? 'border-brand-600 bg-brand-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span className={`block font-bold mb-1 ${outputFormat === OutputFormat.CSV ? 'text-brand-700' : 'text-slate-900'}`}>CSV</span>
            <span className="text-xs text-slate-500">Best for Excel, Sheets, and manual analysis.</span>
          </button>
        </div>
      </div>

      <div className="flex gap-3 p-4 bg-slate-50 rounded-lg text-slate-600 text-xs leading-relaxed">
        <Info size={16} className="text-slate-400 flex-shrink-0" />
        <p>
          Need a custom solution or 100M+ pages/month? Contact our sales team for an <span className="font-bold text-brand-600 cursor-pointer hover:underline">Enterprise API key</span> with unlimited scaling.
        </p>
      </div>
    </div>
  );
}
