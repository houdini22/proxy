import '@/styles/main.scss'

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueForm from 'vue-form'
import axios from 'axios'
import VueAxios from 'vue-axios'
import BootstrapVue from 'bootstrap-vue'

import config from './config/development'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueForm)
Vue.use(BootstrapVue)

let axiosInstance = axios.create({
  baseURL: config.api.url,
  timeout: 10000
})

Vue.use(VueAxios, axiosInstance)

// configure
Vue.config.productionTip = false
// end of configure

// mixins
// end of mixins

// components
// end of components

export default Vue
