import axios from 'axios';

// Determine the base URL for the API
const getBaseURL = () => {
  // Priority 1: Environment variable
  let url = (import.meta as any).env?.VITE_API_URL;
  
  // Priority 2: Fallback based on environment
  if (!url) {
    url = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://bodega-backend-g49y.onrender.com';
  }

  // Ensure the URL always ends with /api for consistency
  // This prevents 404 errors if the env var is missing the suffix
  return url.endsWith('/api') ? url : `${url}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
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
