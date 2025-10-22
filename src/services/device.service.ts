import api, { ApiResult } from './index'

/**
 * Device registration payload interface
 */
export interface DeviceRegistrationPayload {
    imei1: string;
    imei2?: string | null;
    deviceBrand?: string | null;
    deviceModel?: string | null;
    deviceCondition?: string | null;
    deviceName: string;
    deviceStatus: string;
    deviceSerial?: string | null;
    deviceOs?: string | null;
    purchaseDate?: Date | null;
    purchasePrice?: number | null;
    purchaseStore?: string | null;
    purchaseNote?: string | null;
    emergencyContact?: string | null;
    ownerEmail?: string | null;
    ownerPhone?: string | null;
    payFromBalance?: boolean | null;
    isOwnerSelfRegistration?: boolean | null;
}

/**
 * Device response interface
 */
export interface DevicePayload {
  id: string;
  userId: string;
  imei1: string;
  imei2?: string | null;
  deviceBrand?: string | null;
  deviceModel?: string | null;
  deviceCondition?: string | null;
  deviceName: string;
  deviceStatus: string;
  deviceSerial?: string | null;
  deviceOs?: string | null;
  purchaseDate?: Date | null;
  purchasePrice?: number | null;
  purchaseStore?: string | null;
  purchaseNote?: string | null;
  emergencyContact?: string | null;
  ownerMessage?: string | null;
  ownerPhone?: string | null;
  ownerName?: string | null;
  ownerContactPhone?: string | null;
  isAuthenticated?: boolean;
  isOwner?: boolean;
  registrations: any[];
  createdAt: string;
  updatedAt: string;
}



/**
 * Payment information returned after device creation with payment
 */
export interface DevicePaymentResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  paymentId: string;
  amount?: number;
  currency?: string;
  expiryDate?: string;
  isFreeRegistration?: boolean;
}

/**
 * Device creation with payment response
 */
export interface DeviceWithPaymentResponse {
  device: DevicePayload;
  payment: DevicePaymentResponse;
}

/**
 * Pagination response interface
 */
export interface PaginationResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isNextPage: boolean;
  isPrevPage: boolean;
}

/**
 * Device list response interface
 */
export interface DeviceListResponse {
  success: boolean;
  data: DevicePayload[];
  pagination: PaginationResponse;
}

/**
 * Device statistics interface
 */
export interface DeviceStatistics {
  totalDevices: number;
  cleanDevices: number;
  stolenDevices: number;
  userBalance: number;
}

/**
 * Device statistics response interface
 */
export interface DeviceStatisticsResponse {
  success: boolean;
  data: DeviceStatistics;
}

// Device Status
export enum DeviceStatus {
  CLEAN = 'CLEAN',
  STOLEN = 'STOLEN',
  LOST = 'LOST',
  BLOCKED = 'BLOCKED',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Device Service
 * Handles all device-related API operations
 */
export class DeviceService {
  /**
   * Create a new device registration with optional payment initialization
   * @param deviceData - The device registration data
   * @returns Promise with the created device data and payment information if requested
   */
  static async createDevice(deviceData: DeviceRegistrationPayload): ApiResult<{
    success: boolean;
    message: string;
    data: DevicePayload | DeviceWithPaymentResponse;
    paymentError?: { message: string };
  }> {
    return api.post('/devices/create', deviceData)
  }


  /**
   * Get all devices for the current user with pagination
   * @param page - Page number (default: 1)
   * @param limit - Number of devices per page (default: 10)
   * @param status - Filter by device status (optional)
   * @returns Promise with paginated devices data
   */
  static async getDevices(page: number = 1, limit: number = 10, status?: string): ApiResult<DeviceListResponse> {
    const params: any = { page, limit };
    if (status && status !== 'all') {
      params.status = status;
    }
    return api.get('/devices/my-devices', { params })
  }

  /**
   * Get device statistics for the current user
   * @returns Promise with device statistics
   */
  static async getDeviceStatistics(): ApiResult<DeviceStatisticsResponse> {
    return api.get('/devices/my-statistics')
  }

  /**
   * Get a specific device by ID
   * @param deviceId - The device ID
   * @returns Promise with device data
   */
  static async getDeviceById(deviceId: string): ApiResult<DevicePayload> {
    return api.get(`/devices/${deviceId}`)
  }

  /**
   * Search a device by IMEI
   * @param imei - The IMEI number
   * @returns Promise with device data
   */
  static async searchDeviceByIMEI(imei: string): ApiResult<DevicePayload> {
    return api.get(`/devices/search-device-by-imei`, { params: { imei } })
  }

  static async searchDeviceByIMEIAuth(imei: string): ApiResult<DevicePayload> {
    return api.get(`/devices/search-device-by-imei-auth`, { params: { imei } })
  }

  

  /**
   * Update a device
   * @param deviceId - The device ID
   * @param deviceData - The updated device data
   * @returns Promise with the updated device data
   */
  static async updateDevice(deviceId: string, deviceData: Partial<DeviceRegistrationPayload>): ApiResult<DevicePayload> {
    return api.post(`/devices/update/${deviceId}`, deviceData)
  }

  /**
   * Delete a device
   * @param deviceId - The device ID
   * @returns Promise with deletion confirmation
   */
  static async deleteDevice(deviceId: string): ApiResult<{ message: string }> {
    return api.delete(`/devices/${deviceId}`)
  }

  /**
   * Update device status (stolen/lost) with optional message
   * @param deviceId - The device ID
   * @param status - The new status (STOLEN or LOST)
   * @param ownerMessage - Optional message from the owner
   * @returns Promise with updated device data
   */
  static async updateDeviceStatus(deviceId: string, status: 'STOLEN' | 'LOST', ownerMessage?: string, ownerPhone?: string): ApiResult<DevicePayload> {
    return api.patch(`/devices/${deviceId}/update-status`, { status, ownerMessage, ownerPhone })
  }
}



export interface InitiateTransferData {
  deviceId: string;
  transferMessage?: string;
  transferType?: 'selling' | 'giving' | 'others';
}

export interface TransferResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Initiate device ownership transfer
 */
export const initiateOwnershipTransfer = async (data: InitiateTransferData): Promise<TransferResponse> => {
  const response = await api.post('/devices/initiate-ownership-transfer', data);
  return response.data;
};


export default DeviceService