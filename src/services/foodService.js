import api from './api';

const foodService = {
  // Get all active foods
  getAllFoods: async () => {
    const response = await api.get('/foods');
    return response.data;
  },

  // Get all foods (admin only)
  getAllFoodsAdmin: async () => {
    const response = await api.get('/foods/all');
    return response.data;
  },

  // Get food by ID
  getFoodById: async (id) => {
    const response = await api.get(`/foods/${id}`);
    return response.data;
  },

  // Get foods by category
  getFoodsByCategory: async (category) => {
    const response = await api.get(`/foods/category/${category}`);
    return response.data;
  },

  // Get combos
  getCombos: async () => {
    const response = await api.get('/foods/combos');
    return response.data;
  },

  // Create new food (admin only)
  createFood: async (foodData) => {
    const response = await api.post('/foods', foodData);
    return response.data;
  },

  // Update food (admin only)
  updateFood: async (id, foodData) => {
    const response = await api.put(`/foods/${id}`, foodData);
    return response.data;
  },

  // Delete food (admin only)
  deleteFood: async (id) => {
    const response = await api.delete(`/foods/${id}`);
    return response.data;
  }
};

export default foodService;
