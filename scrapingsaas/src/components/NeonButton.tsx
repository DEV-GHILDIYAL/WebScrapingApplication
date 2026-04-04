"use client";

import React from 'react';

interface NeonButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const NeonButton: React.FC<NeonButtonProps> = ({ 
  label, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false
}) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`neon-button variant-${variant} ${className}`}
    >
      {label}
    </button>
  );
};

export default NeonButton;
