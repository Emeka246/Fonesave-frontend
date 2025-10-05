import { RouteObject } from 'react-router-dom';
import ROUTES_CONFIG, {getChildPath} from './ROUTES_CONFIG';
import LayoutApp from '@/components/templates/layout-app';
import RouteMiddleware from '@/middlewares/route.middleware';
import DashboardPage from '@/pages/app/index';
import NewRegistrationPage from '@/pages/app/devices/new-registration';
import ReportTheftPage from '@/pages/app/devices/Report-theft';
import SearchDevicePage from '@/pages/app/devices/search-device';
import { RouterErrorBoundary } from '@/components/common/error-boundary/router-error-boundary';
import ViewDevicePage from '@/pages/app/devices/view-device';
import PaymentVerificationPage from '@/pages/app/payment-verification';




export const dashboardRoutes: RouteObject[] = [
   {
    path: ROUTES_CONFIG.DASHBOARD,
    element: (
      <RouteMiddleware requireAuth={true} requireEmailVerification={true} requireOnboardingComplete={true}>
        <LayoutApp />
      </RouteMiddleware>
    ),
    errorElement: <RouterErrorBoundary />,
    children: [
      {
      index: true,
      element: <DashboardPage />,
      errorElement: <RouterErrorBoundary />
      },
      {
      path: ROUTES_CONFIG.NEW_REGISTRATION.replace(/^\/dashboard\//, ''),
      element: <NewRegistrationPage />,
      errorElement: <RouterErrorBoundary />
      },
      {
      path: ROUTES_CONFIG.REPORT_THEFT.replace(/^\/dashboard\//, ''),
      element: <ReportTheftPage />,
      errorElement: <RouterErrorBoundary />
      },
      {
      path: ROUTES_CONFIG.SEARCH_DEVICE.replace(/^\/dashboard\//, ''),
      element: <SearchDevicePage />,
      errorElement: <RouterErrorBoundary />
      },
      {
      path: ROUTES_CONFIG.VIEW_DEVICE.replace(/^\/dashboard\//, ''),
      element: <ViewDevicePage />,
      errorElement: <RouterErrorBoundary />
      },
      {
      path: getChildPath(ROUTES_CONFIG.PAYMENT_VERIFY),
      element: <PaymentVerificationPage />,
      errorElement: <RouterErrorBoundary />
      },
      // Add other routes here as needed
    ]
  },
];