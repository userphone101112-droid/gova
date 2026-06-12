/**
 * API Client Configuration
 * 
 * Centralized HTTP client using Axios with interceptors for error handling,
 * request/response transformation, and authentication.
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '@/configs/env';
import { logger } from './logger';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.API_BASE_URL,
      timeout: env.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add authentication token if available
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        logger.debug('API Request', {
          method: config.method,
          url: config.url,
          data: config.data,
        });

        return config;
      },
      (error) => {
        logger.error('API Request Error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        logger.debug('API Response', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error: AxiosError) => {
        this.handleResponseError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleResponseError(error: AxiosError) {
    const errorMessage = error.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;

    logger.error('API Response Error', error, {
      status: error.response?.status,
      url: error.config?.url,
      data: errorMessage,
    });

    // Handle specific error status codes
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or refresh token
      this.handleUnauthorized();
    } else if (error.response?.status === 403) {
      // Forbidden - handle permission error
      this.handleForbidden();
    } else if (error.response?.status === 500) {
      // Server error - handle gracefully
      this.handleServerError();
    }
  }

  private getAuthToken(): string | null {
    // Implement token retrieval logic
    // This could be from localStorage, cookies, or a state management solution
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private handleUnauthorized() {
    // Handle unauthorized access
    // Redirect to login page or refresh token
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  private handleForbidden() {
    // Handle forbidden access
    logger.warn('Access forbidden');
  }

  private handleServerError() {
    // Handle server errors
    logger.error('Server error occurred');
  }

  public get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
