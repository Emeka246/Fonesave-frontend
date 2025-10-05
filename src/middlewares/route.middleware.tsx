import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import PageLoader from '@/components/common/page-loader';
import ROUTES from '@/routes/ROUTES_CONFIG';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRoles?: string[];
  redirectTo?: string;
  requireEmailVerification?: boolean;
  requireOnboardingComplete?: boolean;
}

/**
 * Route middleware component that protects routes based on authentication status
 * Uses Redux for state management
 */
const RouteMiddleware: React.FC<ProtectedRouteProps> = ({
  children, 
  requireAuth = true, 
  requiredRoles = [], 
  redirectTo = ROUTES.LOGIN,
  requireEmailVerification = true,
  requireOnboardingComplete = true
}) => {
  const { isAuthenticated, user, isLoading, hasCheckedAuth } = useAppSelector(state => state.auth);
  const location = useLocation();
  const route = location.pathname;

  const redirectionGuide = () => {
    return user?.role === 'ADMIN' ? 
       <Navigate to={ROUTES.ADMIN_DASHBOARD} replace /> : 
       <Navigate to={ROUTES.DASHBOARD} replace />;
  }
  

  // Show loading state if we're still checking authentication and haven't checked yet
  const isPage = route.startsWith('/auth') || 
                  route.startsWith('/login') || 
                    route.startsWith('/register');
  if ((isLoading || !hasCheckedAuth) && !isPage) {
    return <PageLoader message="Authenticating..." />;
  }
  // If the user is not authenticated and the route requires authentication

  // Handle auth-required routes
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with the previous location stored
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Handle guest-only routes (redirect authenticated users away from login/register pages)
  if (!requireAuth && isAuthenticated) {
    return redirectionGuide();
  }

  // Check for role-based access if roles are specified and user is authenticated

  

  if (
    requireAuth &&
    isAuthenticated &&
    requiredRoles.length > 0 &&
    user &&
    user.role && // Make sure role exists
    !requiredRoles.includes(user.role)
  ) {

    // Check if the user is admin and redirect to admin dashboard
    if (user?.role === 'ADMIN') {
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
    }

    

    // User doesn't have required role, redirect to dashboard or access denied
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  

  // IMPORTANT: Always check for email verification first, before checking onboarding
  // This ensures the correct flow: Register -> Verify Email -> Onboarding -> Dashboard
  if (
    requireAuth &&
    isAuthenticated &&
    requireEmailVerification &&
    user &&
    user.isEmailVerified === false
  ) {
    // User's email is not verified, redirect to verification page
    return <Navigate to={`${ROUTES.VERIFY_EMAIL}?email=${user.email}`} replace />;
  }
  
  // Only check onboarding if email is verified
  if (
    requireAuth &&
    isAuthenticated &&
    requireOnboardingComplete &&
    user &&
    user.isEmailVerified === true && // Only proceed to onboarding after email verification
    // Only check if we're not already on the onboarding route
    !route.includes(ROUTES.ONBOARDING) &&
    (!user.fullName || !user.phone || !user.role || !user.defaultCurrency)
  ) {
   
    
    // Set a session flag to indicate we're redirecting due to incomplete profile
    if (!sessionStorage.getItem('onboardingRedirected')) {
      sessionStorage.setItem('onboardingRedirected', 'true');
      
      // Preserve returnUrl for after onboarding completion
      const returnUrl = sessionStorage.getItem('returnUrl');
      if (returnUrl) {
        sessionStorage.setItem('returnUrlAfterOnboarding', returnUrl);
        // Don't remove the original returnUrl yet - keep it for the flow
      }
    }
    
    // User hasn't completed onboarding, redirect to onboarding page
    return <Navigate to={`${ROUTES.ONBOARDING}?userId=${user.id}`} replace />;
  }

  // All conditions met, render the children
  return <>{children}</>;
};

export default RouteMiddleware;