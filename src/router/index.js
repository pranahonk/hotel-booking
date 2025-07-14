import { createRouter, createWebHistory } from 'vue-router'
import RoomSearch from '../views/RoomSearch.vue'
import SelectRoom from '../views/SelectRoom.vue'
import ContactInformation from '../views/ContactInformation.vue'
import Confirmation from '../views/Confirmation.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import MyBookings from '../views/MyBookings.vue'
import BookingDetails from '../views/BookingDetails.vue'
import CreateBooking from '../views/CreateBooking.vue'
import authService from '../services/auth.service.js'

const routes = [
  {
    path: '/',
    name: 'RoomSearch',
    component: RoomSearch
  },
  {
    path: '/select-room',
    name: 'SelectRoom',
    component: SelectRoom
  },
  {
    path: '/contact-information',
    name: 'ContactInformation',
    component: ContactInformation,
    meta: { requiresAuth: true }
  },
  {
    path: '/confirmation',
    name: 'Confirmation',
    component: Confirmation,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/:id',
    name: 'BookingDetails',
    component: BookingDetails,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-booking',
    name: 'CreateBooking',
    component: CreateBooking,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard to check for authentication
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Redirect to login with return path
    next({ 
      path: '/login', 
      query: { redirect: to.fullPath } 
    })
  } else {
    next()
  }
})

export default router
