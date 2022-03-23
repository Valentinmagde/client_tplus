import http_service from '../../../services/api/httpService';
import axios from '@/axios'

export default {
  fetchMemberActivities({ commit }, payload) {
    return http_service.get({commit}, payload)
  },

  fetchPossibleRoles({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(payload.resourceUrl)
        .then((response) => {
          commit(payload.commitAction, response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  fetchMember({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get("/api/member/" + payload.memberId)
        .then((response) => {
          commit('SET_MEMBER', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  fetchMembers({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(payload.resourceUrl)
        .then((response) => {
          commit('SET_MEMBERS', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  // fetchUsers({ commit }) {
  //   return new Promise((resolve, reject) => {
  //     axios.get("/api/user-management/users")
  //       .then((response) => {
  //         commit('SET_USERS', response.data)
  //         resolve(response)
  //       })
  //       .catch((error) => { reject(error) })
  //   })
  // },

  fetchUsersByMember({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(payload.resourceUrl)
        .then((response) => {
          commit('SET_USERS_MEMBER', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  // fetchUser(context, userId) {
  //   return new Promise((resolve, reject) => {
  //     axios.get(`/api/user-management/users/${userId}`)
  //       .then((response) => {
  //         resolve(response)
  //       })
  //       .catch((error) => { reject(error) })
  //   })
  // },

  // removeUserMember({ commit }, userId) {
  //   return new Promise((resolve, reject) => {
  //     axios.delete(`/api/user-management/users/${userId}`)
  //       .then((response) => {
  //         commit('REMOVE_USER_MEMBER', userId)
  //         resolve(response)
  //       })
  //       .catch((error) => { reject(error) })
  //   })
  // },
}

