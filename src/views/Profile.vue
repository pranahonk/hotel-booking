<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/auth.service.js'
import store from '../store'

const router = useRouter()
const user = ref(null)
const loading = ref(true)
const error = ref(null)
const isEditing = ref(false)
const updateSuccess = ref(false)
const updateError = ref(null)
const updateLoading = ref(false)

// Form data for editing
const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Form validation errors
const validationErrors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

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
      
      // Initialize form data with current user data
      formData.name = user.value.name
      formData.email = user.value.email
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

function startEditing() {
  isEditing.value = true
  updateSuccess.value = false
  updateError.value = null
  
  // Reset validation errors
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key] = ''
  })
  
  // Reset password fields
  formData.password = ''
  formData.confirmPassword = ''
}

function cancelEditing() {
  isEditing.value = false
  updateError.value = null
  
  // Reset form data to current user data
  formData.name = user.value.name
  formData.email = user.value.email
  formData.password = ''
  formData.confirmPassword = ''
}

function validateForm() {
  let isValid = true
  
  // Reset validation errors
  Object.keys(validationErrors).forEach(key => {
    validationErrors[key] = ''
  })
  
  // Validate name
  if (!formData.name.trim()) {
    validationErrors.name = 'Name is required'
    isValid = false
  }
  
  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email.trim()) {
    validationErrors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.email)) {
    validationErrors.email = 'Please enter a valid email address'
    isValid = false
  }
  
  // Validate password (only if provided)
  if (formData.password) {
    if (formData.password.length < 6) {
      validationErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match'
      isValid = false
    }
  }
  
  return isValid
}

async function updateProfile() {
  if (!validateForm()) return
  
  try {
    updateLoading.value = true
    updateError.value = null
    
    const updateData = {
      name: formData.name,
      email: formData.email
    }
    
    // Only include password if it was provided
    if (formData.password) {
      updateData.password = formData.password
    }
    
    // Call API to update user profile
    const response = await authService.updateProfile(updateData)
    
    if (response && response.user) {
      // Update local user data
      user.value = response.user
      
      // Update user in store
      store.setUser(response.user)
      
      // Show success message
      updateSuccess.value = true
      
      // Exit edit mode
      isEditing.value = false
    } else {
      updateError.value = 'Failed to update profile'
    }
  } catch (err) {
    console.error('Error updating profile:', err)
    updateError.value = err.message || 'An error occurred while updating your profile'
  } finally {
    updateLoading.value = false
  }
}

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
          <!-- Success message -->
          <div v-if="updateSuccess" class="success-message">
            <p>Profile updated successfully!</p>
          </div>
          
          <!-- Update error message -->
          <div v-if="updateError" class="error-message">
            <p>{{ updateError }}</p>
          </div>
          
          <div class="user-header">
            <div class="avatar">{{ user.name ? user.name.charAt(0).toUpperCase() : 'U' }}</div>
            <div class="user-details">
              <h2>{{ user.name }}</h2>
              <p>{{ user.email }}</p>
            </div>
          </div>
          
          <!-- View mode -->
          <div v-if="!isEditing" class="profile-section">
            <div class="section-header">
              <h3>Account Information</h3>
              <button class="edit-button" @click="startEditing">Edit Profile</button>
            </div>
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
          
          <!-- Edit mode -->
          <div v-else class="profile-section edit-form">
            <h3>Edit Profile</h3>
            <form @submit.prevent="updateProfile">
              <div class="form-group">
                <label for="name">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="formData.name" 
                  :class="{ 'error-input': validationErrors.name }"
                />
                <span v-if="validationErrors.name" class="error-text">{{ validationErrors.name }}</span>
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="formData.email" 
                  :class="{ 'error-input': validationErrors.email }"
                />
                <span v-if="validationErrors.email" class="error-text">{{ validationErrors.email }}</span>
              </div>
              
              <div class="form-group">
                <label for="password">New Password (leave blank to keep current)</label>
                <input 
                  type="password" 
                  id="password" 
                  v-model="formData.password" 
                  :class="{ 'error-input': validationErrors.password }"
                />
                <span v-if="validationErrors.password" class="error-text">{{ validationErrors.password }}</span>
              </div>
              
              <div class="form-group">
                <label for="confirmPassword">Confirm New Password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  v-model="formData.confirmPassword" 
                  :class="{ 'error-input': validationErrors.confirmPassword }"
                  :disabled="!formData.password"
                />
                <span v-if="validationErrors.confirmPassword" class="error-text">{{ validationErrors.confirmPassword }}</span>
              </div>
              
              <div class="form-actions">
                <button type="button" class="cancel-button" @click="cancelEditing" :disabled="updateLoading">Cancel</button>
                <button type="submit" class="save-button" :disabled="updateLoading">
                  <span v-if="updateLoading">Saving...</span>
                  <span v-else>Save Changes</span>
                </button>
              </div>
            </form>
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

/* Success and error messages */
.success-message {
  background-color: #dff0d8;
  color: #3c763d;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.error-message {
  background-color: #f2dede;
  color: #a94442;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.section-header h3 {
  font-size: 18px;
  margin: 0;
}

.edit-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.edit-button:hover {
  background-color: #45a049;
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

/* Edit form styles */
.edit-form {
  background-color: #fff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.error-input {
  border-color: #dc3545 !important;
}

.error-text {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
}

.cancel-button {
  background-color: #f8f9fa;
  color: #212529;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #e2e6ea;
}

.save-button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.save-button:hover {
  background-color: #0069d9;
}

.save-button:disabled,
.cancel-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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
