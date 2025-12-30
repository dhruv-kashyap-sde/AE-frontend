const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  /**
   * Clear user data from localStorage (not tokens - they're in httpOnly cookies)
   */
  clearUserData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }

  /**
   * Make an API request with credentials (cookies) included
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include' // Important: include cookies in requests
      });

      const data = await response.json();

      // Handle token refresh if access token expired (401)
      if (response.status === 401 && !options.skipRefresh) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry original request with new token (cookie will be updated)
          return this.request(endpoint, { ...options, skipRefresh: true });
        } else {
          // Refresh failed, clear user data
          this.clearUserData();
          throw new Error('Session expired. Please login again.');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token using httpOnly refresh cookie
   */
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Include cookies
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }
}

export const apiClient = new ApiClient();
