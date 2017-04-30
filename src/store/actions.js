import axios from '../modules/axios'

export function fetchStatistics ({commit}, data = {}) {
  axios.get('/statistics').then((response) => {
    commit('setStatistics', response.data)
  })
}

