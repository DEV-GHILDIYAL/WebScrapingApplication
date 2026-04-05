'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, Spinner } from '@/components/ui';

export default function SignOutPage() {
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const performSignOut = async () => {
      // Small artificial delay for UX to show the state
      timer = setTimeout(async () => {
        await signOut();
        router.push('/');
      }, 1000);
    };

    performSignOut();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [signOut, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <Card padding="lg" className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <Spinner size="lg" className="text-brand-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900">Signing you out</h1>
          <p className="text-sm text-slate-500">
            Please wait while we securely end your session. You will be redirected shortly.
          </p>
        </div>
      </Card>

      <div className="mt-8">
        <span className="text-sm font-semibold text-slate-400 tracking-widest uppercase">
          ScrapeFlow Enterprise
        </span>
      </div>
    </div>
  );
}
