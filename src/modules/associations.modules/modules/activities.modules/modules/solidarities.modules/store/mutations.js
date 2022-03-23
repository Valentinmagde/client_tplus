import * as types from './mutation-types'

export default {
  [types.SET_SOLIDARITES](state, solidartes) {
    state.solidarites = solidartes
  },

  [types.SET_ASSISTANCES](state, assistances) {
    state.assistances = assistances
  },

  [types.SET_TYPE_ASSISTANCES](state, types) {
    state.type_assistances = types
  },

  [types.SET_TYPES_ASSISTANCES](state, types) {
    state.types_assistances = types
  },
}
