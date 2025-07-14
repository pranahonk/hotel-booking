<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'

const router = useRouter()
const bookings = computed(() => store.state.bookings)
const latestBooking = computed(() => {
  if (bookings.value.length === 0) return null
  return bookings.value[bookings.value.length - 1]
})

onMounted(() => {
  // Redirect if no bookings
  if (bookings.value.length === 0) {
    router.push('/')
    return
  }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

function returnToHome() {
  // Reset booking data and return to home
  store.resetBookingData()
  router.push('/')
}
</script>

<template>
  <div class="confirmation" v-if="latestBooking">
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
        <div class="step active">
          <span class="step-number">3</span>
          <span class="step-text">CONTACT DETAILS</span>
        </div>
        <div class="step active">
          <span class="step-number">4</span>
          <span class="step-text">CONFIRMATION</span>
        </div>
      </div>
      
      <div class="confirmation-message">
        <h1>YOUR BOOKING HAS BEEN CONFIRMED</h1>
        <p>We have sent your booking confirmation to the email address that you have provided.</p>
        <p class="booking-details">
          Check-in/Check-out: {{ formatDate(latestBooking.checkIn) }} - {{ formatDate(latestBooking.checkOut) }}<br>
          Booking Confirmation Number: {{ latestBooking.id }}<br>
          Total Price: ${{ latestBooking.price.total.toFixed(2) }}
        </p>
      </div>
      
      <div class="confirmation-details">
        <div class="room-details">
          <div class="room-image">
            <div class="image-placeholder">340 × 210</div>
          </div>
          <div class="room-info">
            <h3>ROOM: {{ latestBooking.room.title }}</h3>
            <p>{{ latestBooking.guests }} Guest</p>
            
            <h4>PACKAGE:</h4>
            <div class="price-breakdown">
              <div class="price-item">
                <span>Room</span>
                <span>${{ latestBooking.price.room.toFixed(2) }}</span>
              </div>
              <div class="price-item">
                <span>Tax & Service Charges (9%)</span>
                <span>${{ latestBooking.price.tax.toFixed(2) }}</span>
              </div>
              <div class="price-item total">
                <span class="total-label">Total Price</span>
                <span class="total-value">${{ latestBooking.price.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="guest-details">
          <h3>GUEST DETAILS</h3>
          <div class="guest-info">
            <div class="guest-info-item">
              <span class="info-label">Name:</span>
              <span class="info-value">{{ latestBooking.contactInfo.title }} {{ latestBooking.contactInfo.name }}</span>
            </div>
            <div class="guest-info-item">
              <span class="info-label">Email Address:</span>
              <span class="info-value">{{ latestBooking.contactInfo.email }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button class="home-button" @click="returnToHome">RETURN TO HOME</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.confirmation {
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

.confirmation-message {
  text-align: center;
  margin-bottom: 50px;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.confirmation-message h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color: #000;
}

.confirmation-message p {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
}

.confirmation-number {
  font-weight: bold;
  color: #000;
  font-size: 20px;
  display: inline-block;
  margin: 5px 0;
}

.content-wrapper {
  display: flex;
  gap: 30px;
}

.booking-details {
  flex: 1;
  padding: 30px;
  border-radius: 8px;
}

.booking-details h3 {
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 700;
}

.detail-group {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.detail-group:last-of-type {
  border-bottom: none;
}

.detail-group h4 {
  font-size: 17px;
  margin-bottom: 8px;
  color: #333;
}

.detail-group p {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}

.room-image {
  margin-bottom: 25px;
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

.price-breakdown {
  border-top: 1px solid #ddd;
  padding-top: 18px;
}

.price-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 15px;
}

.price-item.total {
  font-weight: bold;
  font-size: 18px;
  margin-top: 18px;
  border-top: 1px solid #ddd;
  padding-top: 18px;
}

.total-label {
  font-size: 20px;
  font-weight: 700;
  color: #333;
}

.total-value {
  font-size: 20px;
  font-weight: 700;
  color: #000;
}

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.guest-info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-label {
  font-weight: 600;
  color: #555;
  font-size: 15px;
}

.info-value {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.return-home {
  text-align: center;
  margin-top: 50px;
}

.actions {
  margin-top: 40px;
  text-align: center;
}

.home-button {
  background-color: #000;
  color: #fff;
  padding: 15px 35px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 250px;
}

.home-button:hover {
  background-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.home-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Desktop styles */
@media (min-width: 1200px) {
  .confirmation {
    padding: 60px 0;
  }
  
  .confirmation-message {
    padding: 40px;
  }
  
  .confirmation-message h2 {
    font-size: 32px;
  }
  
  .content-wrapper {
    gap: 40px;
  }
  
  .booking-details {
    padding: 40px;
  }
  
  .booking-details h3 {
    font-size: 22px;
  }
  
  .image-placeholder {
    height: 230px;
  }
}

/* Tablet styles */
@media (max-width: 1024px) and (min-width: 769px) {
  .content-wrapper {
    gap: 25px;
  }
  
  .booking-details {
    padding: 25px;
  }
  
  .confirmation-message {
    padding: 25px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .confirmation {
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
  
  .confirmation-message {
    padding: 20px;
    margin-bottom: 30px;
  }
  
  .confirmation-message h2 {
    font-size: 22px;
  }
  
  .confirmation-message p {
    font-size: 16px;
  }
  
  .confirmation-number {
    font-size: 18px;
  }
  
  .content-wrapper {
    flex-direction: column;
    gap: 25px;
  }
  
  .booking-details {
    width: 100%;
    padding: 20px;
  }
  
  .booking-details h3 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  .detail-group {
    margin-bottom: 20px;
  }
  
  .image-placeholder {
    height: 180px;
  }
  
  .home-button {
    width: 100%;
    padding: 12px;
  }
}
</style>
