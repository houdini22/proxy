import axios from 'axios'

import config from '../config/development'

axios.defaults.withCredentials = true

let axiosInstance = axios.create({
  baseURL: config.api.url,
  timeout: 10000
})

export default axiosInstance
