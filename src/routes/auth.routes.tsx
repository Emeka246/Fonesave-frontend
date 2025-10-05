import {RouteObject} from 'react-router-dom';
import ROUTES_CONFIG  from './ROUTES_CONFIG';
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import ResetPasswordPage from '@/pages/auth/reset-password';
import NewPasswordPage from '@/pages/auth/new-password';
import ProfilePage from '@/pages/auth/profile';
import BillingPage from '@/pages/auth/billing';
import LayoutGuest from '@/components/templates/layout-guest';
import LayoutApp from '@/components/templates/layout-app';
import RouteMiddleware from '@/middlewares/route.middleware';
import VerifyEmailPage from '@/pages/auth/verify-email';
import OnboardingPage from '@/pages/auth/onboarding';
import OAuthCallbackPage from '@/pages/auth/oauth-callback';
import CompleteRegistrationByLink from '@/pages/auth/complete-registration-by-link';

export const authRoutes : RouteObject[] = [
    {
        path: '/',
        element: (
            <RouteMiddleware requireAuth={false}>
                <LayoutGuest/>
            </RouteMiddleware>
        ),
        children: [
            {
                path: ROUTES_CONFIG.LOGIN.substring(1),
                element: <LoginPage/>
            }, {
                path: ROUTES_CONFIG.REGISTER.substring(1),
                element: <RegisterPage/>
            }, {
                path: ROUTES_CONFIG.RESET_PASSWORD.substring(1),
                element: <ResetPasswordPage/>
            }, {
                path: ROUTES_CONFIG.NEW_PASSWORD.substring(1),
                element: <NewPasswordPage/>
            }, {
                path: ROUTES_CONFIG.OAUTH_CALLBACK.substring(1),
                element: <OAuthCallbackPage/>
            }, {
                path: ROUTES_CONFIG.COMPLETE_REGISTRATION.substring(1),
                element: <CompleteRegistrationByLink/>
            },
        ]
    },
    // Verify email route - authenticated but no email verification required
    {
        path: ROUTES_CONFIG.VERIFY_EMAIL,
        element: (
            <RouteMiddleware requireAuth={true} requireEmailVerification={false}>
                <LayoutGuest/>
            </RouteMiddleware>
        ),
        children: [
            {
                index: true,
                element: <VerifyEmailPage/>
            }
        ]
    },
    // Onboarding route - requires token but not authenticated yet
    {
        path: ROUTES_CONFIG.ONBOARDING,
        element: (
            <RouteMiddleware requireOnboardingComplete={false}>
                <LayoutGuest/>
            </RouteMiddleware>
        ),
        children: [
            {
                index: true,
                element: <OnboardingPage/>
            }
        ]
    }, {
        path: ROUTES_CONFIG.PROFILE,
        element: (
            <RouteMiddleware requireAuth={true} requireEmailVerification={true}>
                <LayoutApp/>
            </RouteMiddleware>
        ),
        children: [
            {
                index: true,
                element: <ProfilePage/>
            }
        ]
    }, {
        path: ROUTES_CONFIG.BILLING,
        element: (
            <RouteMiddleware requireAuth={true} requireEmailVerification={true}>
                <LayoutApp/>
            </RouteMiddleware>
        ),
        children: [
            {
                index: true,
                element: <BillingPage/>
            }
        ]
    }
];