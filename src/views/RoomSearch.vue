<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'

const router = useRouter()
const checkIn = ref('')
const checkOut = ref('')
const guests = ref(2)

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

function searchRooms() {
  store.updateBookingData({
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    guests: guests.value
  })
  router.push('/select-room')
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
            >
          </div>
        </div>
        
        <button class="search-button" @click="searchRooms">SEARCH FOR ROOMS</button>
      </div>
      
      <div class="placeholder-image">
        <div class="image-placeholder">1000 × 400</div>
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
