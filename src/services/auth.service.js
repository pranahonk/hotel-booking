import api from './api.js';

const authService = {
      async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.token) {
      api.setToken(response.token);
      // Extract user from the nested structure if it exists
      if (response.data && response.data.user) {
        return {
          status: response.status,
          user: response.data.user,
          token: response.token
        };
      }
    }
    return response;
  },


  // Login user
  // Example: { "email": "john@example.com", "password": "password123" }
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.token) {
      api.setToken(response.token);
      // Extract user from the nested structure if it exists
      if (response.data && response.data.user) {
        return {
          status: response.status,
          user: response.data.user,
          token: response.token
        };
      }
    }
    return response;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    // Extract user from the nested structure if it exists
    if (response.data && response.data.user) {
      return {
        status: response.status,
        user: response.data.user
      };
    }
    return response;
  },

  logout() {
    api.removeToken();
  },


  isAuthenticated() {
    return api.isAuthenticated();
  }
};

export default authService;
