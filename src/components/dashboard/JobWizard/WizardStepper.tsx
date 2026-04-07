'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface WizardStepperProps {
  currentStep: number;
  steps: string[];
}

export default function WizardStepper({ currentStep, steps }: WizardStepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-between w-full">
        {steps.map((step, stepIdx) => {
          const isCompleted = stepIdx + 1 < currentStep;
          const isCurrent = stepIdx + 1 === currentStep;
          const isPending = stepIdx + 1 > currentStep;

          return (
            <li key={step} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
              <div className="flex items-center">
                {/* Step Circle */}
                <div
                  className={`
                    relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-200
                    ${isCompleted ? 'bg-brand-600 border-brand-600' : ''}
                    ${isCurrent ? 'border-brand-600 bg-white' : ''}
                    ${isPending ? 'border-slate-300 bg-white' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span className={`text-sm font-bold ${isCurrent ? 'text-brand-600' : 'text-slate-500'}`}>
                      {stepIdx + 1}
                    </span>
                  )}
                </div>

                {/* Step Label (Desktop) */}
                <span className="hidden md:ml-3 md:block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {step}
                </span>

                {/* Connector Line */}
                {stepIdx !== steps.length - 1 && (
                  <div className="flex-1 px-4">
                    <div className={`h-0.5 w-full ${isCompleted ? 'bg-brand-600' : 'bg-slate-200'}`} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
