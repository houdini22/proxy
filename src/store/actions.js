import axios from '../modules/axios'

export function fetchStatistics ({commit}, data = {}) {
  axios.get('/statistics').then((response) => {
    commit('setStatistics', response.data)
  })
}

export function login ({commit}, data = {}) {
  axios.post('/login', data.formData).then((response) => {
    commit('setSession', response.data)
    data.success()
  }).catch((error) => {
    data.error(error.response.data)
  })
}

export function logout ({commit}, data = {}) {
  axios.get('/logout').then((response) => {
    commit('setSession', {
      isLoggedIn: false,
      user: {}
    })
    data.success()
  })
}
