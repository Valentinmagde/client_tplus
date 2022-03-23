import * as types from './mutation-types'

export default {
  [types.SET_TONTINES](state, tontines) {
    state.tontines = tontines
  },

  [types.SET_LOTS](state, lots) {
    state.lots = lots.sort((a, b) => (a.membre > b.membre) ? 1 : -1)
  },

  [types.SET_BENEFICIAIRES](state, beneficiaires) {
    state.beneficiaires = beneficiaires
  },

  [types.SET_CALENDRIERS](state, calendriers) {
    state.calendriers = calendriers
  },

  [types.SET_TIRAGES](state, tirages) {
    state.tirages = tirages
  },

  [types.REMOVE_TONTINE](state, itemId) {
    const ItemIndex = state.tontines.findIndex((acc) => acc.id == itemId)
    state.tontines.splice(ItemIndex, 1)
  },
}
