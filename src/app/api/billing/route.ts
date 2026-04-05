import { NextResponse } from 'next/server';

/**
 * Billing API Routes — Razorpay Standard Checkout Integration Point
 *
 * Production integration:
 * - GET  /api/billing                     → Current plan + usage from DynamoDB
 * - POST /api/billing { action: 'create-order' }      → Razorpay Orders API
 * - POST /api/billing { action: 'verify-payment' }    → Razorpay signature verify
 * - POST /api/billing { action: 'cancel-subscription'}→ Razorpay Subscriptions API
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

// GET /api/billing — Billing info + usage
export async function GET() {
  // TODO: Replace with DynamoDB + Razorpay queries
  return apiResponse({
    currentPlan: {
      id: 'plan_professional',
      name: 'Professional',
      price: 4999,
      currency: 'INR',
      interval: 'monthly',
      features: {
        maxJobs: 50,
        maxRecordsPerJob: 50000,
        proxyProviders: 3,
        apiAccess: true,
        prioritySupport: false,
        customRetention: false,
      },
    },
    usage: {
      jobsUsed: 12,
      jobsLimit: 50,
      recordsExtracted: 34521,
      recordsLimit: 250000,
      apiCallsMade: 1456,
      storageUsedMB: 125,
    },
    billingCycle: {
      start: '2026-04-01T00:00:00Z',
      end: '2026-04-30T23:59:59Z',
    },
    paymentMethod: {
      type: 'card',
      last4: '4242',
      brand: 'Visa',
    },
  });
}

// POST /api/billing — Payment operations
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create-order':
        // TODO: Replace with Razorpay Orders API
        return apiResponse({
          orderId: `order_mock_${Date.now()}`,
          amount: body.amount || 4999,
          currency: 'INR',
          razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
        });

      case 'verify-payment':
        // TODO: Replace with Razorpay signature verification
        return apiResponse({
          paymentId: body.paymentId,
          verified: true,
        });

      case 'cancel-subscription':
        // TODO: Replace with Razorpay Subscriptions API
        return apiResponse({ cancelled: true });

      default:
        return apiError(
          'Invalid action. Use: create-order, verify-payment, cancel-subscription'
        );
    }
  } catch {
    return apiError('Invalid request body');
  }
}
