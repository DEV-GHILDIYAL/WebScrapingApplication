import React from 'react';
import { Link2, Search, TableProperties, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Link2 size={32} />,
      title: 'Target your source',
      description: 'Paste any URL to begin. ScrapeFlow handles logins and single-page apps (SPAs) automatically.',
    },
    {
      icon: <Search size={32} />,
      title: 'Define your data',
      description: 'Use our visual editor to select the exact elements you need – titles, prices, images, and more.',
    },
    {
      icon: <TableProperties size={32} />,
      title: 'Collect & Export',
      description: 'Schedule your job and watch the data flow. Export to structured formats through the UI or API.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          {/* Lead content */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Go from URL to <br />
              <span className="text-brand-600 underline decoration-brand-200 underline-offset-8">Structured Data</span> <br />
              in minutes.
            </h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              Why build and maintain custom scraper infrastructure? ScrapeFlow 
              eliminates the engineering overhead, letting you focus on the insights.
            </p>
            <div className="flex items-center gap-3 text-brand-600 font-semibold cursor-pointer group">
              See the full documentation 
              <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Steps */}
          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative space-y-5 text-center sm:text-left">
                {idx < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[70%] w-full h-px border-t-2 border-dashed border-slate-100 -z-10" />
                )}
                <div className="w-16 h-16 bg-brand-600 text-white rounded-2xl flex items-center justify-center mx-auto sm:mx-0 shadow-lg shadow-brand-200">
                  {step.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900">{step.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
