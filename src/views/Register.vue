<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store'
import authService from '../services/auth.service.js'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

async function register() {
    if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (!email.value.includes('@')) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  try {
    isLoading.value = true
    errorMessage.value = ''

        const userData = {
      name: name.value,
      email: email.value,
      password: password.value
    }

    const response = await authService.register(userData)

        if (response.user) {
            store.setUser(response.user)

            router.push('/')
    } else {
      errorMessage.value = response.message || 'Registration failed. Please try again.'
    }
  } catch (error) {
    console.error('Registration error:', error)
    errorMessage.value = error.message || 'An error occurred during registration. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register">
    <div class="container">
      <div class="register-form">
        <h1>Register</h1>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            placeholder="Enter your full name"
          >
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
          >
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            v-model="confirmPassword"
            placeholder="Confirm your password"
          >
        </div>

        <button class="register-button" @click="register" :disabled="isLoading">
          <span v-if="isLoading" class="loading-spinner-small"></span>
          <span v-else>Register</span>
        </button>

        <div class="auth-links">
          <p>Already have an account? <router-link to="/login">Login</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register {
  padding: 40px 0;
}

.container {
  max-width: 450px;
  margin: 0 auto;
  padding: 0 20px;
}

.register-form {
  background-color: #f5f5f5;
  padding: 35px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

.register-form h1 {
  margin-bottom: 25px;
  font-size: 28px;
  text-align: center;
  font-weight: 700;
  color: #333;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  font-size: 16px;
  border-radius: 4px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-group input:focus {
  border-color: #666;
  outline: none;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 8px;
  font-weight: 500;
}

.register-button {
  background-color: #000;
  color: #fff;
  padding: 14px 20px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  margin-bottom: 25px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.register-button:hover {
  background-color: #333;
}

.register-button:active {
  transform: translateY(1px);
}

.loading-spinner-small {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
  margin-right: 5px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.register-button:disabled {
  background-color: #999;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  font-size: 15px;
  margin-top: 10px;
}

.login-link a {
  color: #000;
  text-decoration: underline;
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-link a:hover {
  color: #555;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .register {
    padding: 60px 0;
    display: flex;
    align-items: center;
    min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  }

  .container {
    max-width: 480px;
  }

  .register-form {
    padding: 40px;
  }

  .register-form h1 {
    font-size: 32px;
  }
}

/* Tablet styles */
@media (max-width: 1023px) and (min-width: 769px) {
  .register {
    padding: 50px 0;
  }

  .container {
    max-width: 500px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .register {
    padding: 30px 0;
  }

  .container {
    padding: 0 15px;
  }

  .register-form {
    padding: 25px 20px;
  }

  .register-form h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    font-size: 14px;
  }

  .form-group input {
    padding: 10px 12px;
  }

  .register-button {
    padding: 12px;
    font-size: 15px;
  }
}
</style>
