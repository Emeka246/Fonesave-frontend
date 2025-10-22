import { useAppSelector } from '@/store/hooks';

/**
 * Custom hook that provides authentication status and helper functions
 * to check various authentication conditions
 */
export const useAuth = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector(state => state.auth);
  
  /**
   * Check if user has specific role
   */
  const hasRole = (role: string | string[]): boolean => {
    if (!isAuthenticated || !user || !user.role) return false;
    
    const rolesToCheck = Array.isArray(role) ? role : [role];
    return rolesToCheck.includes(user.role);
  };
  
  /**
   * Check if user has verified email
   */
  const isEmailVerified = (): boolean => {
    if (!isAuthenticated || !user) return false;
    return !!user.isEmailVerified;
  };

  const isAgent = (): boolean => {
    return hasRole('AGENT');
  };

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return hasRole('ADMIN');
  };
  
  return {
    isAuthenticated,
    isLoading,
    user,
    hasRole,
    isEmailVerified,
    isAdmin,
    isAgent,
  };
};

export default useAuth;
