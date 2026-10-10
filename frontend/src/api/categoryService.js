import apiClient from './axios';

export const categoryService = {
  async getCategories() {
    const response = await apiClient.get('/api/categories');
    return response.data?.data || [];
  },

  async getCategoryById(id) {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data?.data;
  },

  async createCategory(categoryData) {
    const response = await apiClient.post('/api/categories', categoryData);
    return response.data?.data;
  },

  async updateCategory(id, categoryData) {
    const response = await apiClient.put(`/api/categories/${id}`, categoryData);
    return response.data?.data;
  },

  async deleteCategory(id) {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data?.data;
  }
};
