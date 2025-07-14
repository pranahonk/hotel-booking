import api from './api.js';

// Authentication service
const authService = {
  async register(userData) {
    const response = await api.post('/api/auth/register', userData);
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  },


  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials);
    if (response.token) {
      api.setToken(response.token);
    }
    return response;
  },

  async getCurrentUser() {
    return await api.get('/api/auth/me');
  },

  logout() {
    api.removeToken();
  },


  isAuthenticated() {
    return api.isAuthenticated();
  }
};

export default authService;
