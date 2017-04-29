import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import * as mutations from './mutations'
import state from './default-state'

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

export default store
