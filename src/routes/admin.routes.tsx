import {RouteObject} from 'react-router-dom';
import ROUTES_CONFIG, {formatChildrenRoute}  from './ROUTES_CONFIG';
import LayoutAdmin from '@/components/templates/layout-admin';
import RouteMiddleware from '@/middlewares/route.middleware';
import AdminDashboard from '@/pages/system-admin/dashboard';
import AdminDevices from '@/pages/system-admin/devices';
import AdminPayments from '@/pages/system-admin/payments';
import AdminUsers from '@/pages/system-admin/users';

export const adminRoutes : RouteObject[] = [
    {
        path: '/admin',
        element: (
            <RouteMiddleware requireAuth={true} requiredRoles={['ADMIN']}>
                <LayoutAdmin/>
            </RouteMiddleware>
        ),
        children: [
            {
                path: formatChildrenRoute(ROUTES_CONFIG.ADMIN_DASHBOARD, 'admin'),
                element: <AdminDashboard/>
            },
            {
                path: formatChildrenRoute(ROUTES_CONFIG.ADMIN_DEVICES, 'admin'),
                element: <AdminDevices/>
            },
            {
                path: formatChildrenRoute(ROUTES_CONFIG.ADMIN_PAYMENTS, 'admin'),
                element: <AdminPayments/>
            },
            {
                path: formatChildrenRoute(ROUTES_CONFIG.ADMIN_USERS, 'admin'),
                element: <AdminUsers/>
            }
        ]
    },
];