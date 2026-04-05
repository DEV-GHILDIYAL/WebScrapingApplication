import React from 'react';
import { Card } from '@/components/ui';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "ScrapeFlow turned our manually-intensive pricing analysis into a fully automated stream. We reduced our data collection costs by 70% within the first month.",
      name: "Marcus Chen",
      role: "Lead Architect",
      company: "DataStack Solutions",
      avatar: "https://i.pravatar.cc/100?u=marcus",
    },
    {
      quote: "The no-code selector is a game-changer. Our marketing team now manages their own competitor monitoring without touching a single line of code.",
      name: "Sarah Jenkins",
      role: "Growth Manager",
      company: "GloShop E-commerce",
      avatar: "https://i.pravatar.cc/100?u=sarah",
    },
    {
      quote: "Reliability is key for us. ScrapeFlow's intelligent proxy rotation and automatic retry logic means we get our data even on the most difficult sites.",
      name: "David Miller",
      role: "Operations Director",
      company: "MarketWulf Analytics",
      avatar: "https://i.pravatar.cc/100?u=david",
    },
  ];

  return (
    <section className="py-24 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-sm font-bold text-brand-600 tracking-widest uppercase">Trusted for reliability</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by Data-Driven Teams.
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <Card 
              key={idx} 
              padding="lg" 
              className="bg-white flex flex-col justify-between border-slate-100 shadow-soft animate-fade-in"
            >
              <div className="space-y-6">
                <div className="text-brand-200">
                  <Quote size={40} fill="currentColor" />
                </div>
                <p className="text-slate-600 leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>
              
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-slate-50">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full border-2 border-slate-100" 
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{t.name}</div>
                  <div className="text-xs text-slate-500 truncate">{t.role}, {t.company}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
