<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'
import authService from '../services/auth.service.js'
import api from '../services/api.js'

const router = useRouter()
const sortOrder = ref('lowest')
const rooms = ref([])
const loading = ref(true)
const error = ref(null)

const bookingData = computed(() => store.state.bookingData)
const checkInDate = computed(() => new Date(bookingData.value.checkIn))
const checkOutDate = computed(() => new Date(bookingData.value.checkOut))
const nights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 1
  const diffTime = checkOutDate.value.getTime() - checkInDate.value.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

async function fetchRooms() {
  try {
    loading.value = true
    error.value = null

        const filters = {
      checkIn: bookingData.value.checkIn,
      checkOut: bookingData.value.checkOut,
      capacity: bookingData.value.guests
    }

        rooms.value = await store.fetchRooms(filters)

        rooms.value = rooms.value.filter(room =>
      room.capacity >= bookingData.value.guests &&
      (room.available !== false)     )

    sortRooms()
  } catch (err) {
    error.value = err.message || 'Failed to load rooms'
    console.error('Error loading rooms:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
    if (!bookingData.value.checkIn || !bookingData.value.checkOut) {
    router.push('/')
    return
  }

    await fetchRooms()
})

function sortRooms() {
  rooms.value = store.sortRoomsByPrice(sortOrder.value === 'lowest')
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function getImageUrl(imageName) {
      return imageName || 'placeholder.jpg'
}

const isProcessing = ref(false)
const bookingError = ref(null)

function selectRoom(room) {
  console.log(room)
  store.updateBookingData({
    selectedRoom: room
  })
  store.setSelectedRoomId(room.id || room._id)

    const isAuthenticated = authService.isAuthenticated()

  if (!isAuthenticated) {
        router.push({
      path: '/login',
      query: { redirect: router.currentRoute.value.fullPath }
    })
    return
  }

    router.push('/contact-information')
}
</script>

<template>
  <div class="select-room">
    <div class="container">
      <div class="breadcrumbs">
        <div class="step active">
          <span class="step-number">1</span>
          <span class="step-text">SEARCH</span>
        </div>
        <div class="step active">
          <span class="step-number">2</span>
          <span class="step-text">SELECT ROOM</span>
        </div>
        <div class="step">
          <span class="step-number">3</span>
          <span class="step-text">CONTACT INFORMATION</span>
        </div>
        <div class="step">
          <span class="step-number">4</span>
          <span class="step-text">CONFIRMATION</span>
        </div>
      </div>

      <div class="booking-dates">
        <h2>{{ formatDate(bookingData.checkIn) }} → {{ formatDate(bookingData.checkOut) }}</h2>
        <p>{{ nights }} NIGHT{{ nights > 1 ? 'S' : '' }} | {{ bookingData.guests }} GUEST{{ bookingData.guests > 1 ? 'S' : '' }}</p>
      </div>

      <div class="sort-options">
        <span>SORT BY:</span>
        <select v-model="sortOrder" @change="sortRooms">
          <option value="lowest">LOWEST PRICE</option>
          <option value="highest">HIGHEST PRICE</option>
        </select>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading available rooms...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error-container">
        <p>{{ error }}</p>
        <button @click="fetchRooms" class="retry-button">Try Again</button>
      </div>

      <!-- Empty state -->
      <div v-else-if="rooms.length === 0" class="empty-container">
        <p>No rooms available for the selected dates and number of guests.</p>
        <button @click="router.push('/')" class="back-button">Change Search</button>
      </div>

      <!-- Room list -->
      <div v-else class="room-list">
        <div v-for="room in rooms" :key="room.id" class="room-card">
          <div class="room-image">
            <!-- Use placeholder for now, in production would use actual images -->
            <div class="image-placeholder">{{ room.images && room.images[0] ? room.images[0] : '340 × 210' }}</div>
          </div>
          <div class="room-info">
            <h3>{{ room.title }}</h3>
            <p class="room-description">{{ room.description }}</p>
            <div class="room-features">
              <h4>Features:</h4>
              <ul v-if="room.features && room.features.length">
                <li v-for="(feature, index) in room.features" :key="index">{{ feature }}</li>
              </ul>
              <p v-else class="room-long-description">{{ room.longDescription }}</p>
            </div>
          </div>
          <div class="room-price">
            <h4>${{ room.price }}<span class="per-night">/night</span></h4>
            <p class="capacity">Max Guests: {{ room.capacity }}</p>
            <p class="tax-note">Subject to GST and charges</p>
            <button class="book-button" @click="selectRoom(room)" :disabled="isProcessing">
              <span v-if="isProcessing" class="loading-spinner-small"></span>
              <span v-else>PROCEED</span>
            </button>
            <div v-if="bookingError" class="booking-error">{{ bookingError }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-room {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.breadcrumbs {
  display: flex;
  margin-bottom: 30px;
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  white-space: nowrap;
}

.step {
  display: flex;
  align-items: center;
  margin-right: 20px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.step.active {
  opacity: 1;
}

.step-number {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #000;
  color: #fff;
  font-size: 14px;
  margin-right: 10px;
}

.step-text {
  font-size: 13px;
  font-weight: bold;
}

.booking-dates {
  margin-bottom: 30px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 6px;
}

.booking-dates h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.booking-dates p {
  font-size: 15px;
  color: #666;
}

.sort-options {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 25px;
}

.sort-options span {
  font-size: 15px;
  margin-right: 10px;
  font-weight: 500;
}

.sort-options select {
  padding: 8px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}

/* Loading state styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #000;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error state styles */
.error-container {
  text-align: center;
  padding: 40px 0;
  background-color: #fff3f3;
  border-radius: 8px;
  margin-bottom: 30px;
}

.error-container p {
  color: #e53935;
  font-size: 18px;
  margin-bottom: 20px;
}

.retry-button {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #c62828;
}

/* Empty state styles */
.empty-container {
  text-align: center;
  padding: 40px 0;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 30px;
}

.empty-container p {
  font-size: 18px;
  margin-bottom: 20px;
  color: #666;
}

.back-button {
  background-color: #000;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #333;
}

.room-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.room-card {
  display: flex;
  border: 1px solid #eee;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.room-image {
  flex: 0 0 340px;
  margin-right: 25px;
}

.image-placeholder {
  width: 100%;
  height: 210px;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  border-radius: 6px;
  overflow: hidden;
}

.room-info {
  flex: 1;
  padding-right: 25px;
}

.room-info h3 {
  margin-bottom: 12px;
  font-size: 20px;
}

.room-description {
  font-size: 15px;
  color: #666;
  margin-bottom: 12px;
}

.room-features {
  margin-top: 15px;
}

.room-features h4 {
  font-size: 16px;
  margin-bottom: 10px;
}

.room-features ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.room-features li {
  padding: 5px 0;
  font-size: 14px;
  position: relative;
  padding-left: 20px;
}

.room-features li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #4caf50;
}

.room-long-description {
  font-size: 15px;
  line-height: 1.6;
}

.room-price {
  flex: 0 0 200px;
  text-align: right;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.room-price h4 {
  font-size: 26px;
  margin-bottom: 5px;
}

.per-night {
  font-size: 16px;
  font-weight: normal;
}

.capacity {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.tax-note {
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
}

.book-button {
  background-color: #000;
  color: #fff;
  padding: 12px 20px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
  align-self: flex-end;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.book-button:hover {
  background-color: #333;
}

.book-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading-spinner-small {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.booking-error {
  color: #e53935;
  background-color: #ffebee;
  padding: 10px 15px;
  border-radius: 4px;
  margin-top: 15px;
  font-size: 14px;
  text-align: center;
}

/* Desktop styles */
@media (min-width: 1200px) {
  .select-room {
    padding: 60px 0;
  }

  .room-card {
    padding: 30px;
  }

  .room-image {
    flex: 0 0 380px;
  }

  .image-placeholder {
    height: 230px;
  }

  .room-info h3 {
    font-size: 22px;
  }
}

/* Tablet styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .room-card {
    padding: 20px;
  }

  .room-image {
    flex: 0 0 280px;
    margin-right: 20px;
  }

  .image-placeholder {
    height: 180px;
  }

  .room-info {
    padding-right: 15px;
  }

  .room-price {
    flex: 0 0 180px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .select-room {
    padding: 30px 0;
  }

  .breadcrumbs {
    padding: 10px;
  }

  .step-number {
    width: 24px;
    height: 24px;
    font-size: 12px;
    margin-right: 6px;
  }

  .step-text {
    font-size: 11px;
  }

  .booking-dates {
    padding: 15px;
  }

  .booking-dates h2 {
    font-size: 18px;
  }

  .sort-options {
    justify-content: space-between;
  }

  .room-card {
    flex-direction: column;
    padding: 15px;
  }

  .room-image {
    margin-right: 0;
    margin-bottom: 20px;
    width: 100%;
  }

  .room-info {
    padding-right: 0;
    margin-bottom: 20px;
  }

  .room-price {
    width: 100%;
    text-align: left;
    align-items: flex-start;
  }

  .book-button {
    width: 100%;
    text-align: center;
  }
}
</style>
