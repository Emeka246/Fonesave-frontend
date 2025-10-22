import { createBrowserRouter } from 'react-router-dom';
import ROUTES_CONFIG from './ROUTES_CONFIG';
import { authRoutes } from './auth.routes';
import { dashboardRoutes } from './dashboard.routes';
import { adminRoutes } from './admin.routes';

import Homepage from '@/pages/site/homepage';
import About from '@/pages/site/about';
import Contact from '@/pages/site/contact';
import WhyTrustUs from '@/pages/site/why-trust-us';
import BecomeAgent from '@/pages/site/become-agent';
import PrivacyPolicy from '@/pages/site/policy-pages/privacy-policy';
import TermsConditions from '@/pages/site/policy-pages/terms-conditions';
import Disclaimer from '@/pages/site/policy-pages/disclaimer';
import RefundPolicy from '@/pages/site/policy-pages/refund-policy';
import { RouterErrorBoundary } from '@/components/common/error-boundary/router-error-boundary';
import LayoutHomepage from '@/components/templates/layout-homepage';
import Layout404 from '@/components/templates/layout-404';




// App router configuration
export const router = createBrowserRouter([
  {
    path: ROUTES_CONFIG.HOME,
    element: <LayoutHomepage />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <Homepage />,
        errorElement: <RouterErrorBoundary />
      },
      {
        path: ROUTES_CONFIG.ABOUT.substring(1),
        element: <About />,
        errorElement: <RouterErrorBoundary />
      },
      {
        path: ROUTES_CONFIG.CONTACT.substring(1),
        element: <Contact />,
        errorElement: <RouterErrorBoundary />
      },
      {
        path: ROUTES_CONFIG.WHY_TRUST_US.substring(1),
        element: <WhyTrustUs />,
        errorElement: <RouterErrorBoundary />
      },
      {
        path: ROUTES_CONFIG.BECOME_AGENT.substring(1),
        element: <BecomeAgent />,
        errorElement: <RouterErrorBoundary />
      },
      {
        path: ROUTES_CONFIG.PRIVACY_POLICY.substring(1),
        element: <PrivacyPolicy />,
        errorElement: <RouterErrorBoundary />
      },
      {
        path: ROUTES_CONFIG.TERMS_CONDITIONS.substring(1),
        element: <TermsConditions />,
        errorElement: <RouterErrorBoundary />
      },
      {
        path: ROUTES_CONFIG.DISCLAIMER.substring(1),
        element: <Disclaimer />,
        errorElement: <RouterErrorBoundary />
      },
      {
        path: ROUTES_CONFIG.REFUND_POLICY.substring(1),
        element: <RefundPolicy />,
        errorElement: <RouterErrorBoundary />
      }
    ]
  },
  ...authRoutes,
  ...dashboardRoutes,
  ...adminRoutes,
  {
    path: ROUTES_CONFIG.NOT_FOUND,
    element: <Layout404 />,
    errorElement: <RouterErrorBoundary />
  }
      
]);