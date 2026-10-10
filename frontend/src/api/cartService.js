import apiClient from './axios';

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get('/api/cart');
    return response.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const response = await apiClient.post('/api/cart', { productId, quantity });
    return response.data;
  },

  updateCartItem: async (itemId, quantity) => {
    const response = await apiClient.put(`/api/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (itemId) => {
    const response = await apiClient.delete(`/api/cart/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await apiClient.delete('/api/cart');
    return response.data;
  },
};
