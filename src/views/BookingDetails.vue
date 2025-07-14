<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import bookingService from '../services/booking.service.js'

const route = useRoute()
const router = useRouter()
const booking = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  const bookingId = route.params.id
  if (!bookingId) {
    error.value = 'Booking ID is missing'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = null
    const response = await bookingService.getBooking(bookingId)
    if (response && response.data) {
      booking.value = response.data
    } else {
      error.value = 'Booking not found'
    }
  } catch (err) {
    console.error('Failed to fetch booking details:', err)
    error.value = 'Failed to load booking details. Please try again.'
  } finally {
    loading.value = false
  }
})

async function cancelBooking() {
  if (!booking.value || !booking.value._id) return
  if (!confirm('Are you sure you want to cancel this booking?')) return
  
  try {
    loading.value = true
    await bookingService.cancelBooking(booking.value._id)
    // Refresh the booking data
    const response = await bookingService.getBooking(booking.value._id)
    if (response && response.data) {
      booking.value = response.data
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

function goBack() {
  router.push('/my-bookings')
}
</script>

<template>
  <div class="booking-details">
    <div class="container">
      <button @click="goBack" class="back-button">
        ← Back to My Bookings
      </button>
      
      <h1>Booking Details</h1>
      
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading booking details...</p>
      </div>
      
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-else-if="booking" class="booking-info">
        <div class="booking-header">
          <h2>{{ booking.room?.name || 'Room' }}</h2>
          <span :class="['booking-status', booking.status?.toLowerCase()]">{{ booking.status }}</span>
        </div>
        
        <div class="booking-section">
          <h3>Booking Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Booking ID</span>
              <span class="value">{{ booking._id }}</span>
            </div>
            <div class="info-item">
              <span class="label">Created On</span>
              <span class="value">{{ formatDate(booking.createdAt) }}</span>
            </div>
          </div>
        </div>
        
        <div class="booking-section">
          <h3>Stay Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Check-in Date</span>
              <span class="value">{{ formatDate(booking.checkIn) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Check-out Date</span>
              <span class="value">{{ formatDate(booking.checkOut) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Number of Guests</span>
              <span class="value">{{ booking.guests }}</span>
            </div>
          </div>
        </div>
        
        <div class="booking-section">
          <h3>Contact Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Name</span>
              <span class="value">{{ booking.contactInfo?.title }} {{ booking.contactInfo?.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Email</span>
              <span class="value">{{ booking.contactInfo?.email }}</span>
            </div>
          </div>
        </div>
        
        <div class="booking-section" v-if="booking.room">
          <h3>Room Details</h3>
          <div class="room-details">
            <img 
              v-if="booking.room.image" 
              :src="booking.room.image" 
              :alt="booking.room.name" 
              class="room-image"
            >
            <div class="room-info">
              <h4>{{ booking.room.name }}</h4>
              <p class="room-type">{{ booking.room.type }}</p>
              <p class="room-price">${{ booking.room.price }} / night</p>
              <p class="room-description">{{ booking.room.description }}</p>
              
              <div v-if="booking.room.amenities && booking.room.amenities.length" class="room-amenities">
                <h5>Amenities</h5>
                <ul class="amenities-list">
                  <li v-for="amenity in booking.room.amenities" :key="amenity">
                    {{ amenity }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="booking-actions" v-if="booking.status === 'CONFIRMED'">
          <button @click="cancelBooking" class="btn-danger">Cancel Booking</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-details {
  padding: 20px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.back-button {
  background: none;
  border: none;
  color: #000;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
}

.back-button:hover {
  text-decoration: underline;
}

h1 {
  font-size: 28px;
  margin-bottom: 30px;
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
}

.booking-info {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #eee;
}

.booking-header h2 {
  margin: 0;
  font-size: 22px;
}

.booking-status {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
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

.booking-section {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.booking-section:last-child {
  border-bottom: none;
}

.booking-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.value {
  font-weight: 500;
}

.room-details {
  display: flex;
  gap: 20px;
}

.room-image {
  width: 150px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.room-info h4 {
  margin-top: 0;
  margin-bottom: 5px;
}

.room-type {
  color: #666;
  margin-bottom: 5px;
}

.room-price {
  font-weight: 600;
  margin-bottom: 5px;
}

.room-description {
  font-size: 14px;
  line-height: 1.5;
}

.room-amenities {
  margin-top: 15px;
}

.room-amenities h5 {
  font-size: 16px;
  margin-bottom: 8px;
}

.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 0;
  list-style: none;
}

.amenities-list li {
  background-color: #f0f0f0;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 13px;
  color: #333;
}

.booking-actions {
  padding: 20px;
  display: flex;
  justify-content: flex-end;
}

.btn-danger {
  background-color: #ff4d4f;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-danger:hover {
  background-color: #ff7875;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .room-details {
    flex-direction: column;
  }
  
  .room-image {
    width: 100%;
    height: 200px;
  }
}
</style>
