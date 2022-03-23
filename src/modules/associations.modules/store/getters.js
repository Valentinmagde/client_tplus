import membershipGetters from '../modules/membership.modules/store/getters'
import activitiesGetters from '../modules/activities.modules/store/getters'
import newsModuleGetters from '../modules/news.modules/store/getters'
import calendarModuleGetters from '../modules/calendar.modules/store/getters'
import documentsModuleGetters from '../modules/documents.modules/store/getters'
import financesModuleGetters from '../modules/finances.modules/store/getters'
import sessionsModuleGetters from '../modules/sessions.modules/store/getters'
import parametersModuleGetters from '../modules/parameters.modules/store/getters'
import cyclesModuleGetters from '../modules/cycles.modules/store/getters'

export default {

  getAllAssociations: state => state.associations,

  getCurrentAssociation: state => state.currentAssociation,

  getcurrentAssociationAg: state => state.currentAssociationAg,

  getUserRoles: state => (state.userRoles)? Array.from(state.userRoles): [],

  getAssociation: state => {
    return state.association
  },

  getMemberHas: state => {
    return state.memberHas
  },

  ...membershipGetters,

  ...activitiesGetters,

  ...newsModuleGetters,

  ...calendarModuleGetters,

  ...documentsModuleGetters,

  ...financesModuleGetters,

  ...sessionsModuleGetters,

  ...parametersModuleGetters,

  ...cyclesModuleGetters,

}


