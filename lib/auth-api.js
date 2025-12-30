import { apiClient } from './api-client';

export const authApi = {
  /**
   * Request OTP for signup (Step 1)
   */
  requestSignupOtp: async (email) => {
    return apiClient.request('/auth/signup/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Verify OTP and complete signup with password (Step 2)
   */
  verifySignupOtp: async (name, email, password, otp) => {
    return apiClient.request('/auth/signup/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, otp })
    });
  },

  /**
   * Login with email and password
   */
  login: async (email, password) => {
    return apiClient.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  /**
   * Request password reset OTP
   */
  requestPasswordReset: async (email) => {
    return apiClient.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Reset password with OTP
   */
  resetPassword: async (email, otp, newPassword) => {
    return apiClient.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword })
    });
  },

  /**
   * Get Google OAuth URL
   */
  getGoogleAuthUrl: () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return `${apiUrl}/auth/google`;
  },

  /**
   * Logout (clears httpOnly cookies on server)
   */
  logout: async () => {
    try {
      await apiClient.request('/auth/logout', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    apiClient.clearUserData();
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    return apiClient.request('/auth/me', {
      method: 'GET'
    });
  },

  /**
   * Get current user from localStorage (for quick access)
   */
  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  /**
   * Save user to localStorage
   */
  saveUser: (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  /**
   * Clear user from localStorage
   */
  clearUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
};
