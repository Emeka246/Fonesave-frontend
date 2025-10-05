import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { checkAuthStatus } from '@/store/slices/auth.slice';
import { loadAppConstants } from '@/store/slices/app.slice';

interface AuthInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that initializes app state on startup
 * - Loads app constants (with localStorage caching)
 * - Checks authentication status
 * - Runs both operations in parallel for optimal performance
 */
export const AuthInitializer: React.FC<AuthInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isLoading: authLoading, hasCheckedAuth } = useAppSelector(state => state.auth);
  const { isInitialized: constantsInitialized, isLoading: constantsLoading } = useAppSelector(state => state.app);

  useEffect(() => {
    // Load app constants and check auth status in parallel
    const initializeApp = async () => {
      const promises = [];

      // Load app constants if not already initialized
      if (!constantsInitialized && !constantsLoading) {
        promises.push(dispatch(loadAppConstants()));
      }

      // Check auth status if not already checked
      if (!hasCheckedAuth && !authLoading) {
        promises.push(dispatch(checkAuthStatus()));
      }

      // Wait for both operations to complete
      await Promise.allSettled(promises);
    };

    initializeApp();
  }, [dispatch, hasCheckedAuth, authLoading, constantsInitialized, constantsLoading]);

  return <>{children}</>;
};

export default AuthInitializer;
