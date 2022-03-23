
import state from './state.js'
import mutations from './mutations.js'
import actions from './actions.js'
import getters from './getters.js'

export default {
  isRegistered: false,
  namespaced: true,
  state: state,
  mutations,
  actions,
  getters
}
