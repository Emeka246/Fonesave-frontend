import api, { ApiResult } from './index'

/**
 * Device interface for admin operations
 */
export interface Device {
  id: string;
  userId: string;
  imei1: string;
  imei2?: string | null;
  deviceBrand?: string | null;
  deviceModel?: string | null;
  deviceCondition?: string | null;
  deviceName: string;
  deviceStatus: 'CLEAN' | 'STOLEN' | 'LOST' | 'BLOCKED' | 'UNKNOWN';
  deviceSerial?: string | null;
  deviceOs?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  purchaseStore?: string | null;
  purchaseNote?: string | null;
  emergencyContact?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string | null;
    role?: string;
  };
  registrations?: Array<{
    id: string;
    expiryDate?: string | null;
    ownerEmail?: string | null;
    ownerPhone?: string | null;
    accountCreated: boolean;
    registrationType: string;
    isFreeRegistration: boolean;
    createdAt: string;
  }>;
}

/**
 * Device statistics interface
 */
export interface DeviceStats {
  totalDevices: number;
  cleanDevices: number;
  stolenDevices: number;
  lostDevices: number;
  blockedDevices: number;
  unknownDevices: number;
  registeredThisMonth: number;
  registeredToday: number;
}

/**
 * Device filters interface
 */
export interface DeviceFilters {
  page?: number;
  limit?: number;
  status?: string;
  query?: string;
  userId?: string;
  deviceBrand?: string;
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
 * Paginated devices response interface
 */
export interface PaginatedDevicesResponse {
  data: Device[];
  pagination: PaginationResponse;
}

/**
 * Device statistics response interface
 */
export interface DeviceStatisticsResponse {
  success: boolean;
  data: DeviceStats;
}

/**
 * Device list response interface
 */
export interface DeviceListResponse {
  success: boolean;
  data: Device[];
  pagination: PaginationResponse;
}

/**
 * Device response interface
 */
export interface DeviceResponse {
  success: boolean;
  data: Device;
}

/**
 * Admin Device Service
 * Handles all admin device-related API operations
 */
export class AdminDeviceService {
  /**
   * Get all devices with filtering and pagination (Admin only)
   * @param filters - Filter and pagination options
   * @returns Promise with paginated devices data
   */
  static async getAllDevices(filters: DeviceFilters = {}): ApiResult<DeviceListResponse> {
    const params: any = {};
    
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    if (filters.status && filters.status !== 'all') params.status = filters.status;
    if (filters.query) params.query = filters.query;
    if (filters.userId) params.userId = filters.userId;
    if (filters.deviceBrand) params.deviceBrand = filters.deviceBrand;

    return api.get('/admin/devices', { params });
  }

  /**
   * Get device statistics (Admin only)
   * @returns Promise with device statistics
   */
  static async getDeviceStatistics(): ApiResult<DeviceStatisticsResponse> {
    return api.get('/admin/devices/statistics');
  }

  /**
   * Get device by ID (Admin only)
   * @param deviceId - The device ID
   * @returns Promise with device data
   */
  static async getDeviceById(deviceId: string): ApiResult<DeviceResponse> {
    return api.get(`/admin/devices/${deviceId}`);
  }

  /**
   * Update device status (Admin only)
   * @param deviceId - The device ID
   * @param status - The new device status
   * @returns Promise with updated device data
   */
  static async updateDeviceStatus(deviceId: string, status: Device['deviceStatus']): ApiResult<DeviceResponse> {
    return api.put(`/admin/devices/${deviceId}/status`, { status });
  }

  /**
   * Delete device (Admin only)
   * @param deviceId - The device ID
   * @returns Promise with deletion confirmation
   */
  static async deleteDevice(deviceId: string): ApiResult<{ success: boolean; message: string }> {
    return api.delete(`/admin/devices/${deviceId}`);
  }
}

export default AdminDeviceService;