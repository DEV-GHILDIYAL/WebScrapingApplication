'use client';

import React, { useState } from 'react';
import { Card, Tabs } from '@/components/ui';
import ProfileTab from '@/components/dashboard/settings/ProfileTab';
import BillingTab from '@/components/dashboard/settings/BillingTab';
import ProxySection from '@/components/dashboard/settings/ProxySection';
import ApiKeySection from '@/components/dashboard/settings/ApiKeySection';
import { User, CreditCard, ShieldCheck, Key, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
    { id: 'proxy', label: 'Proxy Providers', icon: <ShieldCheck size={18} /> },
    { id: 'api', label: 'API Keys', icon: <Key size={18} /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="text-brand-600" size={24} />
          Workspace Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account, billing, and developer configuration.</p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col space-y-6">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          variant="underline"
          className="bg-transparent"
        />

        <div className="pt-2">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'billing' && <BillingTab />}
          {activeTab === 'proxy' && <ProxySection />}
          {activeTab === 'api' && <ApiKeySection />}
        </div>
      </div>
    </div>
  );
}
