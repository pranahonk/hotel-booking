import { reactive } from 'vue'
import roomService from '../services/room.service.js'

const state = reactive({
  user: JSON.parse(localStorage.getItem('user')) || null,
  bookingData: JSON.parse(localStorage.getItem('bookingData')) || {
    checkIn: null,
    checkOut: null,
    guests: 1,
    selectedRoom: null,
    contactInfo: null
  },
  bookings: JSON.parse(localStorage.getItem('bookings')) || [],
  rooms: [],
  selectedRoomId: localStorage.getItem('selectedRoomId') || null,
  loading: false,
  error: null,
  config: {
    API_URL: 'https://hotel-booking-api-zx9t.onrender.com/api'
  }
})

const methods = {
  setUser(user) {
    state.user = user
    localStorage.setItem('user', JSON.stringify(user))
  },
  logout() {
    state.user = null
    localStorage.removeItem('user')
  },
  updateBookingData(data) {
    state.bookingData = { ...state.bookingData, ...data }
    localStorage.setItem('bookingData', JSON.stringify(state.bookingData))
  },
  resetBookingData() {
    state.bookingData = {
      checkIn: null,
      checkOut: null,
      guests: 1,
      selectedRoom: null,
      contactInfo: null
    }
    localStorage.removeItem('bookingData')
  },
  addBooking(booking) {
    state.bookings.push(booking)
    localStorage.setItem('bookings', JSON.stringify(state.bookings))
  },
  cancelBooking(bookingId) {
    state.bookings = state.bookings.filter(booking => booking.id !== bookingId)
    localStorage.setItem('bookings', JSON.stringify(state.bookings))
  },
  async fetchRooms(filters = {}) {
    try {
      state.loading = true
      state.error = null
      
      // Add capacity filter based on guests if available
      if (state.bookingData.guests) {
        filters.capacity = state.bookingData.guests
      }
      
      const response = await roomService.getRooms(filters)
      
      if (response.status === 'success') {
        state.rooms = response.data.rooms.map(room => ({
          ...room,
          id: room._id || room.id, // Ensure we have an id property
          // Convert features array to longDescription if needed
          longDescription: room.features ? room.features.join(', ') : room.description
        }))
      } else {
        state.error = 'Failed to fetch rooms'
      }
      
      return state.rooms
    } catch (error) {
      console.error('Error fetching rooms:', error)
      state.error = error.message || 'Failed to fetch rooms'
      return []
    } finally {
      state.loading = false
    }
  },
  async getAvailableRooms(checkIn, checkOut) {
    try {
      state.loading = true
      state.error = null
      
      // Create filters for the API call
      const filters = {
        checkIn: checkIn || state.bookingData.checkIn,
        checkOut: checkOut || state.bookingData.checkOut,
        capacity: state.bookingData.guests
      }
      
      // Fetch rooms with the filters
      await this.fetchRooms(filters)
      
      // Return the filtered rooms
      return state.rooms.filter(room => 
        room.capacity >= state.bookingData.guests && 
        (room.available !== false) // Only show available rooms
      )
    } catch (error) {
      console.error('Error getting available rooms:', error)
      state.error = error.message || 'Failed to get available rooms'
      return []
    } finally {
      state.loading = false
    }
  },
  sortRoomsByPrice(ascending = true) {
    return [...state.rooms].sort((a, b) => {
      return ascending ? a.price - b.price : b.price - a.price
    })
  },
  async checkRoomAvailability(roomId, checkIn, checkOut) {
    try {
      const response = await roomService.checkAvailability(roomId, checkIn, checkOut)
      return response.status === 'success' && response.data.available
    } catch (error) {
      console.error('Error checking room availability:', error)
      return false
    }
  },
  setSelectedRoomId(roomId) {
    state.selectedRoomId = roomId
    localStorage.setItem('selectedRoomId', roomId)
  }
}

export default {
  state,
  ...methods
}
