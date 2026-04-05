'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Map route to title
  const getPageTitle = (path: string) => {
    if (path === '/dashboard') return 'Overview';
    if (path.startsWith('/dashboard/jobs')) return 'Jobs';
    if (path.startsWith('/dashboard/exports')) return 'Exports';
    if (path.startsWith('/dashboard/settings')) return 'Settings';
    return 'Dashboard';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-slate-900 md:text-xl">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 font-sans">
        {/* Search Bar - Mock UI */}
        <div className="hidden lg:flex items-center relative group">
          <Search size={18} className="absolute left-3 text-slate-400 group-focus-within:text-brand-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search jobs..." 
            className="h-9 w-64 rounded-lg bg-slate-50 border border-slate-200 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Notifications - Mock UI */}
        <button className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shadow-sm overflow-hidden uppercase">
             {user?.name?.charAt(0) || <User size={16} />}
          </div>
          <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
            <span className="text-sm font-medium text-slate-900 group-hover:text-brand-600 transition-colors truncate max-w-[100px]">
              {user?.name?.split(' ')[0] || 'Member'}
            </span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
