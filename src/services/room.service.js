import api from './api.js';

// Room service
const roomService = {
  // Get all rooms with optional filtering
  async getRooms(filters = {}) {
    let queryString = '';
    
    if (Object.keys(filters).length > 0) {
      const params = new URLSearchParams();
      
      if (filters.price) params.append('price[lte]', filters.price);
      if (filters.capacity) params.append('capacity[gte]', filters.capacity);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      queryString = `?${params.toString()}`;
    }
    
    return await api.get(`/rooms${queryString}`);
  },

  // Get a single room by ID
  async getRoom(roomId) {
    return await api.get(`/rooms/${roomId}`);
  },

  // Check room availability for specific dates
  async checkAvailability(roomId, checkIn, checkOut) {
    return await api.get(`/rooms/${roomId}/check-availability?checkIn=${checkIn}&checkOut=${checkOut}`);
  }
};

export default roomService;
