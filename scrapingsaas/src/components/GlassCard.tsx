"use client";

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', glow = false }) => {
  return (
    <div className={`glass glass-card ${glow ? 'glow-primary' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
