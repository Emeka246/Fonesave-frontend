/**
 * Centralized routing configuration for the application
 * This file contains all route paths used in the application
 * Import this file in your route configuration files
 */

const ROUTES = {
  // Site routes
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  WHY_TRUST_US: '/why-trust-us',
  PRICING: '/pricing',
  BECOME_AGENT: '/become-agent',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_CONDITIONS: '/terms-conditions',
  DISCLAIMER: '/disclaimer',
  REFUND_POLICY: '/refund-policy',
  
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  RESET_PASSWORD: '/reset-password',
  NEW_PASSWORD: '/new-password',
  OAUTH_CALLBACK: '/auth/success',
  VERIFY_EMAIL: '/verify-email',
  ONBOARDING: '/onboarding',
  COMPLETE_REGISTRATION: '/auth/complete-registration',
  PROFILE: '/profile',
  BILLING: '/billing',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  NEW_REGISTRATION: '/dashboard/new-registration',
  UPDATE_DEVICE: '/dashboard/update-device/:id',
  REPORT_THEFT: '/dashboard/report-theft',
  SEARCH_DEVICE: '/dashboard/search-device',
  VIEW_DEVICE: '/dashboard/devices/:id',
  PAYMENT_VERIFY: '/dashboard/payment/verify',

  // Admin Routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_DEVICES: '/admin/devices',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_SETTINGS: '/admin/settings',
  ADMIN_LOGS: '/admin/logs',
  ADMIN_NOTIFICATIONS: '/admin/notifications',
  ADMIN_REPORTS: '/admin/reports',
  
  // Error routes
  NOT_FOUND: '*'
} as const;

export function getChildPath(path: string, removeStart: number = 1): string {
  return path.split('/').slice(1 + removeStart).join('/');
}

export function formatChildrenRoute(path: string, base: string): string {
  return path.replace(`/${base}/`, '')
}

console.log(formatChildrenRoute(ROUTES.ADMIN_DASHBOARD, 'admin'))


export default ROUTES;