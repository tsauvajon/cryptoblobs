import Vue from 'vue'
import App from './App.vue'
import Toast from 'vue-toastification'

import 'vue-toastification/dist/index.css';

import store from './store'

Vue.config.productionTip = false

const toastOptions = {
  position: 'top-center',
}
Vue.use(Toast, toastOptions)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
