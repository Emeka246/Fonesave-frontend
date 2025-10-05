

export interface StatsCard {
  title: string;
  value: string | number;
  description: string;
  trend: {
    value: number;
    isPositive: boolean;
  };
  icon?: string;
}



export interface AnalyticsData {
  userGrowth: Array<{ date: string; count: number }>;
  deviceRegistrations: Array<{ date: string; count: number }>;
  revenue: Array<{ date: string; amount: number }>;
  deviceStatusDistribution: Array<{ status: string; count: number }>;
  paymentStatusDistribution: Array<{ status: string; count: number }>;
}

export interface DashboardApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Frontend Dashboard Item (for backward compatibility with existing UI)
export interface DashboardItem {
  id: number;
  header: string;
  type: string;
  status: 'Done' | 'In Process';
  target: string;
  limit: string;
  reviewer: string;
}

// API Request Parameters
export interface DashboardFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
  period?: '7d' | '30d' | '90d';
}
