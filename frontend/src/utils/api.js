import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';

    // Token expired → force logout
    if (error.response?.status === 401) {
      const event = new CustomEvent('auth:expired');
      window.dispatchEvent(event);
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
