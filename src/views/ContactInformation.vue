<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import store from '../store'
import bookingService from '../services/booking.service.js'

const router = useRouter()
const title = ref('Mr.')
const name = ref('')
const email = ref('')
const bookingData = computed(() => store.state.bookingData)
const user = computed(() => store.state.user)

const checkInDate = computed(() => new Date(bookingData.value.checkIn))
const checkOutDate = computed(() => new Date(bookingData.value.checkOut))
const nights = computed(() => {
  if (!checkInDate.value || !checkOutDate.value) return 1
  const diffTime = checkOutDate.value.getTime() - checkInDate.value.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const roomPrice = computed(() => bookingData.value.selectedRoom?.price || 0)
const taxRate = 0.09 const taxAmount = computed(() => roomPrice.value * taxRate)
const totalPrice = computed(() => roomPrice.value + taxAmount.value)

onMounted(() => {
    if (!bookingData.value.selectedRoom) {
    router.push('/select-room')
    return
  }

    if (user.value) {
    name.value = user.value.name
    email.value = user.value.email
  }

    if (bookingData.value.contactInfo) {
    title.value = bookingData.value.contactInfo.title
    name.value = bookingData.value.contactInfo.name
    email.value = bookingData.value.contactInfo.email
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

const isLoading = ref(false)
const errorMessage = ref('')

async function proceed() {
    if (!name.value.trim() || !email.value.trim()) {
    alert('Please fill in all fields')
    return
  }

  // Update booking data with contact info
  store.updateBookingData({
    contactInfo: {
      title: title.value,
      name: name.value,
      email: email.value
    }
  })

  // Create booking payload
  const bookingPayload = {
    roomId: bookingData.value.selectedRoom.id,
    checkIn: bookingData.value.checkIn,
    checkOut: bookingData.value.checkOut,
    guests: bookingData.value.guests,
    contactInfo: {
      title: title.value,
      name: name.value,
      email: email.value
    }
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await bookingService.createBooking(bookingPayload)

    // Add booking to store
    store.addBooking(response)

    // Navigate to my bookings page
    router.push('/my-bookings')
  } catch (error) {
    console.error('Booking creation error:', error)
    errorMessage.value = error.message || 'An error occurred while creating your booking'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="contact-information">
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
        <div class="step">
          <span class="step-number">4</span>
          <span class="step-text">CONFIRMATION</span>
        </div>
      </div>

      <div class="content-wrapper">
        <div class="contact-form">
          <h2>CONTACT INFORMATION</h2>

          <div class="form-group">
            <label for="title">Title</label>
            <select id="title" v-model="title">
              <option>Mr.</option>
              <option>Ms.</option>
              <option>Mrs.</option>
              <option>Dr.</option>
            </select>
          </div>

          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" v-model="name" placeholder="Enter your name">
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="email" placeholder="Enter your email">
          </div>

          <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
          <button class="book-button" @click="proceed" :disabled="isLoading">
            <span>PROCEED</span>
          </button>
        </div>

        <div class="booking-summary">
          <div class="booking-dates">
            <p>{{ formatDate(bookingData.checkIn) }} → {{ formatDate(bookingData.checkOut) }}</p>
            <p>{{ nights }} NIGHT</p>
            <h3>ROOM: {{ bookingData.guests }} GUEST</h3>
          </div>

          <div class="room-image">
            <div class="image-placeholder">340 × 210</div>
          </div>

          <div class="room-details">
            <h3>{{ bookingData.selectedRoom?.title }}</h3>
            <div class="price-breakdown">
              <div class="price-item">
                <span>Room</span>
                <span>${{ roomPrice.toFixed(2) }}</span>
              </div>
              <div class="price-item">
                <span>Tax & Service Charges (9%)</span>
                <span>${{ taxAmount.toFixed(2) }}</span>
              </div>
              <div class="price-item total">
                <span>TOTAL</span>
                <span>${{ totalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-information {
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

.content-wrapper {
  display: flex;
  gap: 30px;
}

.contact-form {
  flex: 1;
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.contact-form h2 {
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 700;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  font-size: 16px;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #999;
  outline: none;
}

.book-button {
  background-color: #000;
  color: #fff;
  padding: 12px 25px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  margin-top: 15px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  width: 100%;
  text-align: center;
}

.book-button:hover {
  background-color: #333;
}

.book-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.book-button span {
  font-weight: bold;
}

.error-message {
  color: #e53935;
  margin-bottom: 15px;
  padding: 10px;
  background-color: rgba(229, 57, 53, 0.1);
  border-radius: 4px;
  font-size: 14px;
}

.booking-summary {
  flex: 1;
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.booking-dates {
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}

.booking-dates p {
  margin-bottom: 8px;
  font-size: 15px;
}

.booking-dates h3 {
  font-size: 18px;
  margin-top: 12px;
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

.room-details h3 {
  margin-bottom: 18px;
  font-size: 20px;
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

/* Desktop styles */
@media (min-width: 1200px) {
  .contact-information {
    padding: 60px 0;
  }

  .content-wrapper {
    gap: 40px;
  }

  .contact-form,
  .booking-summary {
    padding: 40px;
  }

  .contact-form h2 {
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

  .contact-form,
  .booking-summary {
    padding: 25px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .contact-information {
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

  .content-wrapper {
    flex-direction: column;
    gap: 25px;
  }

  .contact-form,
  .booking-summary {
    width: 100%;
    padding: 20px;
  }

  .contact-form h2 {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .proceed-button {
    width: 100%;
    padding: 12px;
  }

  .image-placeholder {
    height: 180px;
  }

  .room-details h3 {
    font-size: 18px;
  }

  .price-item.total {
    font-size: 16px;
  }
}
</style>
