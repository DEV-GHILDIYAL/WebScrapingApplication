import { User, ApiResponse, PlanTier } from '../lib/types';
import { MOCK_USER } from '../lib/mock-data';
import { delay, shouldFail } from '../lib/utils';

/**
 * Mock Auth Service (Cognito abstraction)
 */

export const authService = {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(Math.random() * 700 + 800);
    
    if (shouldFail(0.02)) { // Keep session-get failure lower for better UX
      return { success: false, data: null, error: 'Session expired or invalid.' };
    }

    return { success: true, data: MOCK_USER, error: null };
  },

  async signIn(email: string, password: string): Promise<ApiResponse<User>> {
    await delay(1200);

    if (shouldFail()) {
      return { success: false, data: null, error: 'Invalid credentials provided.' };
    }

    // Mock logic: allow any sign in with a "password"
    if (password.length < 6) {
      return { success: false, data: null, error: 'Password must be at least 6 characters.' };
    }

    return { success: true, data: { ...MOCK_USER, email }, error: null };
  },

  async signUp(email: string, name: string): Promise<ApiResponse<User>> {
    await delay(1500);

    if (shouldFail()) {
      return { success: false, data: null, error: 'An error occurred during account creation.' };
    }

    return { 
      success: true, 
      data: { 
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        email,
        name,
        plan: PlanTier.STARTER,
        createdAt: new Date().toISOString()
      }, 
      error: null 
    };
  },

  async signOut(): Promise<ApiResponse<boolean>> {
    await delay(800);
    return { success: true, data: true, error: null };
  }
};
