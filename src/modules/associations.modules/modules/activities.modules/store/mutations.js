import * as types from './mutation-types'
import genericActivitiesMutations from '../modules/generics.modules/store/mutations'
import eventsActivitiesMutations from '../modules/events.modules/store/mutations'
import solidaritiesActivitiesMutations from '../modules/solidarities.modules/store/mutations'
import tontinesActivitiesMutations from '../modules/tontines.modules/store/mutations'
import mutualsActivitiesMutations from '../modules/mutuals.modules/store/mutations'

export default {
  // Manage member accounts (binded to activities)
  [types.SET_ACCOUNTS](state, accounts) {
    state.accounts = accounts
  },

  [types.SET_MEMBER_ACCOUNTS](state, accounts) {
    state.all_member_accounts = accounts
  },

  [types.SET_ALL_ACCOUNTS](state, all_accounts) {
    state.all_accounts = all_accounts
  },

  [types.SET_USER_ACCOUNTS](state, accounts) {
    state.user_accounts = accounts
  },

  [types.SET_STATISTICS](state, statistics) {
    state.statistics = statistics
  },

  [types.SET_ACCOUNT](state, accounts) {
    state.account = accounts
  },

  [types.SET_MEMBER_ACTIVITIES](state, activities) {
    state.member_activities = activities
  },

  [types.REMOVE_ACCOUNT](state, itemId) {
    const ItemIndex = state.accounts.findIndex((acc) => acc.id == itemId)
    state.accounts.splice(ItemIndex, 1)
  },

  // Activities
  [types.SET_ACTIVITES](state, activites) {
    state.activites = activites
  },

  [types.SET_ALL_ACTIVITIES](state, activites) {
    state.activites_all = activites
  },

  [types.SET_ACTIVITE](state, activite) {
    state.activite = activite
  },

  [types.SET_NOTES](state, notes) {
    state.notes = notes
  },

  [types.SET_NOTE](state, note) {
    state.note = note
  },

  [types.REMOVE_ACTIVITE](state, itemId) {
    const itemIndex1 = state.activites_all.findIndex((activity) => activity.id === itemId);
    const itemIndex2 =  state.activites.findIndex((activity) => activity.id === itemId);

    if(itemIndex1 > -1) state.activites_all.splice(itemIndex1, 1);
    if(itemIndex2 > -1) state.activites.splice(itemIndex2, 1);
  },

  [types.REMOVE_NOTE](state, itemId) {
    const ItemIndex = state.notes.findIndex((acc) => acc.id == itemId)
    state.notes.splice(ItemIndex, 1)
  },

  ...genericActivitiesMutations,
  ...eventsActivitiesMutations,
  ...solidaritiesActivitiesMutations,
  ...tontinesActivitiesMutations,
  ...mutualsActivitiesMutations,
}
