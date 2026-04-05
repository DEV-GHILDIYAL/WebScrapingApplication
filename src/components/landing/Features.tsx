import React from 'react';
import { Card } from '@/components/ui';
import { MousePointer2, Calendar, ShieldCheck, Download, BarChart3, Database } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <MousePointer2 className="text-brand-600" size={24} />,
      title: 'Visual Data Mapping',
      description: 'Point and click to define fields directly on any website. No CSS selectors or XPath knowledge required.',
    },
    {
      icon: <Calendar className="text-brand-600" size={24} />,
      title: 'Automated Scheduling',
      description: 'Set your jobs to run on an interval or custom cron schedule. Continuous data collection, 24/7.',
    },
    {
      icon: <ShieldCheck className="text-brand-600" size={24} />,
      title: 'Smart Proxy Rotation',
      description: 'Built-in residential and datacenter proxy rotation to ensure your scrapers remain undetected and reliable.',
    },
    {
      icon: <Download className="text-brand-600" size={24} />,
      title: 'Structured Export',
      description: 'Download your data in clean CSV or JSON formats. Direct integration with cloud storage coming soon.',
    },
    {
      icon: <Database className="text-brand-600" size={24} />,
      title: 'Enterprise Data Stores',
      description: 'Securely store millions of records in our managed database, optimized for high-volume extraction.',
    },
    {
      icon: <BarChart3 className="text-brand-600" size={24} />,
      title: 'Detailed Monitoring',
      description: 'Track success rates, execution logs, and network performance through a centralized command center.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-bold text-brand-600 tracking-widest uppercase">Platform Capabilities</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for Scale, Designed for Simplicity.
          </h3>
          <p className="text-lg text-slate-600 leading-relaxed">
            ScrapeFlow combines the power of custom scraping engines with the ease of 
            a visual dashboard. Take full control of your data pipeline.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Card 
              key={idx} 
              padding="lg" 
              className="bg-white hover:border-brand-200 hover:shadow-elevated transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-50 transition-colors">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
