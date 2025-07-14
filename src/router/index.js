import { createRouter, createWebHistory } from 'vue-router'

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
    component: () => import('../views/ContactInformation.vue')
  },
  {
    path: '/confirmation',
    name: 'Confirmation',
    component: () => import('../views/Confirmation.vue')
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
  const isAuthenticated = localStorage.getItem('user') !== null
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
