
import * as types from './mutation-types';
import defaultState from './defaultState';

import membershipMutations from '../modules/membership.modules/store/mutations'
import activitiesMutations from '../modules/activities.modules/store/mutations'
import newsMutations from '../modules/news.modules/store/mutations'
import calendarMutations from '../modules/calendar.modules/store/mutations'
import documentsMutations from '../modules/documents.modules/store/mutations'
import financesMutations from '../modules/finances.modules/store/mutations'
import sessionsMutations from '../modules/sessions.modules/store/mutations'
import parametersMutations from '../modules/parameters.modules/store/mutations'
import cyclesMutations from '../modules/cycles.modules/store/mutations'

export default {

  [types.RESET](state) {
    for(var key in defaultState) {
      if(state.hasOwnProperty(key)) {
        state[key] = defaultState[key];
      }
    }
  },

  [types.NO_COMMIT](state){
    // Does nothing
    state;
  },

  // Association
  [types.FETCH_USER_ASSOCIATION](state, payload) {
    state.associations = payload
  },

  [types.FETCH_USER_ASSOCIATION_ROLES](state, payload) {
    state.userRoles = payload
  },

  [types.SET_CURRENT_ASSOCIATION](state, payload) {

    state.currentAssociation = payload
    if(payload.hasOwnProperty('ags'))
      state.ags = payload.ags
  },

  [types.SET_MEMBER_HAS](state, memberHas) {
    state.memberHas = memberHas
  },

  // Membership module
  ...membershipMutations,

  // Activities module
  ...activitiesMutations,

  // News module
  ...newsMutations,

  // Calendar module
  ...calendarMutations,

  // Documents module
  ...documentsMutations,

  // Finances module
  ...financesMutations,

  // Sessions module
  ...sessionsMutations,

  // Parameters module
  ...parametersMutations,

  // Cycles module
  ...cyclesMutations,
};
