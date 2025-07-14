<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'
import authService from '../services/auth.service.js'

const router = useRouter()
const user = computed(() => store.state.user)
const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const dropdownButtonRef = ref(null)
const mobileMenuOpen = ref(false)

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    setTimeout(() => {
      const firstItem = dropdownRef.value?.querySelector('a, button')
      if (firstItem) firstItem.focus()
    }, 100)
  }
}

function closeDropdown() {
  dropdownOpen.value = false
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function logout() {
  authService.logout()
  store.logout()
  router.push('/login')
  closeDropdown()
}

// Handle keyboard navigation
function handleKeyDown(event) {
  if (!dropdownOpen.value) return
  
  const focusableElements = dropdownRef.value?.querySelectorAll('a, button')
  if (!focusableElements?.length) return
  
  const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement)
  
  switch (event.key) {
    case 'Escape':
      closeDropdown()
      dropdownButtonRef.value?.focus()
      break
    case 'ArrowDown':
      event.preventDefault()
      const nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0
      focusableElements[nextIndex].focus()
      break
    case 'ArrowUp':
      event.preventDefault()
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1
      focusableElements[prevIndex].focus()
      break
  }
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target) && 
      dropdownButtonRef.value && !dropdownButtonRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-brand">
        <router-link to="/" class="logo">Hotel Booking</router-link>
        
        <!-- Mobile menu toggle button -->
        <button 
          class="mobile-menu-toggle" 
          @click="toggleMobileMenu" 
          aria-label="Toggle navigation menu"
          :aria-expanded="mobileMenuOpen"
        >
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
      
      <div class="navbar-menu" :class="{ 'is-active': mobileMenuOpen }">
        <!-- Common navigation links -->
        <div class="nav-links">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">Home</router-link>
          <router-link to="/about" class="nav-link" @click="closeMobileMenu">About</router-link>
          <router-link to="/rooms" class="nav-link" @click="closeMobileMenu">Rooms</router-link>
          <router-link to="/contact" class="nav-link" @click="closeMobileMenu">Contact</router-link>
          <router-link v-if="user" to="/create-booking" class="nav-link highlight" @click="closeMobileMenu">Book Now</router-link>
        </div>
        
        <div class="navbar-end">
          <!-- Show these links when user is logged in -->
          <template v-if="user">
            <div class="user-menu">
              <span class="welcome-text">Welcome, {{ user.name }}</span>
              <div class="dropdown">
                <button 
                  ref="dropdownButtonRef"
                  class="dropdown-button" 
                  @click="toggleDropdown" 
                  aria-haspopup="true" 
                  :aria-expanded="dropdownOpen"
                  aria-label="User menu"
                >
                  <div class="avatar">{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</div>
                  <span class="dropdown-icon">{{ dropdownOpen ? '▲' : '▼' }}</span>
                </button>
                <div 
                  ref="dropdownRef"
                  class="dropdown-content" 
                  v-if="dropdownOpen" 
                  role="menu"
                  aria-orientation="vertical"
                >
                  <router-link to="/profile" class="dropdown-item" @click="closeDropdown" role="menuitem">My Profile</router-link>
                  <router-link to="/my-bookings" class="dropdown-item" @click="closeDropdown" role="menuitem">My Bookings</router-link>
                  <a href="#" @click.prevent="logout" class="dropdown-item" role="menuitem">Logout</a>
                </div>
              </div>
            </div>
          </template>
          
          <!-- Show these links when user is not logged in -->
          <template v-else>
            <router-link to="/login" class="navbar-item" @click="closeMobileMenu">Login</router-link>
            <router-link to="/register" class="navbar-item register-button" @click="closeMobileMenu">Register</router-link>
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
  justify-content: space-between;
  flex-grow: 1;
  margin-left: 30px;
}

.navbar-end {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-links {
  display: flex;
  gap: 15px;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #000;
}

.nav-link.highlight {
  background-color: #000;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.nav-link.highlight:hover {
  background-color: #333;
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
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.dropdown-button:hover, .dropdown-button:focus {
  background-color: rgba(0, 0, 0, 0.05);
  outline: none;
}

.dropdown-button:focus-visible {
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
}

.dropdown-icon {
  margin-left: 5px;
  font-size: 10px;
}

.dropdown-content {
  position: absolute;
  right: 0;
  background-color: #fff;
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 100;
  margin-top: 10px;
  transition: opacity 0.2s ease;
}

.dropdown-item {
  color: #333;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 0.2s ease, color 0.2s ease;
  border-radius: 4px;
  margin: 4px;
}

.dropdown-item:hover, .dropdown-item:focus {
  background-color: #f5f5f5;
  color: #000;
}

.dropdown-item:focus-visible {
  outline: 2px solid rgba(0, 0, 0, 0.2);
  outline-offset: -2px;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .welcome-text {
    display: block;
  }
}

/* Mobile menu toggle */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.mobile-menu-toggle .bar {
  height: 3px;
  width: 100%;
  background-color: #000;
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* Mobile styles */
@media (max-width: 768px) {
  .navbar {
    padding: 15px 0;
  }
  
  .container {
    flex-wrap: wrap;
  }
  
  .navbar-brand {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 20px;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .navbar-menu {
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    background-color: #fff;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    margin: 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    z-index: 100;
  }
  
  .navbar-menu.is-active {
    max-height: 500px;
    padding: 15px;
  }
  
  .nav-links {
    flex-direction: column;
    width: 100%;
    padding: 10px 0;
  }
  
  .nav-link {
    padding: 10px 15px;
    width: 100%;
    border-bottom: 1px solid #eee;
  }
  
  .nav-link:last-child {
    border-bottom: none;
  }
  
  .navbar-end {
    width: 100%;
    justify-content: center;
    padding-top: 10px;
    border-top: 1px solid #eee;
    margin-top: 10px;
  }
  
  .navbar-item {
    margin-left: 0;
    margin-right: 15px;
  }
  
  .register-button {
    padding: 6px 12px;
  }
  
  .user-menu {
    width: 100%;
    justify-content: center;
  }
  
  .dropdown {
    position: static;
  }
  
  .dropdown-content {
    position: relative;
    width: 100%;
    margin-top: 10px;
    box-shadow: none;
    border: 1px solid #eee;
  }
}
</style>
