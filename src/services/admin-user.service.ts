import api, { ApiResult } from './index'

/**
 * User interface for admin operations
 */
export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  country?: string | null;
  role: 'USER' | 'ADMIN' | 'AGENT';
  isEmailVerified: boolean;
  lastLogin?: string | null;
  balance: number;
  defaultCurrency: string;
  deletedAt?: string | null;
  createdAt: string;
  devices?: Array<{
    id: string;
    deviceName: string;
    deviceStatus: string;
    createdAt: string;
  }>;
  paymentTransactions?: Array<{
    id: string;
    amount: number;
    status: string;
    paymentType: string;
    createdAt: string;
  }>;
  _count?: {
    devices: number;
    paymentTransactions: number;
  };
}

/**
 * User statistics interface
 */
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  deletedUsers: number;
  usersByRole: {
    USER: number;
    ADMIN: number;
    AGENT: number;
  };
  verifiedUsers: number;
  unverifiedUsers: number;
  registeredToday: number;
  registeredThisMonth: number;
  usersWithDevices: number;
  averageBalance: number;
}

/**
 * User filters interface
 */
export interface UserFilters {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  query?: string;
  isEmailVerified?: boolean;
  hasDevices?: boolean;
  startDate?: string;
  endDate?: string;
}

/**
 * Pagination response interface
 */
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  isNextPage: boolean;
  isPrevPage: boolean;
}

/**
 * Paginated users response interface
 */
export interface PaginatedUsersResponse {
  success: boolean;
  data: User[];
  pagination: PaginationResponse;
}

/**
 * User statistics response interface
 */
export interface UserStatisticsResponse {
  success: boolean;
  data: UserStats;
}

/**
 * User response interface
 */
export interface UserResponse {
  success: boolean;
  data: User;
}

/**
 * User analytics interface
 */
export interface UserAnalytics {
  dailyRegistrations: Array<{
    createdAt: Date;
    _count: { id: number };
  }>;
  roleDistribution: Array<{
    role: string;
    _count: { id: number };
  }>;
  verificationDistribution: Array<{
    isEmailVerified: boolean;
    _count: { id: number };
  }>;
}

/**
 * Admin User Service
 * Handles all admin user-related API operations
 */
export class AdminUserService {
  /**
   * Get all users with filtering and pagination (Admin only)
   * @param filters - Filter and pagination options
   * @returns Promise with paginated users data
   */
  static async getAllUsers(filters: UserFilters = {}): ApiResult<PaginatedUsersResponse> {
    const params: any = {};
    
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.role && filters.role !== 'all') params.role = filters.role;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.query) params.query = filters.query;
    if (filters.isEmailVerified !== undefined) params.isEmailVerified = filters.isEmailVerified;
    if (filters.hasDevices !== undefined) params.hasDevices = filters.hasDevices;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return api.get('/admin/users', { params });
  }

  /**
   * Get user statistics (Admin only)
   * @returns Promise with user statistics
   */
  static async getUserStatistics(): ApiResult<UserStatisticsResponse> {
    return api.get('/admin/users/statistics');
  }

  /**
   * Get user analytics (Admin only)
   * @param days - Number of days for analytics (default: 30)
   * @returns Promise with user analytics
   */
  static async getUserAnalytics(days: number = 30): ApiResult<{ success: boolean; data: UserAnalytics }> {
    return api.get('/admin/users/analytics', { params: { days } });
  }

  /**
   * Get user by ID (Admin only)
   * @param userId - The user ID
   * @returns Promise with user data
   */
  static async getUserById(userId: string): ApiResult<UserResponse> {
    return api.get(`/admin/users/${userId}`);
  }

  /**
   * Update user role (Admin only)
   * @param userId - The user ID
   * @param role - The new user role
   * @returns Promise with updated user data
   */
  static async updateUserRole(userId: string, role: User['role']): ApiResult<UserResponse> {
    return api.put(`/admin/users/${userId}/role`, { role });
  }

  /**
   * Toggle user email verification (Admin only)
   * @param userId - The user ID
   * @returns Promise with updated user data
   */
  static async toggleEmailVerification(userId: string): ApiResult<UserResponse> {
    return api.put(`/admin/users/${userId}/email-verification`);
  }

  /**
   * Delete user (Admin only)
   * @param userId - The user ID
   * @returns Promise with deletion confirmation
   */
  static async deleteUser(userId: string): ApiResult<{ success: boolean; message: string }> {
    return api.delete(`/admin/users/${userId}`);
  }

  /**
   * Restore deleted user (Admin only)
   * @param userId - The user ID
   * @returns Promise with restoration confirmation
   */
  static async restoreUser(userId: string): ApiResult<{ success: boolean; message: string }> {
    return api.put(`/admin/users/${userId}/restore`);
  }
}

export default AdminUserService;
