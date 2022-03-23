import * as types from './mutation-types'

export default {

  // Manage member account
  [types.SET_MEMBERS](state, members) {
    state.members = members
  },

  [types.SET_MEMBER](state, member) {
    state.member = member
  },

  [types.SET_USERS_MEMBER](state, users){
    state.users_member = users
  },

  [types.REMOVE_MEMBER](state, itemId) {
      const userIndex = state.members.findIndex((u) => u.id == itemId)
      state.members.splice(userIndex, 1)
  },

  [types.SET_USERS](state, users) {
    state.users = users
  },

  [types.SET_ROLE](state,roles) {
    state.role = roles
  },

  [types.SET_ROLES](state, roles) {
    state.roles = roles
  },

  [types.SET_RESET_ROLES](state) {
    state.roles = []
  },

  [types.REMOVE_USER_MEMBER](state, itemId) {
      const userIndex = state.users.findIndex((u) => u.id == itemId)
      state.users.splice(userIndex, 1)
  },
}
