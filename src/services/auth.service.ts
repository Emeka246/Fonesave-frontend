import api, {ApiResult, type ApiResponse} from './index';
import { hasAuthTokens } from '@/lib/auth-utils';

/**
 * Authentication types
 */
export interface RegisterUserData {
  email: string;
  password: string;
}

export interface OnboardingData {
  userId: string;
  fullName: string;
  phone: string;
  role: 'USER' | 'AGENT';
  country?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type { ApiResponse };


export const ç = async (): ApiResult => {
    return api.get('/constants');
};

/**
 * Register a new user
 * @param userData User registration data
 */
export const register = async (userData: RegisterUserData): ApiResult => {
    return api.post('/auth/register', userData);
};

/**
 * Login user
 * @param credentials Login credentials
 */
export const login = async (credentials: LoginCredentials): ApiResult => {
    return api.post('/auth/login', credentials);
};

/**
 * Logout user
 */
export const logout = async (): ApiResult => {
    try {
        // Try regular logout first (with CSRF protection)
        return await api.post('/auth/logout');
    } catch (error: any) {
        // If CSRF token is missing (403 error), try force logout
        if (error.response?.status === 403 && error.response?.data?.message?.includes('CSRF')) {
            console.log('CSRF token missing, attempting force logout');
            return await api.post('/auth/logout-force');
        }
        // Re-throw other errors
        throw error;
    }
};

/**
 * Refresh authentication token
 */
export const refreshToken = async (): ApiResult => {
    if (!hasAuthTokens()) {
        return Promise.reject(new Error('No auth tokens present'));
    }
    return api.post('/auth/refresh-token');
};

/**
 * Verify user email
 * @param token Verification token
 */
export const verifyEmail = async (code: string): ApiResult => {
    return api.post('/auth/verify-email', { code });
};

/**
 * Resend verification email
 * @param email User email
 */
export const resendVerificationEmail = async (email: string): ApiResult => {
    return api.post('/auth/resend-verification-email', { email });
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async (): ApiResult => {
    return api.get('/auth/me');
};


/**
 * Request reset password
 * @param email 
 * @returns 
 */
export const resetPasswordRequest = async (email: string): ApiResult => {
    return api.post('/auth/reset-password-request', { email });
}

/**
 * Set new password using reset token
 * @param token Reset token
 * @param newPassword New password
 */
export const setNewPassword = async (token: string, newPassword: string): ApiResult => {
    return api.post('/auth/set-new-password', { token, newPassword });
}

export const unlinkSocialAccount = async (password: string): ApiResult => {
    return api.post('/auth/unlink-social-account', { password });
}

export const verifyResetToken = async (token: string): ApiResult => {
    return api.get(`/auth/verify-reset-token?token=${token}`);
}

/**
 * Complete user onboarding
 * @param onboardingData User onboarding data
 */
export const completeOnboarding = async (onboardingData: OnboardingData): ApiResult => {
    return api.post('/auth/complete-onboarding', onboardingData);
}

/**
 * Check if user token is valid
 * @param token Registration token
 * @returns 
 */
export const checkUserToken = async (token: string): ApiResult => {
    return api.get(`/auth/check-user-token?token=${token}`);
}

/**
 * Complete agent registration using token
 * @param data Registration data
 * @returns 
 */
export const completeAgentRegistration = async (data: {
    token: string;
    password: string;
    fullName: string;
    phone: string;
    country?: string;
}): ApiResult => {
    return api.post('/auth/complete-agent-registration', data);
}

/**
 * Check if user exists by email
 * @param email User email to check
 * @returns Promise with user existence status
 */
export const checkUserExists = async (email: string): ApiResult<{ exists: boolean; user?: any }> => {
    return api.get(`/auth/check-user-email?email=${encodeURIComponent(email)}`);
}

