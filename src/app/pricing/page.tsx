'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button, Badge, Card, Spinner } from '@/components/ui';
import { PLANS } from '@/lib/constants';
import { PlanTier, BillingPlan } from '@/lib/types';
import { Check, X, Shield, Zap, Globe, Cpu, ArrowRight, CheckCircle } from 'lucide-react';

export default function PricingPage() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [successPlan, setSuccessPlan] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setIsProcessing(planId);
    // Simulate Razorpay checkout
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(null);
    setSuccessPlan(planId);
  };

  interface PricingPlan extends BillingPlan {
    icon: React.ReactNode;
    color: string;
    cta: string;
    description: string;
    featured?: boolean;
  }

  const planTiers: PricingPlan[] = [
    {
      ...PLANS[PlanTier.STARTER],
      icon: <Globe className="text-slate-400" size={24} />,
      color: 'slate',
      cta: 'Start for Free',
      description: 'Perfect for individuals and small test projects.'
    },
    {
      ...PLANS[PlanTier.PROFESSIONAL],
      icon: <Zap className="text-brand-600" size={24} />,
      color: 'brand',
      cta: 'Go Professional',
      featured: true,
      description: 'Scaling startups and professional data teams.'
    },
    {
      ...PLANS[PlanTier.ENTERPRISE],
      icon: <Shield className="text-brand-700" size={24} />,
      color: 'brand-dark',
      cta: 'Contact Enterprise',
      description: 'High-volume data extraction for large corporations.'
    }
  ];

  if (successPlan) {
     return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
           <div className="w-20 h-20 bg-success-50 text-success-600 rounded-full flex items-center justify-center mb-6 border border-success-100 shadow-xl shadow-success-50">
              <CheckCircle size={40} />
           </div>
           <h1 className="text-3xl font-black text-slate-900">Payment Successful!</h1>
           <p className="text-slate-500 mt-4 text-center max-w-sm">
              Your account has been upgraded to the **{successPlan}** plan. We&apos;ve sent a receipt to your email.
           </p>
           <Link href="/dashboard" className="mt-8">
              <Button size="lg" className="px-10">Go to Dashboard</Button>
           </Link>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-brand-100 selection:text-brand-900">
      <Navbar />

      <main className="pt-32 pb-24">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" size="md" className="mb-6 font-bold uppercase tracking-widest">Pricing Plans</Badge>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            Scale your data <br />
            <span className="text-brand-600">without the limits.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed">
            Choose the perfect plan for your scraping needs. From hobbyists to global enterprises, we have you covered.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           {planTiers.map((plan) => (
             <Card 
               key={plan.id} 
               className={`relative p-8 flex flex-col border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${plan.featured ? 'border-brand-600 shadow-xl shadow-brand-50' : 'border-slate-100'}`}
             >
               {plan.featured && (
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                   Most Popular
                 </div>
               )}

               <div className="mb-8">
                  <div className="p-3 bg-slate-50 rounded-2xl inline-block mb-4 border border-slate-100">
                    {plan.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed min-h-[32px]">{plan.description}</p>
               </div>

               <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tighter">${plan.price}</span>
                    <span className="text-slate-400 font-medium lowercase">/{plan.interval === 'monthly' ? 'mo' : 'yr'}</span>
                  </div>
               </div>

               <Button 
                 variant={plan.featured ? 'primary' : 'secondary'} 
                 fullWidth 
                 className="mb-8 h-12 text-sm font-bold shadow-sm"
                 isLoading={isProcessing === plan.id}
                 onClick={() => handleCheckout(plan.id)}
               >
                 {plan.cta}
               </Button>

               <div className="space-y-4 flex-1">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-50 pb-2">What&apos;s included</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 bg-success-50 text-success-600 rounded-full p-0.5">
                         <Check size={12} />
                      </div>
                      <span className="text-sm text-slate-600 leading-tight">{feature}</span>
                    </div>
                  ))}
               </div>
             </Card>
           ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-slate-900">Compare Features</h2>
              <p className="text-slate-500 mt-4">Every detail you need to make the right choice.</p>
           </div>

           <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-50">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                       <th className="px-8 py-6 text-sm font-black text-slate-900 uppercase tracking-widest w-1/3">Feature</th>
                       <th className="px-6 py-6 text-sm font-black text-slate-900 uppercase tracking-widest text-center">Starter</th>
                       <th className="px-6 py-6 text-sm font-black text-brand-600 uppercase tracking-widest text-center">Pro</th>
                       <th className="px-6 py-6 text-sm font-black text-slate-900 uppercase tracking-widest text-center">Enterprise</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <ComparisonRow label="Concurrency" starter="1 Job" pro="10 Jobs" enterprise="Unlimited" />
                    <ComparisonRow label="Visual Selector" starter={<Check size={18} className="text-success-500 mx-auto" />} pro={<Check size={18} className="text-success-500 mx-auto" />} enterprise={<Check size={18} className="text-success-500 mx-auto" />} />
                    <ComparisonRow label="Proxy Rotation" starter="Community" pro="Premium Custom" enterprise="Dedicated IP" />
                    <ComparisonRow label="Scheduling" starter="Manual Only" pro="Advanced Cron" enterprise="Real-time Hook" />
                    <ComparisonRow label="API Access" starter={<X size={18} className="text-danger-400 mx-auto" />} pro={<Check size={18} className="text-success-500 mx-auto" />} enterprise={<Check size={18} className="text-success-500 mx-auto" />} />
                    <ComparisonRow label="Custom Headers" starter={<X size={18} className="text-danger-400 mx-auto" />} pro={<Check size={18} className="text-success-500 mx-auto" />} enterprise={<Check size={18} className="text-success-500 mx-auto" />} />
                    <ComparisonRow label="Retention" starter="7 Days" pro="30 Days" enterprise="90 Days" />
                 </tbody>
              </table>
           </div>
        </div>

        {/* Pricing FAQ Section for added polish */}
        <div className="max-w-3xl mx-auto px-4 mt-32 text-center">
            <h2 className="text-2xl font-black text-slate-900 mb-12">Frequent Questions</h2>
            <div className="space-y-8 text-left">
                <FAQItem 
                   q="Can I cancel anytime?" 
                   a="Yes, ScrapeFlow is a month-to-month service. You can cancel, upgrade, or downgrade your plan at any time through the Billing settings." 
                />
                <FAQItem 
                   q="Do unused credits roll over?" 
                   a="Professional and Enterprise plans include a credit rollover policy of up to 2 months. Starter plan limits reset every billing cycle." 
                />
                <FAQItem 
                   q="Is there a free trial?" 
                   a="Our Starter plan is free forever for small projects. If you need a Pro trial for high-volume testing, contact our support team." 
                />
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ComparisonRow({ label, starter, pro, enterprise }: { label: string, starter: any, pro: any, enterprise: any }) {
  return (
    <tr className="hover:bg-slate-25/50 transition-colors">
       <td className="px-8 py-5 text-sm font-semibold text-slate-700">{label}</td>
       <td className="px-6 py-5 text-sm text-slate-500 text-center">{starter}</td>
       <td className="px-6 py-5 text-sm text-brand-600 font-bold text-center">{pro}</td>
       <td className="px-6 py-5 text-sm text-slate-500 text-center">{enterprise}</td>
    </tr>
  );
}

function FAQItem({ q, a }: { q: string, a: string }) {
   return (
      <div className="p-6 bg-slate-25 rounded-2xl border border-slate-100">
         <h4 className="font-bold text-slate-900 mb-2">{q}</h4>
         <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
      </div>
   );
}
