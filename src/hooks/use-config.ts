import { config } from '@/lib/constants';
import type { AppConfig } from '@/lib/constants';

/**
 * Hook to access environment configuration
 * @returns Configuration object with all environment variables
 */
export const useConfig = () => {
  return {
    ...config.getAll(),
    
    // Helper methods
    isFeatureEnabled: (feature: keyof Pick<AppConfig, 'enableAnalytics' | 'enableDebug'>) => {
      return config[feature];
    },
    
    getApiUrl: (endpoint: string) => {
      return `${config.apiBaseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    }
  };
};

export default useConfig;
