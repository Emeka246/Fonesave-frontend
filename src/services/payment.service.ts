import api, { ApiResult } from './index';

/**
 * Payment Transaction interfaces
 */
export interface PaymentTransaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reference: string;
  paymentType: PaymentType;
  deviceRegistrationId?: string;
  walletFundingId?: string;
  gatewayResponse?: string;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED'
}

export enum PaymentType {
  DEVICE_REGISTRATION = 'DEVICE_REGISTRATION',
  WALLET_FUNDING = 'WALLET_FUNDING'
}

/**
 * Device registration payment payload
 */
export interface DeviceRegistrationPaymentPayload {
  deviceId: string;
  currency: string;
}

/**
 * Wallet funding payment payload (for agents only)
 */
export interface WalletFundingPayload {
  amount: number; // in kobo
  currency?: 'NGN'; // Only allow Naira
}

/**
 * Payment response interfaces
 */
export interface PaymentInitResponse {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
}

export interface PaymentVerificationResponse {
  status: PaymentStatus;
  reference: string;
  transaction: PaymentTransaction;
}

export interface TransactionsListResponse {
  transactions: PaymentTransaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    isNextPage: boolean;
    isPrevPage: boolean;
  };
}



/**
 * User registration completion payload
 */
export interface CompleteRegistrationPayload {
  registrationId: string;
  password: string;
  fullName: string;
}

export interface TopupRequest {
  amount: number; // in kobo
  paymentMethodId?: string;
}

/**
 * Payment Service
 * Handles all payment-related API operations
 */
export class PaymentService {

  /**
   * Verify payment by reference
   * @param reference - Payment reference
   * @returns Promise with payment verification data
   */
  static async verifyPayment(reference: string): ApiResult<PaymentVerificationResponse> {
    return api.get(`/payment/verify-transaction`, { params: { reference } });
  }

  /**
   * Get billing overview
   */
  static async getBillingOverview() {
      return await api.get('/payment/billing-overview');
  }

  /*
  * Get Billing History 
  */
  static async getBillingHistory(limit = 10, offset = 0) {
    return await api.get(`/payment/billing-history?limit=${limit}&offset=${offset}`);
  }

  /**
   * Get agent registration statistics
   * @returns Promise with agent statistics
   */
  static async getAgentRegistrationStats(): ApiResult {
    return api.get('/payment/agent-stats');
  }

  static async topupAccount(data: TopupRequest) {
    return await api.post('/payment/topup-agent-wallet', data);
  }


  static async downloadBillingHistory(format = 'csv'){
  try {
    const response = await api.get(`/payment/export-billing-history?format=${format}`, {
      responseType: 'blob'
    });
    
    // Create a download link and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `billing-history-${Date.now()}.${format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Download billing history failed:', error);
    throw error;
  }
  };
}

export default PaymentService;
