<script setup>
import { computed } from 'vue'
import store from './store'

const user = computed(() => store.state.user)

function logout() {
  store.logout()
}
</script>

<template>
  <div class="app">
    <header class="masthead">
      <div class="container">
        <router-link to="/" class="logo">Hotel Booking</router-link>
        <nav class="nav">
          <template v-if="user">
            <span class="welcome">Welcome, {{ user.name }}</span>
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
            <a href="#" @click.prevent="logout" class="nav-link">Logout</a>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="nav-link">Register</router-link>
          </template>
        </nav>
      </div>
    </header>

    <main>
      <router-view></router-view>
    </main>

    <footer>
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Hotel Booking. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
:root {
  --primary-color: #333;
  --secondary-color: #666;
  --accent-color: #000;
  --light-color: #f4f4f4;
  --dark-color: #333;
  --max-width: 1200px;
  --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, Helvetica, sans-serif;
  line-height: 1.6;
  background: #fff;
  color: var(--dark-color);
}

#app, .app {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
}

a {
  text-decoration: none;
  color: var(--dark-color);
}

main {
  flex: 1;
  width: 100%;
}

.masthead {
  background-color: #fff;
  padding: 15px 0;
  box-shadow: var(--box-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
}

.masthead .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #000;
}

.nav {
  display: flex;
  align-items: center;
}

.nav-link {
  margin-left: 20px;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #555;
}

.welcome {
  margin-right: 20px;
}

/* Desktop styles */
@media (min-width: 1024px) {
  .masthead {
    padding: 25px 0;
  }
  
  .logo {
    font-size: 28px;
  }
  
  .nav-link {
    margin-left: 30px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .masthead .container {
    flex-direction: column;
    text-align: center;
  }
  
  .logo {
    margin-bottom: 15px;
  }
  
  .nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .nav-link {
    margin: 5px 10px;
  }
  
  .welcome {
    width: 100%;
    text-align: center;
    margin: 0 0 10px 0;
  }
}

main {
  flex: 1;
}

footer {
  background-color: var(--light-color);
  padding: 20px 0;
  text-align: center;
  margin-top: auto;
}
</style>
