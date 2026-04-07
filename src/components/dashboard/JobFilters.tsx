'use client';

import React from 'react';
import { Input, Select } from '@/components/ui';
import { Search, Filter } from 'lucide-react';
import { JobStatus } from '@/lib/types';

interface JobFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

const statusOptions = [
  { value: 'ALL', label: 'All Statuses' },
  { value: JobStatus.QUEUED, label: 'Queued' },
  { value: JobStatus.RUNNING, label: 'Running' },
  { value: JobStatus.COMPLETED, label: 'Completed' },
  { value: JobStatus.FAILED, label: 'Failed' },
];

export default function JobFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: JobFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search by job name or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={18} className="text-slate-400" />}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-64">
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="Filter by status"
          className="w-full"
        />
      </div>
    </div>
  );
}
