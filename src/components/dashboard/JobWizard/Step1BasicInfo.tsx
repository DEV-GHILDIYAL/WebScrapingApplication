'use client';

import React from 'react';
import { Input } from '@/components/ui';
import { Globe, Type } from 'lucide-react';

interface Step1Props {
  data: {
    name: string;
    targetUrl: string;
  };
  updateData: (updates: Partial<Step1Props['data']>) => void;
}

export default function Step1BasicInfo({ data, updateData }: Step1Props) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Basic Information</h2>
        <p className="text-sm text-slate-500">Give your job a name and tell us which website you want to scrape.</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Job Name"
          placeholder="e.g. Amazon Electronics Price Watch"
          value={data.name}
          onChange={(e) => updateData({ name: e.target.value })}
          leftIcon={<Type size={18} className="text-slate-400" />}
          helperText="A descriptive name to identify this job in your dashboard."
          autoFocus
        />

        <Input
          label="Target URL"
          placeholder="https://www.example.com/products"
          value={data.targetUrl}
          onChange={(e) => updateData({ targetUrl: e.target.value })}
          leftIcon={<Globe size={18} className="text-slate-400" />}
          helperText="The exact URL you want to extract data from."
        />
      </div>

      <div className="bg-brand-50 border border-brand-100 rounded-lg p-4">
        <p className="text-xs text-brand-700 leading-relaxed">
          <span className="font-bold">Pro Tip:</span> Ensure the URL is publicly accessible. For sites behind a login, you&apos;ll need to configure custom headers in the Advanced Settings later.
        </p>
      </div>
    </div>
  );
}
