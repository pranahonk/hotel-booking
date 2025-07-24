import { createRouter, createWebHistory } from 'vue-router'
import RoomSearch from '../views/RoomSearch.vue'
import SelectRoom from '../views/SelectRoom.vue'
import ContactInformation from '../views/ContactInformation.vue'
import Confirmation from '../views/Confirmation.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import MyBookings from '../views/MyBookings.vue'
import BookingDetails from '../views/BookingDetails.vue'
// CreateBooking feature removed
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
    path: '/my-bookings',
    name: 'MyBookings',
    component: MyBookings,
    meta: { requiresAuth: true }
  },
  {
    path: '/bookings/my-bookings',
    redirect: '/my-bookings'
  },
  {
    path: '/bookings/:id',
    name: 'BookingDetails',
    component: BookingDetails,
    meta: { requiresAuth: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()

  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
