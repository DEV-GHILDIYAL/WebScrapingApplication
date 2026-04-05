import {
  Job,
  JobRun,
  JobStatus,
  OutputFormat,
  FieldType,
  ProxyType,
  ProxyProvider,
  User,
  PlanTier,
  ApiKey,
} from './types';
import { generateId } from './utils';

/**
 * Realistic Mock Data for ScrapeFlow
 */

export const MOCK_USER: User = {
  id: 'usr_7f8a9b2',
  email: 'admin@acmecorp.com',
  name: 'Alex Rivers',
  plan: PlanTier.PROFESSIONAL,
  avatarUrl: 'https://i.pravatar.cc/150?u=usr_7f8a9b2',
  createdAt: '2026-01-15T09:00:00Z',
};

export const MOCK_PROXY_PROVIDERS: ProxyProvider[] = [
  {
    id: 'prx_912384',
    name: 'BrightData Premium',
    type: ProxyType.RESIDENTIAL,
    endpoint: 'brd.superproxy.io:22225',
    auth: { username: 'acme_bright', password: 'password123' },
    rotationEnabled: true,
  },
  {
    id: 'prx_776152',
    name: 'Oxylabs DC Static',
    type: ProxyType.DATACENTER,
    endpoint: 'oxylabs.dc.net:1080',
    auth: { apiKey: 'oxy_xxxxxxxxxxxxxxxxxxx' },
    rotationEnabled: false,
  },
];

export const MOCK_API_KEYS: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production Frontend',
    key: 'sf_key_pro_xxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2026-02-01T10:00:00Z',
    lastUsedAt: '2026-04-05T08:00:00Z',
  },
  {
    id: 'key_2',
    name: 'Analytics Export Daemon',
    key: 'sf_key_ana_yyyyyyyyyyyyyyyyyyyyy',
    createdAt: '2026-03-15T14:30:00Z',
  },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'job_410293',
    name: 'Amazon Electronics Crawler',
    targetUrl: 'https://www.amazon.com/Best-Sellers-Electronics/zgbs/electronics',
    status: JobStatus.COMPLETED,
    outputFormat: OutputFormat.JSON,
    scheduleConfig: { type: 'interval', intervalMinutes: 240 },
    proxyConfig: { providerId: 'prx_912384', rotationEnabled: true },
    fields: [
      { id: 'f1', name: 'title', selector: 'h2.title', type: FieldType.TEXT, multiple: true, required: true },
      { id: 'f2', name: 'price', selector: '.price-tag', type: FieldType.TEXT, multiple: false, required: true },
      { id: 'f3', name: 'image', selector: 'img.cover', type: FieldType.ATTRIBUTE, attribute: 'src', multiple: false, required: false },
    ],
    createdAt: '2026-03-20T10:00:00Z',
    updatedAt: '2026-04-04T18:00:00Z',
    lastRunAt: '2026-04-05T04:00:00Z',
    nextRunAt: '2026-04-05T08:00:00Z',
    runCount: 45,
    successCount: 42,
    failureCount: 3,
  },
  {
    id: 'job_88a91c',
    name: 'eBay Competitor Monitor',
    targetUrl: 'https://www.ebay.com/itm/competitor-price',
    status: JobStatus.RUNNING,
    outputFormat: OutputFormat.CSV,
    scheduleConfig: { type: 'cron', cronExpression: '0 0 * * *' },
    proxyConfig: { providerId: 'prx_776152', rotationEnabled: false },
    fields: [
      { id: 'f4', name: 'seller_name', selector: '.seller-link', type: FieldType.TEXT, multiple: false, required: true },
      { id: 'f5', name: 'rating', selector: '.seller-rating', type: FieldType.TEXT, multiple: false, required: false },
    ],
    createdAt: '2026-04-01T09:15:00Z',
    updatedAt: '2026-04-01T09:15:00Z',
    lastRunAt: '2026-04-05T00:00:00Z',
    runCount: 5,
    successCount: 5,
    failureCount: 0,
  },
  {
    id: 'job_22b01f',
    name: 'Crypto News Aggregator',
    targetUrl: 'https://www.coindesk.com/news',
    status: JobStatus.FAILED,
    outputFormat: OutputFormat.JSON,
    scheduleConfig: { type: 'interval', intervalMinutes: 30 },
    proxyConfig: { providerId: 'prx_912384', rotationEnabled: true },
    fields: [
      { id: 'f6', name: 'headline', selector: 'h1', type: FieldType.TEXT, multiple: true, required: true },
    ],
    createdAt: '2026-04-02T12:00:00Z',
    updatedAt: '2026-04-04T10:00:00Z',
    lastRunAt: '2026-04-05T07:30:00Z',
    nextRunAt: '2026-04-05T08:00:00Z',
    runCount: 120,
    successCount: 115,
    failureCount: 5,
  },
  {
    id: 'job_33c912',
    name: 'Stock Market Feed',
    targetUrl: 'https://finance.yahoo.com/most-active',
    status: JobStatus.QUEUED,
    outputFormat: OutputFormat.JSON,
    scheduleConfig: { type: 'manual' },
    proxyConfig: { providerId: 'prx_776152', rotationEnabled: true },
    fields: [],
    createdAt: '2026-04-05T07:45:00Z',
    updatedAt: '2026-04-05T07:45:00Z',
    runCount: 0,
    successCount: 0,
    failureCount: 0,
  },
];

export const MOCK_JOB_RUNS: JobRun[] = [
  {
    id: 'run_1',
    jobId: 'job_410293',
    status: JobStatus.COMPLETED,
    startedAt: '2026-04-05T04:00:00Z',
    completedAt: '2026-04-05T04:02:15Z',
    recordsExtracted: 852,
  },
  {
    id: 'run_2',
    jobId: 'job_22b01f',
    status: JobStatus.FAILED,
    startedAt: '2026-04-05T07:30:00Z',
    completedAt: '2026-04-05T07:31:05Z',
    recordsExtracted: 12,
    error: 'WAF Blocked: IP rate limited after 1,000 requests.',
  },
];
