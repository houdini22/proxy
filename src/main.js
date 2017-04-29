import Vue from './bootstrap'
import App from './App.vue'
import router from './router'
import store from './store/index'

// fire app
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
