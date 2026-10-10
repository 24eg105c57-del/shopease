import apiClient from './axios';

export const orderService = {
  createOrder: async (checkoutData) => {
    const response = await apiClient.post('/api/orders', checkoutData);
    return response.data;
  },

  getCustomerOrders: async () => {
    const response = await apiClient.get('/api/orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await apiClient.get(`/api/orders/${id}`);
    return response.data;
  },

  getAllOrders: async () => {
    const response = await apiClient.get('/api/orders?all=true');
    return response.data;
  },
};
