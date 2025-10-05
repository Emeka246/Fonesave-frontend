import api, { ApiResult } from './index';

/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Contact form response interface
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
  data?: {
    submittedAt: string;
  };
}

/**
 * Contact Service
 * Handles contact form submissions
 */
export class ContactService {
  /**
   * Submit contact form
   * @param data Contact form data
   * @returns Promise with submission result
   */
  static async submitContactForm(data: ContactFormData): ApiResult<ContactFormResponse> {
    return api.post('/contact', data);
  }
}

export default ContactService;
