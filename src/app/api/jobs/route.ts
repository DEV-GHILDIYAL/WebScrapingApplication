import { NextResponse } from 'next/server';

/**
 * Jobs API Routes — DynamoDB + SQS + Step Functions Integration Point
 *
 * Production integration:
 * - GET    /api/jobs       → DynamoDB Scan/Query with filters
 * - POST   /api/jobs       → DynamoDB PutItem + SQS SendMessage + Step Functions
 * - GET    /api/jobs/[id]  → DynamoDB GetItem
 * - PUT    /api/jobs/[id]  → DynamoDB UpdateItem
 * - DELETE /api/jobs/[id]  → DynamoDB DeleteItem + cancel Step Function execution
 */

interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
}

function apiResponse<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data, error: null }, { status });
}

function apiError(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json({ success: false, data: null, error }, { status });
}

const mockJobs = [
  {
    id: 'job_001',
    name: 'Product Pricing Monitor',
    targetUrl: 'https://example-store.com/products',
    status: 'completed',
    createdAt: '2026-04-01T10:00:00Z',
    lastRunAt: '2026-04-05T06:00:00Z',
    recordsExtracted: 1247,
    schedule: 'daily',
    outputFormat: 'json',
  },
  {
    id: 'job_002',
    name: 'Competitor Analysis',
    targetUrl: 'https://competitor.com/catalog',
    status: 'running',
    createdAt: '2026-04-03T14:30:00Z',
    lastRunAt: '2026-04-05T07:15:00Z',
    recordsExtracted: 523,
    schedule: 'hourly',
    outputFormat: 'csv',
  },
  {
    id: 'job_003',
    name: 'News Aggregator',
    targetUrl: 'https://news-site.com/latest',
    status: 'queued',
    createdAt: '2026-04-05T07:00:00Z',
    lastRunAt: null,
    recordsExtracted: 0,
    schedule: 'every-30-min',
    outputFormat: 'json',
  },
  {
    id: 'job_004',
    name: 'Review Scraper',
    targetUrl: 'https://reviews-platform.com/search',
    status: 'failed',
    createdAt: '2026-04-02T09:00:00Z',
    lastRunAt: '2026-04-04T18:45:00Z',
    recordsExtracted: 89,
    schedule: 'weekly',
    outputFormat: 'csv',
    error: 'Proxy connection timeout after 3 retries',
  },
];

// GET /api/jobs — List all jobs
export async function GET() {
  // TODO: Replace with DynamoDB Query
  return apiResponse({
    jobs: mockJobs,
    total: mockJobs.length,
    page: 1,
    pageSize: 20,
  });
}

// POST /api/jobs — Create a new job
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.targetUrl) {
      return apiError('Missing required fields: name, targetUrl');
    }

    // TODO: Validate with zod, store in DynamoDB, send to SQS
    const newJob = {
      id: `job_${Date.now()}`,
      ...body,
      status: 'queued',
      createdAt: new Date().toISOString(),
      lastRunAt: null,
      recordsExtracted: 0,
    };

    return apiResponse({ job: newJob }, 201);
  } catch {
    return apiError('Invalid request body');
  }
}
