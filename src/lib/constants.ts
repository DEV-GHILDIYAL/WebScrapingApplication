import { JobStatus, PlanTier, ProxyType, BillingPlan } from './types';

export const APP_NAME = 'ScrapeFlow';
export const FAILURE_RATE = 0.15; // 15% chance of simulated failure

export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bgColor: string }> = {
  [JobStatus.QUEUED]: {
    label: 'Queued',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  [JobStatus.RUNNING]: {
    label: 'Running',
    color: 'text-brand-700',
    bgColor: 'bg-brand-50',
  },
  [JobStatus.COMPLETED]: {
    label: 'Completed',
    color: 'text-success-700',
    bgColor: 'bg-success-50',
  },
  [JobStatus.FAILED]: {
    label: 'Failed',
    color: 'text-danger-700',
    bgColor: 'bg-danger-50',
  },
};

export const PLANS: Record<PlanTier, BillingPlan> = {
  [PlanTier.STARTER]: {
    id: PlanTier.STARTER,
    name: 'Starter',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 5 active jobs',
      '1,000 records per job',
      'Community proxies',
      'CSV/JSON exports',
    ],
    limits: {
      maxJobs: 5,
      maxRecordsPerJob: 1000,
      proxyProviders: 1,
    },
  },
  [PlanTier.PROFESSIONAL]: {
    id: PlanTier.PROFESSIONAL,
    name: 'Professional',
    price: 49,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 50 active jobs',
      '50,000 records per job',
      'Custom proxy providers',
      'Advanced scheduling',
      'API access',
    ],
    limits: {
      maxJobs: 50,
      maxRecordsPerJob: 50000,
      proxyProviders: 5,
    },
  },
  [PlanTier.ENTERPRISE]: {
    id: PlanTier.ENTERPRISE,
    name: 'Enterprise',
    price: 199,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited active jobs',
      'Unlimited records',
      'Dedicated support',
      'SLA guarantee',
      'Single Sign-On (SSO)',
    ],
    limits: {
      maxJobs: -1, // Unlimited
      maxRecordsPerJob: -1, // Unlimited
      proxyProviders: -1, // Unlimited
    },
  },
};

export const DEFAULT_PROXY_PROVIDERS = [
  {
    id: 'shared-residential',
    name: 'Shared Residential (Default)',
    type: ProxyType.RESIDENTIAL,
    endpoint: 'res.scrapeflow.io:8080',
    rotationEnabled: true,
  },
];
