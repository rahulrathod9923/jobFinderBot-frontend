import axios from 'axios';

let tempBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
if (tempBaseUrl && !tempBaseUrl.endsWith('/api') && !tempBaseUrl.endsWith('/api/')) {
  tempBaseUrl = tempBaseUrl.endsWith('/') ? `${tempBaseUrl}api` : `${tempBaseUrl}/api`;
}
const API_BASE_URL = tempBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers[ 'Authorization' ] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Silent Token Refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call auth refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        originalRequest.headers[ 'Authorization' ] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        logOut();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const logOut = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');
  localStorage.removeItem('roles');
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export default api;
