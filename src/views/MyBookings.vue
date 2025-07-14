<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import bookingService from '../services/booking.service.js'

const router = useRouter()
const bookings = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    loading.value = true
    error.value = null
    const response = await bookingService.getMyBookings()
    console.log('My bookings response:', response)
    if (response && response.data && response.data.bookings) {
      bookings.value = response.data.bookings
    } else if (response && Array.isArray(response)) {
      bookings.value = response
    } else if (response && Array.isArray(response.data)) {
      bookings.value = response.data
    } else {
      bookings.value = []
    }
  } catch (err) {
    console.error('Failed to fetch bookings:', err)
    error.value = 'Failed to load your bookings. Please try again.'
  } finally {
    loading.value = false
  }
})

async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return

  try {
    loading.value = true
    await bookingService.cancelBooking(bookingId)
        const response = await bookingService.getMyBookings()
    console.log('My bookings after cancel:', response)
    if (response && response.data && response.data.bookings) {
      bookings.value = response.data.bookings
    } else if (response && Array.isArray(response)) {
      bookings.value = response
    } else if (response && Array.isArray(response.data)) {
      bookings.value = response.data
    } else {
      bookings.value = []
    }
  } catch (err) {
    console.error('Failed to cancel booking:', err)
    error.value = 'Failed to cancel booking. Please try again.'
  } finally {
    loading.value = false
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function viewBookingDetails(bookingId) {
  router.push(`/bookings/${bookingId}`)
}
</script>

<template>
  <div class="my-bookings">
    <div class="header-container">
      <h1>My Bookings</h1>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading your bookings...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="bookings.length === 0" class="no-bookings">
      <p>You don't have any bookings yet.</p>
      <router-link to="/" class="btn-primary">Book a Room</router-link>
    </div>

    <div v-else class="bookings-list">
      <div v-for="booking in bookings" :key="booking._id" class="booking-card">
        <div class="booking-header">
          <h3>{{ booking.room.name || 'Room' }}</h3>
          <span :class="['booking-status', booking.status.toLowerCase()]">{{ booking.status }}</span>
        </div>

        <div class="booking-dates">
          <div class="date-group">
            <span class="date-label">Check-in</span>
            <span class="date">{{ formatDate(booking.checkIn) }}</span>
          </div>
          <div class="date-divider">→</div>
          <div class="date-group">
            <span class="date-label">Check-out</span>
            <span class="date">{{ formatDate(booking.checkOut) }}</span>
          </div>
        </div>

        <div class="booking-details">
          <p><strong>Guests:</strong> {{ booking.guests }}</p>
          <p><strong>Contact:</strong> {{ booking.contactInfo.name }}</p>
          <p><strong>Email:</strong> {{ booking.contactInfo.email }}</p>
        </div>

        <div class="booking-actions">
          <button @click="viewBookingDetails(booking._id)" class="btn-secondary">View Details</button>
          <button
            v-if="booking.status === 'CONFIRMED'"
            @click="cancelBooking(booking._id)"
            class="btn-danger"
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-bookings {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

h1 {
  font-size: 28px;
  margin: 0;
}

.create-booking-btn {
  background-color: #000;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.create-booking-btn:hover {
  background-color: #333;
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

.error-message {
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
  color: #cf1322;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.no-bookings {
  text-align: center;
  padding: 40px 0;
}

.no-bookings p {
  margin-bottom: 20px;
  font-size: 18px;
  color: #666;
}

.bookings-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.booking-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.booking-header h3 {
  margin: 0;
  font-size: 18px;
}

.booking-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.booking-status.confirmed {
  background-color: #e6f7ff;
  color: #1890ff;
}

.booking-status.cancelled {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.booking-status.completed {
  background-color: #f6ffed;
  color: #52c41a;
}

.booking-dates {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.date-group {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 12px;
  color: #666;
}

.date {
  font-weight: 600;
}

.date-divider {
  color: #999;
}

.booking-details {
  margin-bottom: 15px;
}

.booking-details p {
  margin: 5px 0;
  font-size: 14px;
}

.booking-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
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

.btn-danger {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.btn-danger:hover {
  background-color: #ffccc7;
}

@media (max-width: 768px) {
  .bookings-list {
    grid-template-columns: 1fr;
  }

  .booking-dates {
    flex-direction: column;
    align-items: flex-start;
  }

  .date-divider {
    display: none;
  }

  .date-group {
    margin-bottom: 10px;
  }

  .booking-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn-primary,
  .btn-secondary,
  .btn-danger {
    width: 100%;
  }
}
</style>
