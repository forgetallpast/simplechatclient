import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import api from './library/api'
Vue.prototype.$api = api

import * as globalStatic from './library/static'
Vue.prototype.$static = globalStatic

import storage from './library/storage'
Vue.prototype.$storage = storage

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
