import api from './api.js';

const bookingService = {
    async createBooking(bookingData) {
    return await api.post('/bookings', bookingData);
  },

  // Get all bookings for the current user
  async getMyBookings() {
    return await api.get('/bookings/my-bookings');
  },

  // Get a single booking by ID
  async getBooking(bookingId) {
    return await api.get(`/bookings/${bookingId}`);
  },

  // Cancel a booking
  async cancelBooking(bookingId) {
    return await api.patch(`/bookings/${bookingId}/cancel`);
  },

  // Get available rooms for booking based on date range
  async getAvailableRooms(checkInDate, checkOutDate) {
    return await api.get(`/rooms/available?checkIn=${checkInDate}&checkOut=${checkOutDate}`);
  }
};

export default bookingService;
