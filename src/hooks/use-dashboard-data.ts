import { useState, useEffect } from 'react';
import DashboardService from '@/services/dashboard.service';
import { 
  DashboardStats, 
  RecentRegistration,
} from '@/services/dashboard.service';

export function useDashboardData() {
  const [data, setData] = useState<RecentRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch dashboard data
        const dashboardData = await DashboardService.getDashboardData();
        
        setData(dashboardData.data?.data?.recentRegistrations || []);
        setDashboardStats(dashboardData.data?.data || null);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);



  return {
    data,
    isLoading,
    error,
    dashboardStats
  };
}