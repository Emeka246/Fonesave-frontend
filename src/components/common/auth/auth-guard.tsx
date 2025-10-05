import React from 'react';
import { useAppSelector } from '@/store/hooks';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  requireEmailVerification?: boolean;
  fallback?: React.ReactNode;
}

/**
 * Component for conditionally rendering UI elements based on authentication status
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  requiredRoles = [],
  requireEmailVerification = false,
  fallback = null
}) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  // If auth is required but user is not authenticated, show fallback
  if (requireAuth && !isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  // If auth is not required and user is authenticated, show fallback (for guest-only elements)
  if (!requireAuth && isAuthenticated) {
    return fallback ? <>{fallback}</> : null;
  }

  // If auth is required, user is authenticated, and roles are specified, check role
  if (
    requireAuth &&
    isAuthenticated &&
    requiredRoles.length > 0 &&
    user &&
    user.role && 
    !requiredRoles.includes(user.role)
  ) {
    return fallback ? <>{fallback}</> : null;
  }

  // Check for email verification if required
  if (
    requireAuth &&
    isAuthenticated &&
    requireEmailVerification &&
    user &&
    user.isEmailVerified === false
  ) {
    return fallback ? <>{fallback}</> : null;
  }

  // All conditions met, render the children
  return <>{children}</>;
};

interface AuthElementProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiredRoles?: string[];
  requireEmailVerification?: boolean;
}

/**
 * Component to render content only for authenticated users
 */
export const AuthenticatedOnly: React.FC<AuthElementProps> = ({ 
  children, 
  fallback = null,
  requiredRoles = [],
  requireEmailVerification = false
}) => (
  <AuthGuard 
    requireAuth={true} 
    requiredRoles={requiredRoles} 
    requireEmailVerification={requireEmailVerification}
    fallback={fallback}
  >
    {children}
  </AuthGuard>
);

/**
 * Component to render content only for unauthenticated/guest users
 */
export const UnauthenticatedOnly: React.FC<Omit<AuthElementProps, 'requiredRoles' | 'requireEmailVerification'>> = ({ 
  children, 
  fallback = null 
}) => (
  <AuthGuard requireAuth={false} fallback={fallback}>
    {children}
  </AuthGuard>
);

/**
 * Component to render content only for users with the admin role
 */
export const AdminOnly: React.FC<Omit<AuthElementProps, 'requiredRoles'>> = ({ 
  children, 
  fallback = null,
  requireEmailVerification = true
}) => (
  <AuthGuard 
    requireAuth={true} 
    requiredRoles={['ADMIN']} 
    requireEmailVerification={requireEmailVerification}
    fallback={fallback}
  >
    {children}
  </AuthGuard>
);

/**
 * Component to render content only for users with verified email addresses
 */
export const VerifiedOnly: React.FC<Omit<AuthElementProps, 'requireEmailVerification'>> = ({ 
  children, 
  fallback = null,
  requiredRoles = []
}) => (
  <AuthGuard 
    requireAuth={true} 
    requiredRoles={requiredRoles}
    requireEmailVerification={true}
    fallback={fallback}
  >
    {children}
  </AuthGuard>
);

export default AuthGuard;
