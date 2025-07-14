import api from './api.js';

// Booking service
const bookingService = {
  // Create a new booking
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
  }
};

export default bookingService;
