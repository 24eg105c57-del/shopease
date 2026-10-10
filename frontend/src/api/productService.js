import apiClient from './axios';

/**
 * Service to interact with Spring Boot REST API endpoints.
 */
export const productService = {
  /**
   * Check backend server health status
   * Endpoint: GET /api/health
   */
  async getHealth() {
    const response = await apiClient.get('/api/health');
    return response.data;
  },

  /**
   * Fetch paginated products with optional filters
   * Endpoint: GET /api/products
   */
  async getProducts(params = {}) {
    const response = await apiClient.get('/api/products', { params });
    // Spring Data JPA returns a Page object, so products are in data.content
    return response.data?.data || { content: [], totalElements: 0, totalPages: 0 };
  },

  /**
   * Fetch a single product by ID
   * Endpoint: GET /api/products/{id}
   */
  async getProductById(id) {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data?.data;
  },

  /**
   * Create a new product
   * Endpoint: POST /api/products
   */
  async createProduct(productData) {
    const response = await apiClient.post('/api/products', productData);
    return response.data?.data;
  },

  /**
   * Update an existing product
   * Endpoint: PUT /api/products/{id}
   */
  async updateProduct(id, productData) {
    const response = await apiClient.put(`/api/products/${id}`, productData);
    return response.data?.data;
  },

  /**
   * Delete a product
   * Endpoint: DELETE /api/products/{id}
   */
  async deleteProduct(id) {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data?.data;
  }
};
