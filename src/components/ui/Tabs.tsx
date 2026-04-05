'use client';

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pills';
  className?: string;
}

export default function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActive,
  onChange,
  variant = 'underline',
  className = '',
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id);
  const activeTab = controlledActive ?? internalActive;

  const handleTabClick = (tabId: string) => {
    setInternalActive(tabId);
    onChange?.(tabId);
  };

  if (variant === 'pills') {
    return (
      <div className={`flex gap-1 p-1 bg-slate-100 rounded-lg ${className}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md
              transition-all duration-200
              ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }
            `}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${
                    activeTab === tab.id
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-slate-200 text-slate-500'
                  }
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Underline variant (default)
  return (
    <div className={`border-b border-slate-200 ${className}`} role="tablist">
      <div className="flex gap-0 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-3 text-sm font-medium
              border-b-2 transition-all duration-200
              ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }
            `}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${
                    activeTab === tab.id
                      ? 'bg-brand-50 text-brand-700'
                      : 'bg-slate-100 text-slate-500'
                  }
                `}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
