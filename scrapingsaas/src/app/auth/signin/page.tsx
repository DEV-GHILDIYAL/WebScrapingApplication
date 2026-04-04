"use client";

import React, { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import NeonButton from '@/components/NeonButton';
import AnimatedInput from '@/components/AnimatedInput';
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleEmailSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    signIn("resend", { email, callbackUrl: "/dashboard" });
  };

  return (
    <div className="signin-container">
      <GlassCard glow className="signin-card">
        <div className="signin-header">
          <h1 className="signin-title">Welcome Back</h1>
          <p className="signin-subtitle">Log in to manage your scraping rooms</p>
        </div>

        <div className="signin-methods">
          <NeonButton 
            label="Continue with Google" 
            variant="outline" 
            onClick={handleGoogleSignIn}
            className="w-full"
            disabled={isLoading}
          />
          
          <div className="divider">
            <span>or magic link</span>
          </div>

          <form onSubmit={handleEmailSignIn}>
            <AnimatedInput 
              label="Email Address" 
              type="email" 
              placeholder="name@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <NeonButton 
              label="Send Magic Link" 
              variant="primary" 
              className="w-full" 
              type="submit"
              disabled={isLoading || !email}
            />
          </form>
        </div>

        <p className="signin-footer">
          By continuing, you agree to our Terms of Service.
        </p>
      </GlassCard>
    </div>
  );
}
