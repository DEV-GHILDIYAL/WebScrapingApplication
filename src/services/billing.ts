import { ApiResponse, BillingInfo } from '../lib/types';
import { PLANS } from '../lib/constants';
import { delay, shouldFail } from '../lib/utils';

/**
 * Mock Billing Service (Razorpay abstraction)
 */

export const billingService = {
  async getBillingInfo(): Promise<ApiResponse<BillingInfo>> {
    await delay(1200);
    if (shouldFail()) return { success: false, data: null, error: 'Failed to retrieve billing information.' };
    
    const mockInfo: BillingInfo = {
      currentPlan: PLANS.PROFESSIONAL,
      usage: {
        jobsUsed: 12,
        recordsExtracted: 34521,
        apiCallsMade: 1456,
      },
      billingCycle: {
        start: '2026-04-01T00:00:00Z',
        end: '2026-04-30T23:59:59Z',
      },
    };

    return { success: true, data: mockInfo, error: null };
  },

  async createSubscription(planId: string): Promise<ApiResponse<{ orderId: string; amount: number }>> {
    await delay(1500);
    return { 
      success: true, 
      data: { 
        orderId: `order_${Math.random().toString(36).substring(2, 10)}`,
        amount: planId === 'PROFESSIONAL' ? 4900 : 19900 // in cents
      }, 
      error: null 
    };
  }
};
