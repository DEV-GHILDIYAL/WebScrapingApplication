'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Sidebar, { MobileNavbar } from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { PageSpinner } from '@/components/ui';
import { X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth protection guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [loading, isAuthenticated, router]);

  // Show loading state while checking authentication
  if (loading || (!isAuthenticated && !user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <PageSpinner message="Verifying session..." />
      </div>
    );
  }

  // Prevent flicker before redirect
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-[60] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-64 h-full bg-white animate-slide-in-left relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900"
            >
              <X size={20} />
            </button>
            {/* Reuse Sidebar component logic but without fixed positioning in drawer */}
            <div className="flex flex-col h-full pointer-events-auto">
               <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-64 has-[.w-20]:md:ml-20">
        {/* Mobile Nav */}
        <MobileNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        {/* Desktop Header */}
        <Header />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
