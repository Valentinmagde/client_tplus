import * as types from './mutation-types'

export default {
  [types.SET_MUTUELLES](state, mutuelles) {
    state.mutuelles = mutuelles
  },

  [types.SET_CREDITS](state, credits) {
    state.credits = credits
  },

  [types.SET_CREDIT](state, credit) {
    state.credit = credit
  },

  [types.SET_MISE_FONDS](state, fonds) {
    state.mise_fonds = fonds
  },

  [types.SET_MISES_FONDS](state, fonds) {
    state.mises_fonds = fonds
  },
}
