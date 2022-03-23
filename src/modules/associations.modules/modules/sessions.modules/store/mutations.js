import * as types from './mutation-types'

export default {
  // Ags
  [types.SET_AGS](state, ags) {
    state.ags = ags
  },

  [types.SET_AGS_CYCLE](state, ags) {
    state.ags_cycle = ags
  },

  [types.SET_AG](state, ag) {
    state.ag = ag
  },

  [types.SET_CURRENT_AG](state,payload) {

    state.currentAssociationAg = payload
   },

  [types.SET_REPORT](state, newReport) {
    state.report = newReport
  }
}
