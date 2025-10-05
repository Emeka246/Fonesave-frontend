import api, {ApiResult} from './index';

/**
 * User profile types
 */
export interface UserProfileData {
  fullName?: string;
  phone?: string;
  country?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface EmailChangeRequestData {
  newEmail: string;
  password: string;
}


/**
 * Get current user profile
 */
export const getProfile = async (): ApiResult => {
    return api.get('/users/profile');
}

/**
 * Update user profile details
 * @param userData User profile data to update
 */
export const updateProfile = async (userData: UserProfileData): ApiResult => {
    return api.put('/user/profile', userData);
}

/**
 * Change user password
 * @param passwordData Password change data
 */
export const changePassword = async (passwordData: PasswordChangeData): ApiResult => {
    return api.post('/user/change-password', passwordData);
}

/**
 * Request email change
 * @param emailData New email data
 */
export const requestEmailChange = async (emailData: EmailChangeRequestData): ApiResult => {
    return api.post('/user/change-email/request', emailData);
}

/**
 * Confirm email change
 * @param token Verification token
 */
export const confirmEmailChange = async (token: string): ApiResult => {
    return api.get(`/user/change-email/confirm?token=${token}`);
}

export const deleteAccount = async (): ApiResult => {
    return api.delete(`/user/account`);
}