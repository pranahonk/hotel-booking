import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/auth.service.js'

const routes = [
  {
    path: '/',
    name: 'RoomSearch',
    component: () => import('../views/RoomSearch.vue')
  },
  {
    path: '/select-room',
    name: 'SelectRoom',
    component: () => import('../views/SelectRoom.vue')
  },
  {
    path: '/contact-information',
    name: 'ContactInformation',
    component: () => import('../views/ContactInformation.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/confirmation',
    name: 'Confirmation',
    component: () => import('../views/Confirmation.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
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
