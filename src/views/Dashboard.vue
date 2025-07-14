<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'

const router = useRouter()
const user = computed(() => store.state.user)
const bookings = computed(() => store.state.bookings)
const activeTab = ref('upcoming')

const currentDate = new Date()
const upcomingBookings = computed(() => {
  return bookings.value.filter(booking => {
    const checkInDate = new Date(booking.checkIn)
    return checkInDate >= currentDate
  }).sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn))
})

const pastBookings = computed(() => {
  return bookings.value.filter(booking => {
    const checkInDate = new Date(booking.checkIn)
    return checkInDate < currentDate
  }).sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn))
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function cancelBooking(bookingId) {
  if (confirm('Are you sure you want to cancel this booking?')) {
    store.cancelBooking(bookingId)
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="container">
      <h1>My Dashboard</h1>

      <div class="tabs">
        <button
          :class="['tab-button', { active: activeTab === 'upcoming' }]"
          @click="activeTab = 'upcoming'"
        >
          Upcoming Bookings
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'past' }]"
          @click="activeTab = 'past'"
        >
          Past Bookings
        </button>
      </div>

      <div class="tab-content">
        <!-- Upcoming Bookings -->
        <div v-if="activeTab === 'upcoming'" class="bookings-list">
          <div v-if="upcomingBookings.length === 0" class="no-bookings">
            <p>You have no upcoming bookings.</p>
            <router-link to="/" class="book-now-button">Book Now</router-link>
          </div>

          <div v-else class="booking-cards">
            <div v-for="booking in upcomingBookings" :key="booking.id" class="booking-card">
              <div class="booking-image">
                <div class="image-placeholder">340 × 210</div>
              </div>
              <div class="booking-details">
                <h3>{{ booking.room.title }}</h3>
                <p class="booking-dates">
                  <strong>Check-in:</strong> {{ formatDate(booking.checkIn) }}<br>
                  <strong>Check-out:</strong> {{ formatDate(booking.checkOut) }}
                </p>
                <p><strong>Guests:</strong> {{ booking.guests }}</p>
                <p><strong>Booking ID:</strong> {{ booking.id }}</p>
                <p class="booking-price"><strong>Total:</strong> ${{ booking.price.total.toFixed(2) }}</p>
                <button class="cancel-button" @click="cancelBooking(booking.id)">Cancel Booking</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Past Bookings -->
        <div v-if="activeTab === 'past'" class="bookings-list">
          <div v-if="pastBookings.length === 0" class="no-bookings">
            <p>You have no past bookings.</p>
          </div>

          <div v-else class="booking-cards">
            <div v-for="booking in pastBookings" :key="booking.id" class="booking-card">
              <div class="booking-image">
                <div class="image-placeholder">340 × 210</div>
              </div>
              <div class="booking-details">
                <h3>{{ booking.room.title }}</h3>
                <p class="booking-dates">
                  <strong>Check-in:</strong> {{ formatDate(booking.checkIn) }}<br>
                  <strong>Check-out:</strong> {{ formatDate(booking.checkOut) }}
                </p>
                <p><strong>Guests:</strong> {{ booking.guests }}</p>
                <p><strong>Booking ID:</strong> {{ booking.id }}</p>
                <p class="booking-price"><strong>Total:</strong> ${{ booking.price.total.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 40px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  margin-bottom: 30px;
  font-size: 28px;
}

.tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #ddd;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 2px;
}

.tab {
  padding: 12px 25px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
}

.tab:hover {
  background-color: #f5f5f5;
}

.tab.active {
  border-bottom-color: #000;
  color: #000;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.booking-card {
  display: flex;
  border: 1px solid #eee;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.booking-image {
  flex: 0 0 220px;
  margin-right: 25px;
}

.image-placeholder {
  width: 100%;
  height: 140px;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  border-radius: 6px;
  overflow: hidden;
}

.booking-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.booking-info h3 {
  margin-bottom: 12px;
  font-size: 20px;
}

.booking-dates {
  font-size: 15px;
  color: #666;
  margin-bottom: 12px;
}

.booking-guests {
  font-size: 15px;
  color: #666;
  margin-bottom: 12px;
}

.booking-price {
  font-weight: bold;
  margin-bottom: 20px;
  font-size: 18px;
}

.booking-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.cancel-button {
  background-color: #f44336;
  color: #fff;
  padding: 10px 20px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 15px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #d32f2f;
}

.no-bookings {
  text-align: center;
  padding: 60px 0;
  color: #666;
  font-size: 18px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 20px 0;
}

/* Desktop styles */
@media (min-width: 1200px) {
  .dashboard {
    padding: 60px 0;
  }

  .dashboard-header {
    padding: 40px;
  }

  .dashboard-header h1 {
    font-size: 32px;
  }

  .booking-card {
    padding: 30px;
  }

  .booking-image {
    flex: 0 0 250px;
  }

  .image-placeholder {
    height: 160px;
  }
}

/* Tablet styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .booking-image {
    flex: 0 0 200px;
  }

  .image-placeholder {
    height: 120px;
  }

  .booking-card {
    padding: 20px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .dashboard {
    padding: 30px 0;
  }

  .dashboard-header {
    padding: 20px;
    margin-bottom: 30px;
  }

  .dashboard-header h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  .dashboard-header p {
    font-size: 15px;
  }

  .tabs {
    margin-bottom: 20px;
  }

  .tab {
    padding: 10px 15px;
    font-size: 14px;
  }

  .booking-card {
    flex-direction: column;
    padding: 15px;
  }

  .booking-image {
    margin-right: 0;
    margin-bottom: 20px;
    width: 100%;
  }

  .booking-info h3 {
    font-size: 18px;
  }

  .booking-price {
    margin-bottom: 15px;
  }

  .booking-actions {
    justify-content: flex-start;
  }

  .cancel-button {
    width: 100%;
    text-align: center;
  }

  .no-bookings {
    padding: 40px 0;
  }
}
</style>
