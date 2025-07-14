import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import clickOutside from './directives/click-outside.js'

const app = createApp(App)
app.use(router)
app.directive('click-outside', clickOutside)
app.mount('#app')
