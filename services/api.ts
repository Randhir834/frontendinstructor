import axios from 'axios';
import API_BASE_URL from './apiConfig';

console.log('[API] Initializing with baseURL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use(
  (config) => {
    console.log('[API] Making request to:', config.baseURL + config.url);
    if (typeof window !== 'undefined') {
      // Don't add Authorization header for public auth endpoints
      const publicEndpoints = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/refresh-token'];
      const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
      
      if (!isPublicEndpoint) {
        const token = localStorage.getItem('token');
        const sessionToken = localStorage.getItem('sessionToken');
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        if (sessionToken) {
          config.headers['X-Session-Token'] = sessionToken;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Request failed:', error.message, error.config?.url);
    if (error.response) {
      console.error('[API] Response status:', error.response.status, error.response.data);
    } else {
      console.error('[API] No response received. Network error or CORS issue.');
    }
    
    // Handle 401 - Unauthorized (invalid/expired token)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('sessionToken');
        window.location.href = '/login';
      }
    }
    
    // Don't modify the error - let components handle user-friendly messages
    // via the errorHandler utility
    return Promise.reject(error);
  }
);

export default api;
