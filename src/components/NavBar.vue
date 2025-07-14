<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'
import authService from '../services/auth.service.js'

const router = useRouter()
const user = computed(() => store.state.user)

function logout() {
  authService.logout()
  store.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="logo">Hotel Booking</router-link>
      </div>
      
      <div class="navbar-menu">
        <div class="navbar-end">
          <!-- Show these links when user is logged in -->
          <template v-if="user">
            <div class="user-menu">
              <span class="welcome-text">Welcome, {{ user.name }}</span>
              <div class="dropdown">
                <button class="dropdown-button">
                  <div class="avatar">{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</div>
                  <span class="dropdown-icon">▼</span>
                </button>
                <div class="dropdown-content">
                  <router-link to="/profile" class="dropdown-item">My Profile</router-link>
                  <router-link to="/dashboard" class="dropdown-item">My Bookings</router-link>
                  <a href="#" @click.prevent="logout" class="dropdown-item">Logout</a>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Show these links when user is not logged in -->
          <template v-else>
            <router-link to="/login" class="navbar-item">Login</router-link>
            <router-link to="/register" class="navbar-item register-button">Register</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #000;
  text-decoration: none;
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.navbar-end {
  display: flex;
  align-items: center;
}

.navbar-item {
  margin-left: 20px;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.navbar-item:hover {
  color: #000;
}

.register-button {
  background-color: #000;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #333;
}

.user-menu {
  display: flex;
  align-items: center;
}

.welcome-text {
  margin-right: 10px;
  font-weight: 500;
  display: none;
}

.avatar {
  width: 32px;
  height: 32px;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
}

.dropdown-icon {
  margin-left: 5px;
  font-size: 10px;
}

.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #fff;
  min-width: 160px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1;
  margin-top: 10px;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .welcome-text {
    display: block;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .navbar {
    padding: 10px 0;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .navbar-item {
    margin-left: 15px;
  }
  
  .register-button {
    padding: 6px 12px;
  }
}
</style>
