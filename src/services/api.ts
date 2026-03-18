import axios from 'axios';

// Create an axios instance with our backend URL as the base
const api = axios.create({
  baseURL: '/api', // This proxies to http://localhost:5000/api (via vite.config.ts)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== REQUEST INTERCEPTOR =====
// This runs BEFORE every request is sent
// We use it to automatically attach the JWT token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Add token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== RESPONSE INTERCEPTOR =====
// This runs AFTER every response comes back
// We use it to handle auth errors globally (e.g., expired token)
api.interceptors.response.use(
  (response) => response, // If OK, just return the response
  (error) => {
    // If server says 401 Unauthorized (token expired/invalid)
    if (error.response?.status === 401) {
      // Clear stored auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
