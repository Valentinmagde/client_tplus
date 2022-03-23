
import * as types from './mutation-types';
import defaultState from './defaultState'

export default {

	/* eslint-disable no-unused-vars */
	[types.INITIALIZE](state, payload){
		state.token = payload.accessToken
    state.refreshToken = payload.refreshToken
		state.expires_in = payload.expires_in
	},

	[types.LOG_OUT](state){
		for(var key in defaultState) {
      if(state.hasOwnProperty(key)) {
        state[key] = defaultState[key];
      }
    }
	},

	[types.SET_CREDENTIALS](state, payload){

		state.token = payload.accessToken
    state.refreshToken = payload.refreshToken
		state.expires_in = payload.expires_in

		if (payload.hasOwnProperty('user')) {
        state.user = payload.user
        state.user_id = payload.user.id
    }

  },

  [types.SET_USER](state, user_data){
    state.user = user_data;
    state.user_id = user_data.id
  },

  [types.SET_USER_ID](state, userId){
    state.user_id = userId;
  },

  [types.SET_PHONE](state, phone){
    state.phone = phone;
  },

  [types.SET_USER_ROLES](state, roles) {
    state.roles = Array.from(roles)
  },

  [types.ADD_USER_ROLES](state, payload){
    state.roles.push(payload)
  },

  [types.SET_RESET_ROLES](state) {
    state.roles = []
  },


  [types.SET_NEW_ROLE](state, payload) {
    let check = state.roles.includes(payload)
    if (!check)
      state.roles.push(payload)
  },

  [types.REMOVE_ROLE](state, payload) {
    state.roles = state.roles.filter(e => e !== payload)
  },

}
