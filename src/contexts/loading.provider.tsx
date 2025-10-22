import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import PageLoader from '@/components/common/page-loader';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  showLoader: (message?: string) => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');

  useEffect(() => {
    // Handle initial page load
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Handle page reload detection
    const handleBeforeUnload = () => {
      setIsLoading(true);
      setLoadingMessage('Loading...');
    };

    // Handle navigation events (including back/forward)
    const handlePopState = () => {
      // Small delay to allow route changes to complete
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle navigation events - clear loading state on any navigation
  useEffect(() => {
    const handleNavigation = () => {
      // Clear loading state when navigation occurs
      setIsLoading(false);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleNavigation);
    
    // Also listen for hash changes (in case of hash routing)
    window.addEventListener('hashchange', handleNavigation);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('hashchange', handleNavigation);
    };
  }, []);

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const showLoader = (message: string = 'Loading...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  const contextValue: LoadingContextType = {
    isLoading,
    setLoading,
    showLoader,
    hideLoader,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {isLoading && <PageLoader message={loadingMessage} />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
