'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, Button, Badge, Spinner, Modal } from '@/components/ui';
import { billingService } from '@/services/billing';
import { BillingInfo, PlanTier } from '@/lib/types';
import { PLANS } from '@/lib/constants';
import { CreditCard, CheckCircle, Zap, Shield, Globe, Clock, Check } from 'lucide-react';

export default function BillingTab() {
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeStep, setUpgradeStep] = useState<'SELECT' | 'PAYING' | 'SUCCESS'>('SELECT');

  useEffect(() => {
    async function loadBilling() {
      const resp = await billingService.getBillingInfo();
      if (resp.success && resp.data) {
        setBillingInfo(resp.data);
      }
      setLoading(false);
    }
    loadBilling();
  }, []);

  const handleUpgrade = async (planId: string) => {
    setUpgradeStep('PAYING');
    // Simulate Razorpay flow
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUpgradeStep('SUCCESS');
    
    // Simulate updating current plan in the mock
    if (billingInfo) {
      setBillingInfo({
        ...billingInfo,
        currentPlan: PLANS[planId as PlanTier]
      });
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <Spinner size="lg" label="Retrieving billing data..." />
      </div>
    );
  }

  const currentPlan = billingInfo?.currentPlan || PLANS[PlanTier.STARTER];
  const usage = billingInfo?.usage || { jobsUsed: 0, recordsExtracted: 0, apiCallsMade: 0 };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Current Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-8 border-slate-200 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-100">
                <Zap size={28} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                   <h2 className="text-2xl font-bold text-slate-900">{currentPlan.name} Plan</h2>
                   <Badge variant="success" size="sm">Active</Badge>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                   Your current billing cycle ends on {new Date(billingInfo?.billingCycle.end || '').toLocaleDateString()}.
                </p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => setShowUpgradeModal(true)}>
              Change Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-100">
            <UsageMetric 
              label="Active Jobs" 
              used={usage.jobsUsed} 
              limit={currentPlan.limits.maxJobs} 
            />
             <UsageMetric 
              label="Records/Job" 
              used={usage.recordsExtracted} 
              limit={currentPlan.limits.maxRecordsPerJob} 
            />
            <UsageMetric 
              label="Proxy Connections" 
              used={1} 
              limit={currentPlan.limits.proxyProviders} 
            />
          </div>
        </Card>

        <Card className="p-8 border-brand-100 bg-brand-50/20 text-brand-900 flex flex-col justify-between">
           <div>
              <CardHeader className="p-0 mb-4 bg-transparent border-none">
                 <CardTitle className="text-sm uppercase tracking-wider font-bold text-brand-700">Billing Support</CardTitle>
              </CardHeader>
              <p className="text-sm text-brand-800 leading-relaxed mb-6">
                Need customized limits or a dedicated enterprise account? Our sales team can build a tailor-made plan for your scraping needs.
              </p>
           </div>
           <Button className="w-full bg-brand-700 hover:bg-brand-800 border-none shadow-sm shadow-brand-200">
              Contact Enterprise Sales
           </Button>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card className="p-8 border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <CreditCard size={20} className="text-slate-400" />
          Payment Methods
        </h3>
        <div className="border border-slate-200 rounded-xl p-6 flex items-center justify-between bg-slate-50">
           <div className="flex items-center gap-4">
              <div className="w-10 h-6 bg-slate-200 rounded animate-pulse" />
              <div>
                 <p className="text-sm font-semibold text-slate-900">Visa ending in **** 4242</p>
                 <p className="text-xs text-slate-400">Expires 12/2028</p>
              </div>
           </div>
           <Badge variant="neutral">Default</Badge>
        </div>
      </Card>

      {/* Upgrade Modal */}
      <Modal 
        isOpen={showUpgradeModal} 
        onClose={() => {
          setShowUpgradeModal(false);
          setUpgradeStep('SELECT');
        }}
        title="Upgrade Your Plan"
        size="lg"
      >
        <div className="py-4">
          {upgradeStep === 'SELECT' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {Object.values(PLANS).filter(p => p.id !== PlanTier.STARTER).map((plan) => (
                   <button
                     key={plan.id}
                     onClick={() => handleUpgrade(plan.id)}
                     className={`p-6 border-2 rounded-2xl text-left transition-all ${currentPlan.id === plan.id ? 'border-brand-600 bg-brand-50/50' : 'border-slate-100 hover:border-brand-200'}`}
                   >
                     <p className="text-xs font-bold text-brand-600 uppercase tracking-widest mb-2">{plan.name}</p>
                     <h4 className="text-2xl font-black text-slate-900">${plan.price}<span className="text-sm font-normal text-slate-400">/mo</span></h4>
                     <ul className="mt-6 space-y-3">
                        {plan.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-xs text-slate-600 flex items-center gap-2">
                             <Check size={14} className="text-success-500" />
                             {f}
                          </li>
                        ))}
                     </ul>
                   </button>
                 ))}
              </div>
            </div>
          )}

          {upgradeStep === 'PAYING' && (
             <div className="py-12 flex flex-col items-center justify-center text-center">
                <Spinner size="lg" />
                <h3 className="text-xl font-bold text-slate-900 mt-6">Processing Payment</h3>
                <p className="text-slate-500 mt-2">Integrating with Razorpay Secure Engine...</p>
             </div>
          )}

          {upgradeStep === 'SUCCESS' && (
             <div className="py-12 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="w-20 h-20 bg-success-50 text-success-600 rounded-full flex items-center justify-center mb-6 border border-success-100 shadow-sm shadow-success-100">
                   <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Plan Upgraded!</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">Welcome to the {currentPlan.name} tier. Your new limits have been applied successfully.</p>
                <Button className="mt-8 px-10" onClick={() => setShowUpgradeModal(false)}>Continue to Dashboard</Button>
             </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

function UsageMetric({ label, used, limit }: { label: string, used: number, limit: number }) {
  const percentage = limit === -1 ? 0 : Math.min((used / limit) * 100, 100);
  const labelColor = percentage > 90 ? 'text-danger-600' : 'text-slate-700';

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-500 font-medium uppercase tracking-wider">{label}</span>
        <span className={`font-bold ${labelColor}`}>
          {used} / {limit === -1 ? '∞' : limit}
        </span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${percentage > 90 ? 'bg-danger-500' : 'bg-brand-500'}`}
          style={{ width: `${limit === -1 ? 0 : percentage}%` }}
        />
      </div>
    </div>
  );
}
