/**
 * ScrapeFlow Core Type Definitions
 */

export enum JobStatus {
  QUEUED = 'QUEUED',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum OutputFormat {
  JSON = 'JSON',
  CSV = 'CSV',
}

export enum PlanTier {
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  ENTERPRISE = 'ENTERPRISE',
}

export enum FieldType {
  TEXT = 'TEXT',
  ATTRIBUTE = 'ATTRIBUTE',
  HTML = 'HTML',
}

export enum ProxyType {
  RESIDENTIAL = 'RESIDENTIAL',
  DATACENTER = 'DATACENTER',
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanTier;
  avatarUrl?: string;
  createdAt: string;
}

export interface FieldExtractor {
  id: string;
  name: string;
  selector: string;
  type: FieldType;
  attribute?: string;
  multiple: boolean;
  required: boolean;
}

export interface ScheduleConfig {
  type: 'manual' | 'interval' | 'cron';
  intervalMinutes?: number;
  cronExpression?: string;
}

export interface ProxyConfig {
  providerId: string;
  rotationEnabled: boolean;
}

export interface Job {
  id: string;
  name: string;
  targetUrl: string;
  status: JobStatus;
  fields: FieldExtractor[];
  proxyConfig: ProxyConfig;
  scheduleConfig: ScheduleConfig;
  outputFormat: OutputFormat;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
  nextRunAt?: string;
  runCount: number;
  successCount: number;
  failureCount: number;
}

export interface JobRun {
  id: string;
  jobId: string;
  status: JobStatus;
  startedAt: string;
  completedAt?: string;
  recordsExtracted: number;
  error?: string;
}

export interface ProxyProvider {
  id: string;
  name: string;
  type: ProxyType;
  endpoint: string;
  auth: {
    apiKey?: string;
    username?: string;
    password?: string;
  };
  rotationEnabled: boolean;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
}

export interface BillingPlan {
  id: PlanTier;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    maxJobs: number;
    maxRecordsPerJob: number;
    proxyProviders: number;
  };
}

export interface BillingInfo {
  currentPlan: BillingPlan;
  usage: {
    jobsUsed: number;
    recordsExtracted: number;
    apiCallsMade: number;
  };
  billingCycle: {
    start: string;
    end: string;
  };
}
