<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import bookingService from '../services/booking.service.js'
import store from '../store'

const router = useRouter()
const loading = ref(false)
const error = ref(null)
const success = ref(false)
const allRooms = computed(() => store.state.rooms)
const availableRooms = ref([])
const loadingRooms = ref(false)

const filters = ref({
  roomType: '',
  minPrice: '',
  maxPrice: ''
})

const roomTypes = computed(() => {
  const types = new Set()
  allRooms.value.forEach(room => {
    if (room.type) types.add(room.type)
  })
  return Array.from(types)
})

const filteredRooms = computed(() => {
  let rooms = availableRooms.value.length ? availableRooms.value : allRooms.value

  if (filters.value.roomType) {
    rooms = rooms.filter(room => room.type === filters.value.roomType)
  }

  if (filters.value.minPrice) {
    rooms = rooms.filter(room => room.price >= Number(filters.value.minPrice))
  }

  if (filters.value.maxPrice) {
    rooms = rooms.filter(room => room.price <= Number(filters.value.maxPrice))
  }

  return rooms
})

const selectedRoom = computed(() => {
  if (!bookingData.value.room) return null
  return (availableRooms.value.length ? availableRooms.value : allRooms.value).find(room => room._id === bookingData.value.room)
})

const totalNights = computed(() => {
  if (!bookingData.value.checkIn || !bookingData.value.checkOut) return 0
  const checkIn = new Date(bookingData.value.checkIn)
  const checkOut = new Date(bookingData.value.checkOut)
  const diffTime = Math.abs(checkOut - checkIn)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const totalPrice = computed(() => {
  if (!selectedRoom.value || totalNights.value === 0) return 0
  return selectedRoom.value.price * totalNights.value
})

function resetFilters() {
  filters.value = {
    roomType: '',
    minPrice: '',
    maxPrice: ''
  }
}

const bookingData = ref({
  room: '',
  checkIn: '',
  checkOut: '',
  guests: 1,
  contactInfo: {
    title: 'Mr',
    name: '',
    email: ''
  }
})

const validationErrors = ref({})

async function fetchRooms() {
  if (allRooms.value.length === 0) {
    try {
      await store.fetchRooms()
    } catch (err) {
      console.error('Failed to fetch rooms:', err)
      error.value = 'Failed to load available rooms. Please try again.'
    }
  }
}

async function checkAvailability() {
  const { checkIn, checkOut } = bookingData.value

    bookingData.value.room = ''

    if (!checkIn || !checkOut) {
    availableRooms.value = []
    return
  }

    if (new Date(checkIn) >= new Date(checkOut)) {
    validationErrors.value.checkOut = 'Check-out date must be after check-in date'
    availableRooms.value = []
    return
  }

  try {
    loadingRooms.value = true
    validationErrors.value.checkIn = ''
    validationErrors.value.checkOut = ''

        const response = await bookingService.getAvailableRooms(checkIn, checkOut)

    if (response && response.data) {
      availableRooms.value = response.data
    } else {
      availableRooms.value = allRooms.value     }
  } catch (err) {
    console.error('Failed to check room availability:', err)
        availableRooms.value = allRooms.value
  } finally {
    loadingRooms.value = false
  }
}

async function createBooking() {
    validationErrors.value = {}
  let isValid = true

  if (!bookingData.value.room) {
    validationErrors.value.room = 'Please select a room'
    isValid = false
  }

  if (!bookingData.value.checkIn) {
    validationErrors.value.checkIn = 'Please select a check-in date'
    isValid = false
  }

  if (!bookingData.value.checkOut) {
    validationErrors.value.checkOut = 'Please select a check-out date'
    isValid = false
  } else if (bookingData.value.checkIn && new Date(bookingData.value.checkIn) >= new Date(bookingData.value.checkOut)) {
    validationErrors.value.checkOut = 'Check-out date must be after check-in date'
    isValid = false
  }

  if (!bookingData.value.guests || bookingData.value.guests < 1) {
    validationErrors.value.guests = 'Please enter at least 1 guest'
    isValid = false
  }

  if (!bookingData.value.contactInfo.name) {
    validationErrors.value.name = 'Please enter a contact name'
    isValid = false
  }

  if (!bookingData.value.contactInfo.email) {
    validationErrors.value.email = 'Please enter a contact email'
    isValid = false
  } else if (!validateEmail(bookingData.value.contactInfo.email)) {
    validationErrors.value.email = 'Please enter a valid email address'
    isValid = false
  }

  if (!isValid) return

  try {
    loading.value = true
    error.value = null
    success.value = false

    const response = await bookingService.createBooking(bookingData.value)

    if (response && response.data) {
      success.value = true
            bookingData.value = {
        room: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        contactInfo: {
          title: 'Mr',
          name: '',
          email: ''
        }
      }

            setTimeout(() => {
        router.push(`/my-bookings`)
      }, 2000)
    }
  } catch (err) {
    console.error('Failed to create booking:', err)
    error.value = 'Failed to create booking. Please try again.'
  } finally {
    loading.value = false
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

watch(
  () => [bookingData.value.checkIn, bookingData.value.checkOut],
  () => {
    checkAvailability()
  }
)

fetchRooms()
</script>

<template>
  <div class="create-booking">
    <div class="container">
      <h1>Create New Booking</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Processing your booking...</p>
      </div>

      <div v-else-if="success" class="success-message">
        <h3>Booking Created Successfully!</h3>
        <p>Your booking has been created. Redirecting to your bookings...</p>
      </div>

      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <form v-else @submit.prevent="createBooking" class="booking-form">
        <div class="form-section">
          <h2>Room Selection</h2>

          <div v-if="bookingData.checkIn && bookingData.checkOut && !loadingRooms" class="filter-section">
            <h3>Filter Rooms</h3>
            <div class="filter-row">
              <div class="filter-group">
                <label for="room-type">Room Type</label>
                <select id="room-type" v-model="filters.roomType">
                  <option value="">All Types</option>
                  <option v-for="type in roomTypes" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>

              <div class="filter-group">
                <label for="min-price">Min Price</label>
                <input type="number" id="min-price" v-model="filters.minPrice" min="0" placeholder="Min $">
              </div>

              <div class="filter-group">
                <label for="max-price">Max Price</label>
                <input type="number" id="max-price" v-model="filters.maxPrice" min="0" placeholder="Max $">
              </div>

              <button type="button" @click="resetFilters" class="btn-reset">Reset Filters</button>
            </div>
          </div>

          <div class="form-group">
            <label for="room">Select Room</label>
            <div v-if="loadingRooms" class="select-loading">
              <div class="mini-spinner"></div>
              <span>Checking availability...</span>
            </div>
            <select
              v-else
              id="room"
              v-model="bookingData.room"
              :class="{ 'error-input': validationErrors.room }"
              :disabled="!bookingData.checkIn || !bookingData.checkOut"
            >
              <option value="" disabled>{{ !bookingData.checkIn || !bookingData.checkOut ? 'Select dates first' : 'Select a room' }}</option>
              <option v-for="room in filteredRooms" :key="room._id" :value="room._id">
                {{ room.name }} - ${{ room.price }}/night
              </option>
            </select>
            <span v-if="validationErrors.room" class="error-text">{{ validationErrors.room }}</span>
            <div v-if="bookingData.checkIn && bookingData.checkOut && availableRooms.length === 0 && !loadingRooms" class="availability-message">
              No rooms available for selected dates. Please try different dates.
            </div>
            <div v-else-if="filteredRooms.length === 0 && !loadingRooms && bookingData.checkIn && bookingData.checkOut" class="availability-message">
              No rooms match your filters. Try adjusting your filter criteria.
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Stay Details</h2>

          <div class="form-row">
            <div class="form-group">
              <label for="check-in">Check-in Date</label>
              <input
                type="date"
                id="check-in"
                v-model="bookingData.checkIn"
                :min="new Date().toISOString().split('T')[0]"
                :class="{ 'error-input': validationErrors.checkIn }"
              >
              <span v-if="validationErrors.checkIn" class="error-text">{{ validationErrors.checkIn }}</span>
            </div>

            <div class="form-group">
              <label for="check-out">Check-out Date</label>
              <input
                type="date"
                id="check-out"
                v-model="bookingData.checkOut"
                :min="bookingData.checkIn || new Date().toISOString().split('T')[0]"
                :class="{ 'error-input': validationErrors.checkOut }"
              >
              <span v-if="validationErrors.checkOut" class="error-text">{{ validationErrors.checkOut }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="guests">Number of Guests</label>
            <input
              type="number"
              id="guests"
              v-model.number="bookingData.guests"
              min="1"
              :class="{ 'error-input': validationErrors.guests }"
            >
            <span v-if="validationErrors.guests" class="error-text">{{ validationErrors.guests }}</span>
          </div>
        </div>

        <div class="form-section">
          <h2>Contact Information</h2>

          <div class="form-row">
            <div class="form-group title-group">
              <label for="title">Title</label>
              <select id="title" v-model="bookingData.contactInfo.title">
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>

            <div class="form-group name-group">
              <label for="name">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="bookingData.contactInfo.name"
                :class="{ 'error-input': validationErrors.name }"
              >
              <span v-if="validationErrors.name" class="error-text">{{ validationErrors.name }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="bookingData.contactInfo.email"
              :class="{ 'error-input': validationErrors.email }"
            >
            <span v-if="validationErrors.email" class="error-text">{{ validationErrors.email }}</span>
          </div>
        </div>

        <div class="form-section" v-if="selectedRoom && totalNights > 0">
          <h2>Price Summary</h2>
          <div class="price-summary">
            <div class="price-row">
              <span>Room Rate:</span>
              <span>${{ selectedRoom.price }} / night</span>
            </div>
            <div class="price-row">
              <span>Number of Nights:</span>
              <span>{{ totalNights }}</span>
            </div>
            <div class="price-row total">
              <span>Total Price:</span>
              <span>${{ totalPrice }}</span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="router.push('/')" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary">Create Booking</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-booking {
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  font-size: 28px;
  margin-bottom: 30px;
  text-align: center;
}

h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #000;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mini-spinner {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 2px solid #000;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 8px;
  vertical-align: middle;
}

.select-loading {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  font-size: 14px;
  color: #666;
}

.availability-message {
  margin-top: 8px;
  color: #ff4d4f;
  font-size: 14px;
}

.success-message {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.error-message {
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
  color: #cf1322;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.booking-form {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-section {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
  flex: 1;
}

.form-group:last-child {
  margin-bottom: 0;
}

.title-group {
  flex: 0 0 100px;
}

.name-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus, select:focus {
  outline: none;
  border-color: #000;
}

.error-input {
  border-color: #ff4d4f;
}

.error-text {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  padding: 20px;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #000;
  color: #fff;
}

.btn-primary:hover {
  background-color: #333;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #000;
}

.btn-secondary:hover {
  background-color: #e0e0e0;
}

.price-summary {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 15px;
}

.price-row:not(:last-child) {
  border-bottom: 1px solid #eee;
}

.price-row.total {
  font-weight: 600;
  font-size: 18px;
  padding-top: 12px;
  margin-top: 5px;
  border-top: 2px solid #ddd;
}

.filter-section {
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.filter-section h3 {
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 12px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.filter-group {
  flex: 1;
  min-width: 120px;
}

.filter-group label {
  font-size: 14px;
  margin-bottom: 5px;
}

.btn-reset {
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  height: 40px;
  transition: background-color 0.2s ease;
}

.btn-reset:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .title-group, .name-group {
    flex: 1;
  }

  .filter-row {
    flex-direction: column;
    gap: 10px;
  }

  .filter-group {
    width: 100%;
  }

  .btn-reset {
    width: 100%;
    margin-top: 5px;
  }
}
</style>
