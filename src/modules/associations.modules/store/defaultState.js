import membershipModuleState from '../modules/membership.modules/store/defaultState'
import activitiesModuleState from '../modules/activities.modules/store/defaultState'
import newsModuleState from '../modules/news.modules/store/defaultState'
import calendarModuleState from '../modules/calendar.modules/store/defaultState'
import documentsModuleState from '../modules/documents.modules/store/defaultState'
import financesModuleState from '../modules/finances.modules/store/defaultState'
import sessionsModuleState from '../modules/sessions.modules/store/defaultState'
import parametersModuleState from '../modules/parameters.modules/store/defaultState'
import cyclesModuleState from '../modules/cycles.modules/store/defaultState'

export default {

  associations: [],

  currentAssociation: null,

  // Membership module state
  ...membershipModuleState,

  // Activities module state
  ...activitiesModuleState,

  // News module state
  ...newsModuleState,

  // Calendar module state
  ...calendarModuleState,

  // Documents module state
  ...documentsModuleState,

  // Finances module state
  ...financesModuleState,

  // Sessions module state
  ...sessionsModuleState,

  // Parameters module state
  ...parametersModuleState,

  // Cycles module state
  ...cyclesModuleState,

  //Membre has
  memberHas: '',

  userRoles: []
}
