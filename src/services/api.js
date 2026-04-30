/**
 * Axios API Service
 * Configured with interceptors for auth token handling
 */

import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh & errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Auto-refresh token on 401
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original);
        } catch {
          // Refresh failed - clear auth
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }

    // Don't toast 401 (handled above) or validation errors handled by forms
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status !== 401 && error.response?.status !== 422) {
      // Toast only server errors, not client-side validation
      if (error.response?.status >= 500) {
        toast.error('Server error. Please try again.');
      }
    }

    return Promise.reject(error);
  }
);

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  refreshToken: (token) => api.post('/auth/refresh-token', { refreshToken: token }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
};

// ─── Products ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getPopular: () => api.get('/products/popular'),
  create: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (id, imageId) => api.delete(`/products/${id}/image/${imageId}`),
  delete: (id) => api.delete(`/products/${id}`),
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const categoryAPI = {
  getAll: (params) => api.get('/categories', { params }),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ─── Cart ─────────────────────────────────────────────────────────────────────
export const cartAPI = {
  get: () => api.get('/cart'),
  sync: (items) => api.post('/cart/sync', { items }),
  add: (productId, quantity, variantId) => api.post('/cart/add', { productId, quantity, variantId }),
  update: (itemId, quantity) => api.put(`/cart/item/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/item/${itemId}`),
  clear: () => api.delete('/cart/clear'),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id, reason) => api.post(`/orders/${id}/cancel`, { reason }),
  rate: (id, data) => api.post(`/orders/${id}/rate`, data),
  updateStatus: (id, status, note) => api.patch(`/orders/${id}/status`, { status, note }),
};

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createOrder: (orderId) => api.post('/payments/create-order', { orderId }),
  verify: (data) => api.post('/payments/verify', data),
  collectCod: (orderId) => api.post(`/payments/collect-cod/${orderId}`),
  refund: (orderId, reason) => api.post(`/payments/refund/${orderId}`, { reason }),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getOrders: (params) => api.get('/admin/orders', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/toggle-status`),
  getRevenueAnalytics: (params) => api.get('/admin/analytics/revenue', { params }),
};

// ─── Uploads ──────────────────────────────────────────────────────────────────
export const uploadAPI = {
  uploadBanner: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return api.post('/uploads/banner', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  deleteImage: (publicId) => api.delete('/uploads/image', { data: { publicId } }),
};

export default api;
