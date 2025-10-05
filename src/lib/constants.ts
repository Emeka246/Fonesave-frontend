/**
 * Environment configuration service
 * Provides type-safe access to environment variables
 */

interface AppConfig {
  apiBaseUrl: string;
  appName: string;
  appVersion: string;
  enableAnalytics: boolean;
  enableDebug: boolean;
  googleAnalyticsId?: string;
  sentryDsn?: string;
  googleAuthUrl?: string;
  cookieDomain?: string;
}

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    return {
      apiBaseUrl: this.getEnvVar('VITE_API_BASE_URL', 'http://localhost:4000/api'),
      appName: this.getEnvVar('VITE_APP_NAME', 'FonSave'),
      appVersion: this.getEnvVar('VITE_APP_VERSION', '1.0.0'),
      enableAnalytics: this.getBooleanEnvVar('VITE_ENABLE_ANALYTICS', false),
      enableDebug: this.getBooleanEnvVar('VITE_ENABLE_DEBUG', false),
      googleAuthUrl: `${this.getEnvVar('VITE_API_BASE_URL', 'http://localhost:4000/api')}/${this.getOptionalEnvVar('VITE_GOOGLE_AUTH_URL')}`,
      cookieDomain: this.getOptionalEnvVar('VITE_COOKIE_DOMAIN'),
    };
  }

  private getEnvVar(key: string, defaultValue: string): string {
    const value = import.meta.env[key];
    if (value === undefined || value === '') {
      return defaultValue;
    }
    return value;
  }

  private getOptionalEnvVar(key: string): string | undefined {
    const value = import.meta.env[key];
    return value === undefined || value === '' ? undefined : value;
  }

  private getBooleanEnvVar(key: string, defaultValue: boolean): boolean {
    const value = import.meta.env[key];
    if (value === undefined || value === '') {
      return defaultValue;
    }
    return value.toLowerCase() === 'true';
  }

  // Getters for easy access
  get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  get appName(): string {
    return this.config.appName;
  }

  get appVersion(): string {
    return this.config.appVersion;
  }

  get enableAnalytics(): boolean {
    return this.config.enableAnalytics;
  }

  get enableDebug(): boolean {
    return this.config.enableDebug;
  }
  get googleAuthUrl(): string | undefined {
    return this.config.googleAuthUrl;
  }

  get cookieDomain(): string | undefined {
    return this.config.cookieDomain;
  }

  get isDevelopment(): boolean {
    return import.meta.env.DEV;
  }

  get isProduction(): boolean {
    return import.meta.env.PROD;
  }

  get mode(): string {
    return import.meta.env.MODE;
  }

  // Get all config for debugging
  getAll(): AppConfig & { isDevelopment: boolean; isProduction: boolean; mode: string } {
    return {
      ...this.config,
      isDevelopment: this.isDevelopment,
      isProduction: this.isProduction,
      mode: this.mode,
    };
  }
}

// Export singleton instance
export const config = new ConfigService();

// Export types for use in other files
export type { AppConfig };
