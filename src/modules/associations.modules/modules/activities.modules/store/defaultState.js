import genericActivitiesState from '../modules/generics.modules/store/defaultState'
import eventsActivitiesState from '../modules/generics.modules/store/defaultState'
import solidaritiesActivitiesState from '../modules/solidarities.modules/store/defaultState'
import tontinesActivitiesState from '../modules/tontines.modules/store/defaultState'
import mutualsActivitiesState from '../modules/mutuals.modules/store/defaultState'

export default {
  // Members activities accounts
  accounts: [],

  // Store all the association's activities' accounts
  all_accounts: [],

  // Current user accounts
  user_accounts: [],

  // Selected account
  account: '',

  // Statistics
  statistics: [],

  // Current member activities
  member_activities : [],

  // Fetching association data
  activites: [],

  activite: '',

  activites_all: [],

  mise_fonds: [],

  mises_fonds: [],

  //Toutes les notes d'une activité
  notes: [],
  
  //Note d'une activité
  note: [],
  ...genericActivitiesState,
  ...eventsActivitiesState,
  ...solidaritiesActivitiesState,
  ...tontinesActivitiesState,
  ...mutualsActivitiesState,
}
