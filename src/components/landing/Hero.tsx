import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import DashboardPreview from './DashboardPreview';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background Decorative element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.05),rgba(255,255,255,0))]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold tracking-wider uppercase border border-brand-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
              </span>
              Now powered by Advanced Headless Workers
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Enterprise Web Scraping <br />
              <span className="text-brand-600">Without the Code.</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              ScrapeFlow empowers teams to configure, schedule, and manage high-volume
              data extraction through a visual interface. Built for performance, 
              reliability, and enterprise-grade scalability.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto px-8" rightIcon={<ArrowRight size={20} />}>
                  Start Building for Free
                </Button>
              </Link>
              <Link href="#" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8" leftIcon={<PlayCircle size={20} />}>
                  View Demo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 grayscale opacity-60">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">TRUSTED BY TEAMS AT</span>
              {/* Simple logo placeholders */}
              <div className="flex items-center gap-6">
                <div className="text-sm font-bold text-slate-800">DATAHUB</div>
                <div className="text-sm font-bold text-slate-800">NETWULF</div>
                <div className="text-sm font-bold text-slate-800">PRICELY</div>
              </div>
            </div>
          </div>

          {/* Graphical Mock */}
          <div className="hidden lg:block relative animate-slide-up">
            <div className="absolute inset-0 bg-brand-600/5 blur-3xl rounded-full" />
            <div className="relative border border-slate-200 shadow-2xl rounded-2xl bg-white p-2">
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
