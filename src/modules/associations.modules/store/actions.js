

import * as types from './mutation-types';
import * as api   from '../services/api';
import http_service from '../services/api/httpService';
import axios from "@/axios.js";

import membershipActions from '../modules/membership.modules/store/actions'
import activitiesActions from '../modules/activities.modules/store/actions'
import newsActions from '../modules/news.modules/store/actions'
import calendarActions from '../modules/calendar.modules/store/actions'
import documentsActions from '../modules/documents.modules/store/actions'
import financesActions from '../modules/finances.modules/store/actions'
import sessionsActions from '../modules/sessions.modules/store/actions'
import parametersActions from '../modules/parameters.modules/store/actions'
import cyclesActions from '../modules/cycles.modules/store/actions'

const fluck = (credentials) => credentials.data.data

export default {

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * @deprecated since 14/05/2021
   * @returns
   */
  getRequest({commit}, payload) {
    return http_service.get({commit}, payload)
  },

  getRequestUpdated({commit}, payload) {
    return http_service.getUpdated({commit}, payload)
  },

  postRequest({commit}, payload) {
    return api.postRequest({commit}, payload);
  },

  putRequest({commit}, payload) {
    return http_service.put({commit}, payload)
  },

  removeRecord({ commit }, payload) {
    return http_service.delete({commit}, payload)
  },


  [types.FETCH_USER_ASSOCIATION]({commit}, payload){

    return api.fetchUserAssociationApi(payload)
       .then(e => fluck(e))
       .then(e => {

            commit('FETCH_USER_ASSOCIATION',e)
          return e
        })
       .then(data => {
          let currentAssociation = localStorage.getItem('association_id')
          let check = data.find(e => e.id == currentAssociation)

          if (check){
            commit('SET_CURRENT_ASSOCIATION',check)
            //commit('SET_AGS',check.ags)
          }
            return data

       })
  },


  async [types.FETCH_USER_ASSOCIATION_ROLES]({commit}, payload){

    return await api.assocationRolesApi(payload)
          .then((e) => {

             commit('FETCH_USER_ASSOCIATION_ROLES',e.data.data);
             return e.data.data
          }).catch(() => false)
  },

  fetchUserRoles({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(payload.resourceUrl)
        .then((response) => {
          commit(payload.commitAction, Array.from(response.data.data))
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  // getManagerByCode({ commit }, payload) {
  //   return new Promise((resolve, reject) => {
  //     axios.get(`/api/backoffice-user/${ payload.code }/get`)
  //       .then((response) => {
  //         if(payload.hasOwnProperty("commitAction"))
  //           commit(payload.commitAction, Array.from(response.data.data))
  //         resolve(response)
  //       })
  //       .catch((error) => { reject(error.response.data) })
  //   })
  // },

  // getAssociationManagers({ commit }, payload) {
  //   return new Promise((resolve, reject) => {
  //     axios.get(`/api/association/${ payload.association_id }/managers`)
  //       .then((response) => {
  //         if(payload.hasOwnProperty("commitAction"))
  //           commit(payload.commitAction, Array.from(response.data.data))
  //         resolve(response)
  //       })
  //       .catch((error) => { reject(error.response.data) })
  //   })
  // },

  ...membershipActions,
  ...activitiesActions,
  ...newsActions,
  ...calendarActions,
  ...documentsActions,
  ...financesActions,
  ...sessionsActions,
  ...parametersActions,
  ...cyclesActions,
}
