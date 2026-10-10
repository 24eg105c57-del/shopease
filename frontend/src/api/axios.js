import axios from 'axios';

// Create configured Axios instance
// Uses baseURL pointing directly to Spring Boot backend, compatible with CORS configuration
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor to attach JWT Authorization Bearer header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopease_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling and 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear expired credentials if rejected
      const hadToken = !!localStorage.getItem('shopease_token');
      if (hadToken) {
        localStorage.removeItem('shopease_token');
        localStorage.removeItem('shopease_user');
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    console.error('[API Error]:', message, error);
    return Promise.reject(error);
  }
);

export default apiClient;
