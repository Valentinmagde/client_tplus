export default {
  getAllRoles: state => {
    return state.roles
  },

  getNewRole: state => {
    return state.role
  },

  getMember: state => {
    return state.member
  },

  getMembers: state => {
    return state.members
  }
}
