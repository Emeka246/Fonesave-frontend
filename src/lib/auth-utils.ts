/**
 * Authentication utility functions
 */

/**
 * Check if user has authentication tokens in cookies
 */
export const hasAuthTokens = (): boolean => {
  if (typeof document === 'undefined') return false;
  
  const cookies = document.cookie.split('; ');
  console.log("Current cookies array:", document.cookie);
  const hasAccessToken = cookies.some(cookie => cookie.startsWith('access_token='));
  const hasRefreshToken = cookies.some(cookie => cookie.startsWith('refresh_token='));
  
  
  return hasAccessToken || hasRefreshToken;
};

/**
 * Get specific cookie value
 */
export const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  
  return null;
};

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = (): void => {
  console.log("Clearing auth cookies");
  if (typeof document === 'undefined') return;
  
  const authCookies = ['access_token', 'refresh_token', 'csrf_token'];
  const isProduction = window.location.protocol === 'https:';
  const secureFlag = isProduction ? '; secure' : '';
  const sameSiteValue = isProduction ? 'none' : 'lax';
  // Remove domain flag for localhost compatibility
  
  authCookies.forEach(cookieName => {
    const cookieString = `${cookieName}=; path=/${secureFlag}; samesite=${sameSiteValue}; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    document.cookie = cookieString;
    console.log(`Cleared cookie: ${cookieName}`);
  });
};
