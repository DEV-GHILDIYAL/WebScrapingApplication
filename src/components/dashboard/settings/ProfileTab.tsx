'use client';

import React, { useState } from 'react';
import { Card, Button, Input, useToast } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Save, CheckCircle } from 'lucide-react';

export default function ProfileTab() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setIsSaving(false);
    toastSuccess('Profile Updated', 'Your personal information has been saved.');
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <Card className="p-8 border-slate-200">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 font-bold text-2xl shadow-sm">
            {name.charAt(0) || user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            <p className="text-sm text-slate-500">Update your profile and contact details.</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              placeholder="Alex Rivers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<User size={18} className="text-slate-400" />}
            />
            <Input
              label="Email Address"
              placeholder="alex@example.com"
              value={email}
              disabled
              leftIcon={<Mail size={18} className="text-slate-400" />}
              helperText="Email cannot be changed on the Starter plan."
            />
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Button 
              type="submit" 
              isLoading={isSaving}
              leftIcon={<Save size={18} />}
              className="px-8 shadow-sm"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-8 border-danger-100 bg-danger-50/10">
        <h3 className="text-lg font-bold text-danger-700">Danger Zone</h3>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Permanently delete your account and all associated scraping data. This action cannot be undone.
        </p>
        <Button variant="secondary" size="sm" className="text-danger-600 hover:text-danger-700 hover:bg-danger-50 border-danger-100">
          Delete Account
        </Button>
      </Card>
    </div>
  );
}
