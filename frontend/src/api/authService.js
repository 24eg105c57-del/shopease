import apiClient from './axios';

export const authService = {
  /**
   * Authenticate user with email and password
   * Returns { token, type, id, email, name, roles }
   */
  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  },

  /**
   * Register a new customer account
   */
  register: async ({ name, email, password, confirmPassword }) => {
    const response = await apiClient.post('/api/auth/register', {
      name,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  },

  /**
   * Fetch current authenticated user's profile
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
};
