import api from './api.js';

// Product Services
export const productService = {
  
  // Get all products
  getAllProducts: async (params = {}) => {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  // Get product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/products/${productId}/`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await api.post('/products/', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}/`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}/`);
    return response.data;
  },

  // Search products
  searchProducts: async (query) => {
    const response = await api.get(`/products/search/`, { params: { q: query } });
    return response.data;
  },

};
