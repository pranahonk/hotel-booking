import api from './api.js';

const roomService = {
  // Get all rooms with optional filtering
  async getRooms(filters = {}) {
    let queryString = '';

    if (Object.keys(filters).length > 0) {
      const params = new URLSearchParams();

      // Handle price filters with gte and lte options
      if (filters.priceGte) params.append('price[gte]', filters.priceGte);
      if (filters.priceLte) params.append('price[lte]', filters.priceLte);
      if (filters.capacity) params.append('capacity', filters.capacity);
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
    const params = new URLSearchParams();
    params.append('roomId', roomId);
    params.append('checkIn', checkIn);
    params.append('checkOut', checkOut);

    return await api.get(`/rooms/availability?${params.toString()}`);
  }
};

export default roomService;
