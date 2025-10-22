import api, { ApiResult } from './index'

/**
 * Payment transaction interface for admin operations
 */
export interface PaymentTransaction {
  id: string;
  userId: string;
  reference: string;
  amount: number; // Amount in kobo (smallest currency unit)
  currency: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';
  paymentType: 'DEVICE_REGISTRATION' | 'WALLET_FUNDING' | 'FREE_REGISTRATION';
  description?: string;
  paystackReference?: string;
  paystackAccessCode?: string;
  paystackTransactionId?: string;
  paidAt?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string | null;
    role?: string;
    phone?: string;
  };
  deviceRegistration?: {
    id: string;
    deviceId?: string;
    registrationType: string;
    expiryDate?: string;
    isFreeRegistration: boolean;
    ownerEmail?: string;
    ownerPhone?: string;
    accountCreated: boolean;
    device?: {
      id: string;
      deviceName: string;
      imei1: string;
      imei2?: string;
      deviceBrand?: string;
      deviceModel?: string;
      deviceSerial?: string;
      deviceOs?: string;
      deviceStatus?: string;
    };
    agent?: {
      id: string;
      email: string;
      fullName: string;
    };
  };
}

/**
 * Payment statistics interface
 */
export interface PaymentStats {
  totalTransactions: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  cancelledTransactions: number;
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  averageTransactionValue: number;
}

/**
 * Payment filters interface
 */
export interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  query?: string;
  userId?: string;
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
 * Paginated payments response interface
 */
export interface PaginatedPaymentsResponse {
  data: PaymentTransaction[];
  pagination: PaginationResponse;
}

/**
 * Payment statistics response interface
 */
export interface PaymentStatisticsResponse {
  success: boolean;
  data: PaymentStats;
}

/**
 * Payment list response interface
 */
export interface PaymentListResponse {
  success: boolean;
  data: PaymentTransaction[];
  pagination: PaginationResponse;
}

/**
 * Payment response interface
 */
export interface PaymentResponse {
  success: boolean;
  data: PaymentTransaction;
}

/**
 * Payment analytics interface
 */
export interface PaymentAnalytics {
  dailyRevenue: Array<{
    createdAt: Date;
    _sum: { amount: number | null };
    _count: { id: number };
  }>;
  paymentTypeDistribution: Array<{
    paymentType: string;
    _count: { id: number };
    _sum: { amount: number | null };
  }>;
  statusDistribution: Array<{
    status: string;
    _count: { id: number };
  }>;
}

/**
 * Admin Payment Service
 * Handles all admin payment-related API operations
 */
export class AdminPaymentService {
  /**
   * Get all payment transactions with filtering and pagination (Admin only)
   * @param filters - Filter and pagination options
   * @returns Promise with paginated payments data
   */
  static async getAllPayments(filters: PaymentFilters = {}): ApiResult<PaymentListResponse> {
    const params: any = {};
    
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.type && filters.type !== 'all') params.type = filters.type;
    if (filters.query) params.query = filters.query;
    if (filters.userId) params.userId = filters.userId;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    return api.get('/admin/payments', { params });
  }

  /**
   * Get payment statistics (Admin only)
   * @returns Promise with payment statistics
   */
  static async getPaymentStatistics(): ApiResult<PaymentStatisticsResponse> {
    return api.get('/admin/payments/statistics');
  }

  /**
   * Get payment analytics (Admin only)
   * @param days - Number of days for analytics (default: 30)
   * @returns Promise with payment analytics
   */
  static async getPaymentAnalytics(days: number = 30): ApiResult<{ success: boolean; data: PaymentAnalytics }> {
    return api.get('/admin/payments/analytics', { params: { days } });
  }

  /**
   * Get payment by ID (Admin only)
   * @param paymentId - The payment ID
   * @returns Promise with payment data
   */
  static async getPaymentById(paymentId: string): ApiResult<PaymentResponse> {
    return api.get(`/admin/payments/${paymentId}`);
  }

  /**
   * Update payment status (Admin only)
   * @param paymentId - The payment ID
   * @param status - The new payment status
   * @returns Promise with updated payment data
   */
  static async updatePaymentStatus(paymentId: string, status: PaymentTransaction['status']): ApiResult<PaymentResponse> {
    return api.put(`/admin/payments/${paymentId}/status`, { status });
  }

  /**
   * Delete payment transaction (Admin only)
   * @param paymentId - The payment ID
   * @returns Promise with deletion confirmation
   */
  static async deletePayment(paymentId: string): ApiResult<{ success: boolean; message: string }> {
    return api.delete(`/admin/payments/${paymentId}`);
  }
}

export default AdminPaymentService;
