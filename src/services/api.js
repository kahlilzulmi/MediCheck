import axios from 'axios';

// Define base URLs for different environments
const PROD_URL = 'https://api.testmedi.online';
const DEV_URL = 'http://127.0.0.1:8000'; // Standard local development URL for Python backends

// Vite automatically sets `import.meta.env.DEV` to true in development
const API_URL = import.meta.env.DEV ? DEV_URL : PROD_URL;

// Create an Axios instance with the dynamic base URL
const api = axios.create({
  baseURL: API_URL,
});

// Use an interceptor to automatically add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Ensure the Authorization header is set correctly
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Export the configured instance as the default export
export default api;