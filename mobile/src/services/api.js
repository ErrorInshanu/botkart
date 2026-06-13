import axios from 'axios';

const BASE_URL = 'https://botkart.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Orders
export const getOrders = () => api.get('/api/orders');
export const updateOrderStatus = (id, status) => api.put(`/api/orders/${id}/status`, { status });

// Products
export const getProducts = () => api.get('/api/products');
export const addProduct = (data) => api.post('/api/products', data);
export const editProduct = (id, data) => api.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

// Dashboard
export const getDashboard = () => api.get('/api/dashboard');

export default api;