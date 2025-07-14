import api from './api.js';

// Authentication service
const authService = {
  // Register a new user
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.status === 'success') {
      api.setToken(response.token);
    }
    return response;
  },

  // Login user
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.status === 'success') {
      api.setToken(response.token);
    }
    return response;
  },

  // Get current user profile
  async getCurrentUser() {
    return await api.get('/auth/me');
  },

  // Logout user
  logout() {
    api.removeToken();
  },

  // Check if user is authenticated
  isAuthenticated() {
    return api.isAuthenticated();
  }
};

export default authService;
