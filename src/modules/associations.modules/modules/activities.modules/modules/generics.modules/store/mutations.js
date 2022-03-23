import * as types from './mutation-types'

export default {
  [types.SET_ACTIVITES_GENERIQUES](state, activites_generiques) {
    state.activites_generiques = activites_generiques
  },
}
