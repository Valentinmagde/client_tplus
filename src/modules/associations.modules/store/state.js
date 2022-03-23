import membershipModuleState from '../modules/membership.modules/store/state'
import activitiesModuleState from '../modules/activities.modules/store/state'
import newsModuleState from '../modules/news.modules/store/state'
import calendarModuleState from '../modules/calendar.modules/store/state'
import documentsModuleState from '../modules/documents.modules/store/state'
import financesModuleState from '../modules/finances.modules/store/state'
import sessionsModuleState from '../modules/sessions.modules/store/state'
import parametersModuleState from '../modules/parameters.modules/store/state'
import cyclesModuleState from '../modules/cycles.modules/store/state'

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

  userRoles: [],
}
