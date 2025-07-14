<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'

const router = useRouter()
const checkIn = ref('')
const checkOut = ref('')
const guests = ref(2)
const searchError = ref('')
const isSearching = ref(false)

// Computed property to check if the search form is valid
const isFormValid = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const checkInDate = new Date(checkIn.value)
  const checkOutDate = new Date(checkOut.value)
  
  return (
    checkIn.value && 
    checkOut.value && 
    checkInDate >= today && 
    checkOutDate > checkInDate && 
    guests.value > 0
  )
})

onMounted(() => {
  // Set default dates (today and tomorrow)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  checkIn.value = formatDate(today)
  checkOut.value = formatDate(tomorrow)
  
  // If we have stored booking data, use it
  const bookingData = store.state.bookingData
  if (bookingData.checkIn) checkIn.value = bookingData.checkIn
  if (bookingData.checkOut) checkOut.value = bookingData.checkOut
  if (bookingData.guests) guests.value = bookingData.guests
})

function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function searchRooms() {
  if (!isFormValid.value) {
    searchError.value = 'Please check your dates and guest count'
    return
  }
  
  searchError.value = ''
  isSearching.value = true
  
  try {
    // Update booking data in store
    store.updateBookingData({
      checkIn: checkIn.value,
      checkOut: checkOut.value,
      guests: guests.value
    })
    
    // Pre-fetch rooms to check if there are any available
    // This will populate the store with rooms before navigating
    await store.fetchRooms()
    
    // Navigate to room selection page
    router.push('/select-room')
  } catch (err) {
    searchError.value = err.message || 'Failed to search for rooms. Please try again.'
    console.error('Error searching rooms:', err)
  } finally {
    isSearching.value = false
  }
}
</script>

<template>
  <div class="room-search">
    <div class="container">
      <div class="search-container">
        <h1>BOOK A ROOM</h1>
        
        <div class="search-form">
          <div class="form-group">
            <label for="guests">
              <i class="icon">👤</i>
            </label>
            <select id="guests" v-model="guests">
              <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="check-in">
              <i class="icon">📅</i>
            </label>
            <input 
              type="date" 
              id="check-in" 
              v-model="checkIn" 
              :min="formatDate(new Date())"
              :disabled="isSearching"
            >
          </div>
          
          <div class="form-group">
            <label for="check-out">
              <i class="icon">📅</i>
            </label>
            <input 
              type="date" 
              id="check-out" 
              v-model="checkOut" 
              :min="checkIn"
              :disabled="isSearching"
            >
          </div>
        </div>
        
        <!-- Error message -->
        <div v-if="searchError" class="error-message">
          {{ searchError }}
        </div>
        
        <!-- Search button with loading state -->
        <button 
          class="search-button" 
          @click="searchRooms" 
          :disabled="isSearching || !isFormValid"
        >
          <span v-if="isSearching" class="loading-spinner-small"></span>
          <span v-else>SEARCH FOR ROOMS</span>
        </button>
        
        <!-- Form validation message -->
        <div v-if="!isFormValid && !searchError" class="validation-message">
          Please select valid check-in and check-out dates
        </div>
      </div>
      
      <div class="placeholder-image">
        <div class="image-placeholder">
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aG90ZWx8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=1000&q=60" 
               alt="Hotel Room" 
               class="hotel-image" 
               onerror="this.style.display='none'; this.parentNode.innerHTML='1000 × 400';"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-search {
  padding: 40px 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-container {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
  max-width: 800px;
}

h1 {
  font-size: 32px;
  margin-bottom: 40px;
  font-weight: 700;
}

.search-form {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.form-group {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 10px 15px;
  background-color: #fff;
  border-radius: 4px;
  transition: border-color 0.3s ease;
}

.form-group:hover {
  border-color: #999;
}

.icon {
  margin-right: 10px;
  font-style: normal;
  font-size: 18px;
}

select, input {
  border: none;
  padding: 10px;
  font-size: 16px;
  outline: none;
  min-width: 120px;
}

.search-button {
  background-color: #000;
  color: #fff;
  padding: 15px 30px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  margin-top: 10px;
}

.search-button:hover {
  background-color: #333;
}

.placeholder-image {
  width: 100%;
  margin-top: 40px;
  max-width: 1000px;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.hotel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Loading spinner styles */
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

/* Error message styles */
.error-message {
  color: #e53935;
  background-color: #ffebee;
  padding: 10px 15px;
  border-radius: 4px;
  margin: 15px 0;
  font-size: 14px;
  text-align: center;
}

/* Validation message styles */
.validation-message {
  color: #ff9800;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

/* Disabled button styles */
.search-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .room-search {
    padding: 60px 0;
  }
  
  h1 {
    font-size: 36px;
  }
  
  .search-form {
    flex-direction: row;
  }
  
  .form-group {
    min-width: 180px;
  }
  
  .search-button {
    margin-top: 0;
    padding: 15px 40px;
  }
  
  .image-placeholder {
    height: 450px;
  }
}

/* Tablet styles */
@media (max-width: 1023px) and (min-width: 769px) {
  .search-form {
    justify-content: space-around;
  }
  
  .form-group {
    flex: 0 0 45%;
    margin-bottom: 15px;
  }
  
  .search-button {
    width: 100%;
    max-width: 300px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .room-search {
    padding: 30px 0;
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 30px;
  }
  
  .search-form {
    flex-direction: column;
    width: 100%;
  }
  
  .form-group {
    width: 100%;
    margin-bottom: 15px;
  }
  
  .search-button {
    width: 100%;
  }
  
  .image-placeholder {
    height: 300px;
  }
}
</style>
