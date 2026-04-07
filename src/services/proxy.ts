import { ProxyProvider, ApiResponse, ApiKey } from '../lib/types';
import { MOCK_PROXY_PROVIDERS, MOCK_API_KEYS } from '../lib/mock-data';
import { delay, shouldFail, generateId } from '../lib/utils';

/**
 * Mock Proxy & Settings Service
 */

const STORAGE_KEYS = {
  PROVIDERS: 'sf_proxy_providers',
};

const getStoredProviders = (): ProxyProvider[] => {
  if (typeof window === 'undefined') return MOCK_PROXY_PROVIDERS;
  const stored = localStorage.getItem(STORAGE_KEYS.PROVIDERS);
  return stored ? JSON.parse(stored) : MOCK_PROXY_PROVIDERS;
};

const setStoredProviders = (providers: ProxyProvider[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.PROVIDERS, JSON.stringify(providers));
  }
};

export const settingsService = {
  async getProxyProviders(): Promise<ApiResponse<ProxyProvider[]>> {
    await delay(1000);
    if (shouldFail()) return { success: false, data: null, error: 'Failed to load proxy settings.' };
    return { success: true, data: getStoredProviders(), error: null };
  },

  async saveProxyProvider(provider: Partial<ProxyProvider>): Promise<ApiResponse<ProxyProvider>> {
    await delay(1500);
    const providers = getStoredProviders();
    
    let updatedProvider: ProxyProvider;
    
    if (provider.id) {
      const index = providers.findIndex(p => p.id === provider.id);
      updatedProvider = { ...providers[index], ...provider } as ProxyProvider;
      providers[index] = updatedProvider;
    } else {
      updatedProvider = {
        ...provider,
        id: generateId('prx_'),
      } as ProxyProvider;
      providers.push(updatedProvider);
    }

    setStoredProviders(providers);
    return { success: true, data: updatedProvider, error: null };
  },

  async testProxyProvider(id: string): Promise<ApiResponse<boolean>> {
    await delay(2000); // Testing takes longer
    if (shouldFail(0.2)) return { success: false, data: null, error: 'Connection failed: Access denied or invalid credentials.' };
    return { success: true, data: true, error: null };
  },

  async getApiKeys(): Promise<ApiResponse<ApiKey[]>> {
    await delay(800);
    return { success: true, data: MOCK_API_KEYS, error: null };
  },

  async createApiKey(name: string): Promise<ApiResponse<ApiKey>> {
    await delay(1200);
    const newKey: ApiKey = {
      id: generateId('key_'),
      name,
      key: `sf_key_tmp_${Math.random().toString(36).substring(2, 30)}`,
      createdAt: new Date().toISOString(),
    };
    return { success: true, data: newKey, error: null };
  }
};
