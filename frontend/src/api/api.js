import axiosClient from './axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/api/auth/login', credentials),
  register: (data) => axiosClient.post('/api/auth/register', data),
  getMe: () => axiosClient.get('/api/auth/me'),
  getAllUsers: () => axiosClient.get('/api/auth/users'),
};

export const userApi = {
  getProfile: (userId) => axiosClient.get(`/api/users/${userId}`),
  updateProfile: (userId, data) => axiosClient.put(`/api/users/${userId}`, data),
  getAddresses: (userId) => axiosClient.get(`/api/users/${userId}/addresses`),
  addAddress: (userId, address) => axiosClient.post(`/api/users/${userId}/addresses`, address),
  updateAddress: (userId, addressId, address) => axiosClient.put(`/api/users/${userId}/addresses/${addressId}`, address),
  deleteAddress: (userId, addressId) => axiosClient.delete(`/api/users/${userId}/addresses/${addressId}`),
};

export const productApi = {
  getProducts: (params) => axiosClient.get('/api/products', { params }),
  getProductById: (id) => axiosClient.get(`/api/products/${id}`),
  createProduct: (product) => axiosClient.post('/api/products', product),
  updateProduct: (id, product) => axiosClient.put(`/api/products/${id}`, product),
  deleteProduct: (id) => axiosClient.delete(`/api/products/${id}`),
  getCategories: () => axiosClient.get('/api/categories'),
  getCategoryById: (id) => axiosClient.get(`/api/categories/${id}`),
  createCategory: (category) => axiosClient.post('/api/categories', category),
  deleteCategory: (id) => axiosClient.delete(`/api/categories/${id}`),
  getProductStats: () => axiosClient.get('/api/products/stats'),
};

export const cartApi = {
  getCart: (userId) => axiosClient.get('/api/cart', { params: { userId } }),
  addItem: (item, userId) => axiosClient.post('/api/cart/items', item, { params: { userId } }),
  updateQuantity: (productId, quantity, userId) => axiosClient.put(`/api/cart/items/${productId}`, { quantity }, { params: { userId } }),
  removeItem: (productId, userId) => axiosClient.delete(`/api/cart/items/${productId}`, { params: { userId } }),
  clearCart: (userId) => axiosClient.delete('/api/cart', { params: { userId } }),
};

export const orderApi = {
  getOrders: (params) => axiosClient.get('/api/orders', { params }),
  getOrderById: (id) => axiosClient.get(`/api/orders/${id}`),
  createOrder: (order) => axiosClient.post('/api/orders', order),
  updateOrderStatus: (id, status) => axiosClient.put(`/api/orders/${id}/status`, { status }),
  getAnalytics: () => axiosClient.get('/api/orders/analytics'),
};

export const inventoryApi = {
  getAll: () => axiosClient.get('/api/inventory'),
  getByProductId: (productId) => axiosClient.get(`/api/inventory/${productId}`),
  updateStock: (productId, data) => axiosClient.put(`/api/inventory/${productId}`, data),
  createInventory: (data) => axiosClient.post('/api/inventory', data),
  reserveStock: (data) => axiosClient.post('/api/inventory/reserve', data),
  releaseStock: (data) => axiosClient.post('/api/inventory/release', data),
  getStats: () => axiosClient.get('/api/inventory/stats'),
};

export const paymentApi = {
  getAll: (params) => axiosClient.get('/api/payments', { params }),
  getById: (id) => axiosClient.get(`/api/payments/${id}`),
  getByOrderId: (orderId) => axiosClient.get(`/api/payments/order/${orderId}`),
  refund: (id) => axiosClient.post(`/api/payments/${id}/refund`),
};

export const notificationApi = {
  getNotifications: (userId) => axiosClient.get('/api/notifications', { params: { userId } }),
  getUnreadCount: (userId) => axiosClient.get('/api/notifications/unread-count', { params: { userId } }),
  markAsRead: (id) => axiosClient.put(`/api/notifications/${id}/read`),
  markAllAsRead: (userId) => axiosClient.put('/api/notifications/read-all', null, { params: { userId } }),
};

export const healthApi = {
  checkService: async (serviceName, url) => {
    const startTime = Date.now();
    try {
      const resp = await axiosClient.get(url, { timeout: 3000 });
      const latency = Date.now() - startTime;
      return {
        name: serviceName,
        status: 'ONLINE',
        latency,
        details: resp.data || resp,
        lastChecked: new Date().toLocaleTimeString(),
      };
    } catch (e) {
      const latency = Date.now() - startTime;
      return {
        name: serviceName,
        status: 'OFFLINE',
        latency,
        error: e.message,
        lastChecked: new Date().toLocaleTimeString(),
      };
    }
  },
};
