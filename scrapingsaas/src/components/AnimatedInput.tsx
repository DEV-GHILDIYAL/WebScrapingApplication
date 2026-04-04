"use client";

import React, { useState } from 'react';

interface AnimatedInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`animated-input-container ${className}`}>
      <label className={`animated-label ${isFocused || value ? 'floating' : ''}`}>
        {label}
      </label>
      <input
        type={type}
        placeholder={isFocused ? placeholder : ''}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`form-input animated-input ${isFocused ? 'focused' : ''}`}
      />
    </div>
  );
};

export default AnimatedInput;
