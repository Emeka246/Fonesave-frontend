import { useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { checkAuthStatus } from "@/store/slices/auth.slice";
import ROUTES from "@/routes/ROUTES_CONFIG";

export default function OAuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get("token");
        const csrfToken = searchParams.get("csrfToken");

      
        // Validate required parameters
        if (!token) {
          throw new Error("No authentication token received");
        }

        // Store tokens in cookies (matching your app's pattern)
        // Use secure flag only in production
        const isProduction = window.location.protocol === 'https:';
        const secureFlag = isProduction ? '; secure' : '';
        const sameSiteValue = isProduction ? 'none' : 'lax'; // Match backend configuration

        document.cookie = `access_token=${token}; path=/${secureFlag}; samesite=${sameSiteValue}; max-age=3600`; // 1 hour

        // Store CSRF token if provided
        if (csrfToken) {
          document.cookie = `csrf_token=${csrfToken}; path=/${secureFlag}; samesite=${sameSiteValue}; max-age=900`; // 15 minutes
        }


        // Check auth status to get user data from the server
        console.log("Checking authentication status...");
        const userInfo = await dispatch(checkAuthStatus()).unwrap();
        
        // Check if email needs verification or profile needs completion
        if (userInfo && userInfo.isEmailVerified === false) {
          toast.warning("Please verify your email before continuing");
          navigate(`${ROUTES.VERIFY_EMAIL}?email=${userInfo.email}`, { replace: true });
          return;
        } else if (userInfo && (!userInfo.fullName || !userInfo.phone || !userInfo.role)) {
          toast.info("Please complete your profile information");
          navigate(`${ROUTES.ONBOARDING}?userId=${userInfo.id}`, { replace: true });
          return;
        }

        // Clean up session storage
        sessionStorage.removeItem("oauthReturnPath");

        console.log("Navigating to dashboard");
        
        // Only navigate to dashboard if user has completed email verification and onboarding
        navigate(ROUTES.DASHBOARD, { replace: true });

      } catch (error: any) {
        console.error("OAuth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        
        // Redirect back to login page on error
        navigate(ROUTES.LOGIN, { replace: true });
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, dispatch, location]);

  // Show loading state while processing
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
