'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, Spinner, useToast } from '@/components/ui';
import { useJobs } from '@/hooks/useJobs';
import { Job, JobStatus, OutputFormat } from '@/lib/types';
import WizardStepper from '@/components/dashboard/JobWizard/WizardStepper';
import Step1BasicInfo from '@/components/dashboard/JobWizard/Step1BasicInfo';
import Step2FieldExtractor from '@/components/dashboard/JobWizard/Step2FieldExtractor';
import Step3Configuration from '@/components/dashboard/JobWizard/Step3Configuration';
import Step4Review from '@/components/dashboard/JobWizard/Step4Review';
import { ArrowLeft, ArrowRight, Save, X } from 'lucide-react';

const STEPS = ['Basic Info', 'Extraction', 'Configuration', 'Review'];

export default function NewJobPage() {
  const router = useRouter();
  const { createJob } = useJobs();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wizard State
  const [formData, setFormData] = useState<Partial<Job>>({
    name: '',
    targetUrl: '',
    fields: [],
    proxyConfig: { providerId: 'default', rotationEnabled: true },
    scheduleConfig: { type: 'manual' },
    outputFormat: OutputFormat.JSON,
  });

  const updateFormData = (updates: Partial<Job>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!formData.name && !!formData.targetUrl && formData.targetUrl.includes('://');
      case 2:
        return true; // Fields can be empty if they want raw HTML
      case 3:
        return !!formData.scheduleConfig?.type && !!formData.outputFormat;
      default:
        return true;
    }
  };

  const { success: showSuccess, error: showError } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createJob(formData);
      if (result.success) {
        showSuccess('Job Created', `"${formData.name}" has been successfully launched.`);
        router.push('/dashboard/jobs');
      } else {
        const errorMsg = result.error || 'Failed to create job.';
        setError(errorMsg);
        showError('Action Failed', errorMsg);
        setIsSubmitting(false);
      }
    } catch (err) {
      const errorMsg = 'An unexpected error occurred. Please try again.';
      setError(errorMsg);
      showError('System Error', errorMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Job</h1>
          <p className="text-slate-500">Scale your data extraction in 4 simple steps.</p>
        </div>
        <Button variant="secondary" onClick={() => router.push('/dashboard/jobs')} leftIcon={<X size={18} />}>
          Cancel
        </Button>
      </div>

      {/* Stepper */}
      <Card className="p-6 bg-white border-slate-200">
        <WizardStepper currentStep={currentStep} steps={STEPS} />
      </Card>

      {/* Error Feedback */}
      {error && (
        <div className="p-4 bg-danger-50 border border-danger-100 rounded-xl text-danger-700 text-sm text-center">
          {error}
        </div>
      )}

      {/* Step Content */}
      <Card className="p-8 bg-white border-slate-200 shadow-sm min-h-[400px]">
        {currentStep === 1 && (
          <Step1BasicInfo 
            data={{ name: formData.name || '', targetUrl: formData.targetUrl || '' }}
            updateData={(updates) => updateFormData(updates)} 
          />
        )}
        {currentStep === 2 && (
          <Step2FieldExtractor 
            fields={formData.fields || []} 
            updateFields={(fields) => updateFormData({ fields })} 
          />
        )}
        {currentStep === 3 && (
          <Step3Configuration 
            proxyConfig={formData.proxyConfig!}
            scheduleConfig={formData.scheduleConfig!}
            outputFormat={formData.outputFormat!}
            updateProxy={(updates) => updateFormData({ proxyConfig: { ...formData.proxyConfig!, ...updates } })}
            updateSchedule={(updates) => updateFormData({ scheduleConfig: { ...formData.scheduleConfig!, ...updates } })}
            updateFormat={(format) => updateFormData({ outputFormat: format })}
          />
        )}
        {currentStep === 4 && (
          <Step4Review data={formData} />
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="secondary"
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
          leftIcon={<ArrowLeft size={18} />}
        >
          Back
        </Button>

        {currentStep === STEPS.length ? (
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            leftIcon={<Save size={18} />}
          >
            Launch Job
          </Button>
        ) : (
          <Button
            onClick={nextStep}
            disabled={!isStepValid()}
            rightIcon={<ArrowRight size={18} />}
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
