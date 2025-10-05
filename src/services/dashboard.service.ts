import api, { ApiResult } from './index';

/**
 * Dashboard API response interfaces
 */
export interface DashboardApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Dashboard API Response Types
export interface DashboardStats {
  totalUsers: number;
  totalDevices: number;
  totalRevenue: number;
  totalRegistrations: number;
  activeAgents: number;
  recentRegistrations: RecentRegistration[];
  monthlyGrowth: {
    users: number;
    devices: number;
    revenue: number;
  };
}

export interface RecentRegistration {
  id: string;
  header: string;
  type: string;
  status: 'Done' | 'In Process';
  target: string;
  limit: string;
  reviewer: string;
  createdAt: string;
  deviceName: string;
}



/**
 * Dashboard Service
 * Handles all dashboard-related API operations
 */
export class DashboardService {
  /**
   * Get comprehensive dashboard data
   * @returns Promise with dashboard statistics and overview data
   */
  static async getDashboardData(): ApiResult<DashboardStats> {
    return api.get('/admin/dashboard');
  }
}

export default DashboardService;