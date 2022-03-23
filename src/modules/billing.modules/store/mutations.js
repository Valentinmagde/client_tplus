import * as types from './mutations-types'

export default {
  [types.SET_ASSOCIATION_BILLS](state, data) {
    state.association_bills = data
  },

  [types.SET_BILL](state, data) {
    state.bill = data
  },

  [types.NO_COMMIT](state) {
    // Does nothing
    state
  }
}
