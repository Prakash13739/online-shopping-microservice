import axios from 'axios';

let activityLogger = null;

export const setGlobalActivityLogger = (logger) => {
  activityLogger = logger;
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() };
    const token = localStorage.getItem('shopsphere_token');
    const user = JSON.parse(localStorage.getItem('shopsphere_user') || 'null');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (user && user.id) {
      config.headers['X-User-Id'] = user.id.toString();
      if (user.role) {
        config.headers['X-User-Role'] = user.role;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - (response.config.metadata?.startTime || new Date());
    if (activityLogger) {
      const url = response.config.url || '';
      let service = 'API Gateway';
      if (url.includes('/auth')) service = 'Auth Service';
      else if (url.includes('/users')) service = 'User Service';
      else if (url.includes('/products') || url.includes('/categories')) service = 'Product Service';
      else if (url.includes('/inventory')) service = 'Inventory Service';
      else if (url.includes('/cart')) service = 'Cart Service';
      else if (url.includes('/orders')) service = 'Order Service';
      else if (url.includes('/payments')) service = 'Payment Service';
      else if (url.includes('/notifications')) service = 'Notification Service';

      activityLogger({
        method: response.config.method?.toUpperCase() || 'GET',
        endpoint: url,
        status: response.status,
        duration: Math.max(8, duration),
        service,
      });
    }
    return response.data;
  },
  (error) => {
    const duration = new Date() - (error.config?.metadata?.startTime || new Date());
    if (activityLogger && error.config) {
      activityLogger({
        method: error.config.method?.toUpperCase() || 'GET',
        endpoint: error.config.url || '',
        status: error.response?.status || 500,
        duration: Math.max(12, duration),
        service: 'API Gateway / Microservice',
      });
    }
    if (error.response?.status === 401) {
      // Clear token on 401 if needed
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
