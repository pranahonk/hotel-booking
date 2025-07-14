import { reactive } from 'vue'

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
  rooms: [
    {
      id: 1,
      title: 'ROOM 1 TITLE',
      description: 'LOREM IPSUM DOLOR SIT AMET',
      longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ex a risus dapibus pharetra facilisis ac felis.',
      price: 1080,
      image: '340x210'
    },
    {
      id: 2,
      title: 'ROOM 2 TITLE',
      description: 'LOREM IPSUM DOLOR SIT AMET',
      longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ex a risus dapibus pharetra facilisis ac felis.',
      price: 1280,
      image: '340x210'
    },
    {
      id: 3,
      title: 'ROOM 3 TITLE',
      description: 'LOREM IPSUM DOLOR SIT AMET',
      longDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac ex a risus dapibus pharetra facilisis ac felis.',
      price: 980,
      image: '340x210'
    }
  ]
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
  getAvailableRooms() {
    // In a real app, this would filter based on availability
    return state.rooms
  },
  sortRoomsByPrice(ascending = true) {
    return [...state.rooms].sort((a, b) => {
      return ascending ? a.price - b.price : b.price - a.price
    })
  }
}

export default {
  state,
  ...methods
}
