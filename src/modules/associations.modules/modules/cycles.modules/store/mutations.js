import * as types from './mutation-types'

export default {
  // Cycles
  [types.SET_CYCLES](state, cycles) {
    state.cycles = cycles
  },

  [types.SET_CYCLE](state, cycle) {
    state.cycle = cycle
  },

  [types.REMOVE_CYCLE](state, itemId) {
    const ItemIndex = state.cycles.findIndex((acc) => acc.id == itemId)
    state.cycles.splice(ItemIndex, 1)
  },
}
