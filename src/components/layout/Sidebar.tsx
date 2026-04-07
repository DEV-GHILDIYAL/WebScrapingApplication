'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Layers, 
  Download, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Menu
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', href: '/dashboard/jobs', icon: Layers },
  { name: 'Exports', href: '/dashboard/exports', icon: Download },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-50 flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${className || 'max-md:hidden'}
      `}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 flex-shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-slate-900 tracking-tight animate-fade-in">
              Scrape<span className="text-brand-600">Flow</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                ${isActive 
                  ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                ${isCollapsed ? 'justify-center' : ''}
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'} />
              {!isCollapsed && (
                <span className="text-sm truncate animate-fade-in">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-100 space-y-4">
        {/* User Profile */}
        {!isCollapsed ? (
          <div className="px-2 py-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
             <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-semibold shadow-sm cursor-help" title={user?.name}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            fullWidth 
            onClick={() => signOut()}
            className={`!justify-start gap-3 h-10 ${isCollapsed ? 'px-0 justify-center' : 'px-4'}`}
          >
            <LogOut size={18} className="text-slate-400" />
            {!isCollapsed && <span className="animate-fade-in">Sign Out</span>}
          </Button>

          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center h-10 w-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-dashed border-slate-200"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <div className="flex items-center gap-2 text-xs font-medium"><ChevronLeft size={18} /> Collapse</div>}
          </button>
        </div>
      </div>
    </aside>
  );
}

// Mobile Navbar for responsiveness
export function MobileNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden sticky top-0 bg-white border-b border-slate-200 z-40 h-16 flex items-center px-4 justify-between">
      <Link href="/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">
          Scrape<span className="text-brand-600">Flow</span>
        </span>
      </Link>
      <button 
        onClick={onMenuClick}
        className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>
    </header>
  );
}
