import genericActivitiesGetters from '../modules/generics.modules/store/getters'
import eventsActivitiesGetters from '../modules/events.modules/store/getters'
import solidaritiesActivitiesGetters from '../modules/solidarities.modules/store/getters'
import tontinesActivitiesGetters from '../modules/tontines.modules/store/getters'
import mutualsActivitiesGetters from '../modules/mutuals.modules/store/getters'

export default {
  getAccount: state => {
    return state.account
  },

  getUserAccounts: state => {
    return state.user_accounts
  },

  getStatistics: state => {
    return state.statistics
  },

  getMemberActivities: state => {
    return state.member_activities
  },

  getAccounts: state => {
    return state.accounts
  },

  getAllAccounts: state => {
    return state.all_accounts
  },

  getActivity: state => {
    return state.activite
  },

  getActivities: state => {
    return state.activites
  },

  getNotes: state => {
    return state.notes
  },

  ...genericActivitiesGetters,
  ...eventsActivitiesGetters,
  ...solidaritiesActivitiesGetters,
  ...tontinesActivitiesGetters,
  ...mutualsActivitiesGetters,
}
