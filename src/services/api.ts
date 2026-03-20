import axios from 'axios';

// Determine the base URL for the API
const getBaseURL = () => {
  // Use Vercel specific logic to ensure the production backend is used when live
  const isProduction = window.location.hostname !== 'localhost';
  
  // Priority 1: Environment variable (if explicitly set)
  let url = (import.meta as any).env?.VITE_API_URL;
  
  // Priority 2: Fallback based on domain
  if (!url) {
    url = isProduction 
      ? 'https://bodega-backend-g49y.onrender.com' 
      : 'http://localhost:5000';
  }

  // Final Clean: Remove trailing slash if present, then ensure it ends with /api
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
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
