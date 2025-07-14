<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth.service.js'
import store from '../store'

const router = useRouter()
const user = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.push('/login')
    return
  }
  
  try {
    loading.value = true
    error.value = null
    
    // Get current user profile
    const response = await authService.getCurrentUser()
    
    if (response.user) {
      user.value = response.user
      // Update user in store
      store.setUser(response.user)
    } else {
      error.value = 'Failed to load user profile'
    }
  } catch (err) {
    console.error('Error loading profile:', err)
    error.value = err.message || 'An error occurred while loading your profile'
  } finally {
    loading.value = false
  }
})

function logout() {
  authService.logout()
  store.setUser(null)
  router.push('/login')
}
</script>

<template>
  <div class="profile">
    <div class="container">
      <div class="profile-card">
        <h1>My Profile</h1>
        
        <!-- Loading state -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
        
        <!-- Error state -->
        <div v-else-if="error" class="error-container">
          <p>{{ error }}</p>
          <button @click="router.push('/login')" class="login-button">Go to Login</button>
        </div>
        
        <!-- User profile -->
        <div v-else-if="user" class="user-info">
          <div class="user-header">
            <div class="avatar">{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</div>
            <div class="user-details">
              <h2>{{ user.name }}</h2>
              <p>{{ user.email }}</p>
            </div>
          </div>
          
          <div class="profile-section">
            <h3>Account Information</h3>
            <div class="info-row">
              <span class="label">Name:</span>
              <span class="value">{{ user.name }}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span>
              <span class="value">{{ user.email }}</span>
            </div>
            <div class="info-row">
              <span class="label">Member Since:</span>
              <span class="value">{{ new Date(user.createdAt || Date.now()).toLocaleDateString() }}</span>
            </div>
          </div>
          
          <div class="actions">
            <button class="logout-button" @click="logout">Logout</button>
            <router-link to="/" class="home-button">Back to Home</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile {
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-card {
  background-color: #f5f5f5;
  padding: 35px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.profile-card h1 {
  margin-bottom: 25px;
  font-size: 28px;
  text-align: center;
  font-weight: 700;
  color: #333;
}

/* Loading state styles */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
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
  padding: 30px 0;
}

.error-container p {
  color: #e53935;
  font-size: 18px;
  margin-bottom: 20px;
}

.login-button {
  background-color: #000;
  color: #fff;
  padding: 12px 24px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: #333;
}

/* User profile styles */
.user-info {
  padding: 10px 0;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.avatar {
  width: 80px;
  height: 80px;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  margin-right: 20px;
}

.user-details h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.user-details p {
  color: #666;
  font-size: 16px;
}

.profile-section {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.profile-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.info-row {
  display: flex;
  margin-bottom: 12px;
}

.label {
  flex: 0 0 120px;
  font-weight: 500;
  color: #666;
}

.value {
  flex: 1;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.logout-button {
  background-color: #f44336;
  color: #fff;
  padding: 12px 24px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.home-button {
  background-color: #000;
  color: #fff;
  padding: 12px 24px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.home-button:hover {
  background-color: #333;
}

/* Responsive styles */
@media (max-width: 768px) {
  .profile-card {
    padding: 25px 20px;
  }
  
  .user-header {
    flex-direction: column;
    text-align: center;
  }
  
  .avatar {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .info-row {
    flex-direction: column;
  }
  
  .label {
    margin-bottom: 5px;
  }
  
  .actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .logout-button, .home-button {
    width: 100%;
    text-align: center;
  }
}
</style>
