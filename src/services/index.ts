import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { config } from '../lib/constants';

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  data?: T;
  user?: T;
  code?: string;
  message?: string;
  success?: boolean;
}

/**
 * Common response type for all API calls
 */
export type ApiResult<T = any> = Promise<AxiosResponse<ApiResponse<T>>>;

/**
 * Base API configuration
 */
const apiConfig = {
  baseURL: config.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds timeout
};

// Track redirect attempts to prevent infinite loops
let redirectAttempted = false;

// Define guest pages that don't require authentication
const GUEST_PAGES = [
  '/login',
  '/register', 
  '/forgot-password',
  '/reset-password',
  '/auth/success',
  '/auth/error',
  '/',
  '/about',
  '/contact',
  '/privacy',
  '/terms'
];

// Check if current page is a guest page
const isGuestPage = (pathname: string): boolean => {
  return GUEST_PAGES.some(page => pathname.startsWith(page));
};

// Check if the API call is from an authenticated context
const isAuthenticatedContext = (): boolean => {
  // Check if we have an access token (indicates user is logged in)
  const hasAccessToken = document.cookie
    .split('; ')
    .some(row => row.startsWith('access_token='));
  
  // Check if we're on an authenticated page (not a guest page)
  const isOnAuthenticatedPage = !isGuestPage(window.location.pathname);
  
  return hasAccessToken && isOnAuthenticatedPage;
};

/**
 * Creates and configures an API instance with interceptors
 * @returns Configured axios instance
 */
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create(apiConfig);
  
  
  // Request interceptor to add CSRF token from cookie
  instance.interceptors.request.use(config => {
    // Reset redirect flag on successful requests to authenticated pages
    if (config.url && isAuthenticatedContext()) {
      redirectAttempted = false;
    }
    
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrf_token='))
      ?.split('=')[1];

    console.log('CSRF Token from cookie:', csrfToken ? 'Present' : 'Missing');
    console.log('Request method:', config.method);

    if (csrfToken && config.method !== 'get') {
      config.headers['x-csrf-token'] = csrfToken;
      console.log('Added CSRF token to request headers');
    }
    
    return config;
  });

  // Response interceptor for error handling
  instance.interceptors.response.use((response: AxiosResponse) => response,async (error: AxiosError) => {
      
       const originalRequest = error.config;

      // Handle token refresh for 401 errors if not already retrying
      if (error.response?.status === 401 && originalRequest && !originalRequest.headers['x-retry']) {
        console.log('Attempting token refresh for 401 error...');
        
        // Check if this is a retry attempt to prevent infinite loops
        const retryCount = parseInt(originalRequest.headers['x-retry-count'] || '0');
        if (retryCount >= 2) {
          console.error('Maximum retry attempts reached, redirecting to login');
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          // Only redirect if in authenticated context and haven't already attempted redirect
          if (isAuthenticatedContext() && !redirectAttempted) {
            redirectAttempted = true;
            window.location.href = '/login';
          }
          return Promise.reject(new Error('Maximum retry attempts reached'));
        }
        try {
          // Call refresh token endpoint
          const checkRefresh = await instance.post('/auth/refresh-token');
          console.log('Token refresh response:', checkRefresh.data);
          
          if (!checkRefresh.data.success) {
            console.error('Token refresh failed:', checkRefresh.data);
            throw new Error('Token refresh failed');
          }

          // Update the access token in cookies
          const isProduction = window.location.protocol === 'https:';
          const secureFlag = isProduction ? '; secure' : '';
          
          const sameSiteValue = isProduction ? 'none' : 'lax';
          // Remove domain flag for localhost compatibility
          document.cookie = `access_token=${checkRefresh.data.data.accessToken}; path=/${secureFlag}; samesite=${sameSiteValue}`;
          document.cookie = `csrf_token=${checkRefresh.data.data.csrfToken}; path=/${secureFlag}; samesite=${sameSiteValue}`;
          
          console.log('Tokens updated, retrying original request...');
          
          // Retry the original request with retry header
          const retryConfig = {
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              'x-retry': 'true',
              'x-retry-count': String(retryCount + 1)
            }
          };
          
          // Ensure we have the proper data for POST/PUT requests
          if (originalRequest.data) {
            retryConfig.data = originalRequest.data;
          }
          
          // Re-add CSRF token for retry requests
          const newCsrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrf_token='))
            ?.split('=')[1];
            
          if (newCsrfToken && retryConfig.method !== 'get') {
            (retryConfig.headers as any)['x-csrf-token'] = newCsrfToken;
            console.log('Added new CSRF token to retry request');
          }
          
          console.log('Retrying request with config:', {
            url: retryConfig.url,
            method: retryConfig.method,
            hasData: !!retryConfig.data
          });
          
          return instance(retryConfig);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          
          // Check if this is a 400 error from refresh token (invalid/expired refresh token)
          if ((refreshError as any)?.response?.status === 400) {
            console.log('Refresh token is invalid or expired, but keeping user on current page');
            // For 400 errors from refresh token, don't clear tokens or redirect
            // Just reject the original request without logging out the user
            return Promise.reject(new Error('Refresh token expired, please refresh the page or try again.'));
          }
          
          // For other refresh errors, clear tokens and redirect to login
          document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          
          // Only redirect if in authenticated context and haven't already attempted redirect
          if (isAuthenticatedContext() && !redirectAttempted) {
            redirectAttempted = true;
            window.location.href = '/login';
          }
          return Promise.reject(new Error('Session expired, please log in again.'));
        }
      }
      
      // Handle CSRF token validation errors specifically
      if (error.response?.status === 403 && (error.response?.data as any)?.message === 'CSRF token validation failed') {
        console.error('CSRF token validation failed');
        // Clear tokens and redirect to login
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'csrf_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        
        // Only redirect if not on a guest page and haven't already attempted redirect
        if (!isGuestPage(window.location.pathname) && !redirectAttempted) {
          redirectAttempted = true;
          window.location.href = '/login';
        }
        return Promise.reject(new Error('CSRF token validation failed'));
      }
      
      return Promise.reject(error.response);
    }
  );

  return instance;
};

// Create and export the API instance
const api = createApiInstance();
export default api;
