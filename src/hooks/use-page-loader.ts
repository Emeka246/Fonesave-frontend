import { useState, useCallback } from 'react';
import { useLoading } from '@/contexts/loading.provider';

interface UsePageLoaderReturn {
  isLoading: boolean;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
  executeWithLoader: <T>(
    asyncFunction: () => Promise<T>,
    loadingMessage?: string
  ) => Promise<T>;
}

/**
 * Custom hook for managing page loading states
 * Provides utilities for showing/hiding loaders and executing async functions with loading
 */
export const usePageLoader = (): UsePageLoaderReturn => {
  const { isLoading, showLoader: contextShowLoader, hideLoader: contextHideLoader } = useLoading();
  const [localLoading, setLocalLoading] = useState(false);

  const showLoader = useCallback((message?: string) => {
    setLocalLoading(true);
    contextShowLoader(message);
  }, [contextShowLoader]);

  const hideLoader = useCallback(() => {
    setLocalLoading(false);
    contextHideLoader();
  }, [contextHideLoader]);

  const executeWithLoader = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    loadingMessage: string = 'Loading...'
  ): Promise<T> => {
    try {
      showLoader(loadingMessage);
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  return {
    isLoading: isLoading || localLoading,
    showLoader,
    hideLoader,
    executeWithLoader,
  };
};

/**
 * Hook for handling navigation loading states
 */
export const useNavigationLoader = () => {
  const { showLoader, hideLoader } = useLoading();

  const navigateWithLoader = useCallback((
    navigationFunction: () => void,
    message: string = 'Navigating...'
  ) => {
    showLoader(message);
    // Add a small delay to show the loader before navigation
    setTimeout(() => {
      navigationFunction();
    }, 100);
  }, [showLoader]);

  return { navigateWithLoader, showLoader, hideLoader };
};
