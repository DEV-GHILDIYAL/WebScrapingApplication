import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Gradient */}
      <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.03),rgba(255,255,255,0))]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 rounded-full text-xs font-bold ring-1 ring-brand-100">
          <Sparkles size={14} />
          <span>JOIN 1,200+ DATA TEAMS</span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
          Start scraping in minutes, <br />
          not days.
        </h2>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Unlock the data behind any website today. Get started for free 
          and see why hundreds of companies choose ScrapeFlow for their 
          data extraction pipelines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/auth/signup" className="w-full sm:w-auto">
            <Button size="lg" className="px-10 py-6 text-lg w-full sm:w-auto" rightIcon={<ArrowRight size={20} />}>
              Create your free account
            </Button>
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="px-10 py-6 text-lg w-full sm:w-auto">
              Browse Plans
            </Button>
          </Link>
        </div>

        <p className="text-sm text-slate-400 font-medium pt-2">
          No credit card required. Free 1,000 requests included.
        </p>
      </div>
    </section>
  );
}
