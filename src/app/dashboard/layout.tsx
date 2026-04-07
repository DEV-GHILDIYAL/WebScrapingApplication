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
  const { isAuthenticated, loading, user, error, refresh } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth protection guard
  useEffect(() => {
    // Only redirect if NOT loading AND NOT authenticated AND no error is present
    // (If error is present, we show the retry UI instead of redirecting)
    if (!loading && !isAuthenticated && !error) {
      router.push('/auth/signin');
    }
  }, [loading, isAuthenticated, error, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <PageSpinner message="Verifying session..." />
      </div>
    );
  }

  // Show error state with retry if session check failed
  if (error && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-modal border border-danger-100 text-center animate-fade-in">
          <div className="w-16 h-16 bg-danger-50 text-danger-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Connection Interrupted</h2>
          <p className="text-slate-500 mt-2 mb-8">
            {error}. This may be a temporary network issue.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={refresh}
              className="w-full bg-brand-600 text-white font-bold h-11 rounded-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try to Reconnect
            </button>
            <button 
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-white text-slate-600 font-semibold h-11 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Return to Sign In
            </button>
          </div>
        </div>
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
            {/* Mobile Drawer Sidebar - Ensure it's visible by overriding max-md:hidden */}
            <div className="flex flex-col h-full pointer-events-auto">
               <Sidebar className="relative border-none !w-full" />
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
