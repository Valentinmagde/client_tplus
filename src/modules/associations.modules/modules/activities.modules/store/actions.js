import http_service from '../../../services/api/httpService'
import axios from '@/axios'

import genericActivitiesActions from '../modules/generics.modules/store/actions'
import eventsActivitiesActions from '../modules/generics.modules/store/actions'
import solidaritiesActivitiesActions from '../modules/generics.modules/store/actions'
import tontinesActivitiesActions from '../modules/generics.modules/store/actions'
import mutualsActivitiesActions from '../modules/mutuals.modules/store/actions'

export default {
  fetchUseractivite({ commit }, payload) {
    return http_service.get({ commit }, payload)
  },
  /**
   *
   * @param {*} param0
   * @param {*} payload
   * @deprecated since May 28, 2021.
   * @ref use fetchAssociationActivities instead
   * @returns
   */
  fetchAssociationactivite({ commit }, payload) {
    return http_service.get({ commit }, payload)
  },

  fetchAssociationActivities({ commit }, { association_id }) {
    let payload = {
      resourceUrl: `api/association/${association_id}/activite`,
      commitAction: "SET_ACTIVITES"
    };

    return http_service.getUpdated({ commit }, payload);
  },

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * @deprecated since May 28, 2021.
   * @ref use fetchActivityAccounts instead
   * @returns
   */
  fetchComptemembreActivite({ commit }, payload) {
    return http_service.get({ commit }, payload)
  },

  fetchActivityAccounts({ commit }, { activity_id }) {
    let payload = {
      resourceUrl: '/api/activite/' + activity_id + '/comptes/all',
      commitAction: 'SET_ACCOUNTS'
    };

    return http_service.getUpdated({ commit }, payload);
  },

  fetchMemberAccount({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get('/api/activite/' + payload.activityId + '/member/' + payload.memberId + '/compte')
        .then((response) => {
          commit('SET_ACCOUNT', response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  setCommit({ commit }, payload) {
    commit(payload.commitAction, payload.data)
  },

  ...genericActivitiesActions,
  ...eventsActivitiesActions,
  ...solidaritiesActivitiesActions,
  ...tontinesActivitiesActions,
  ...mutualsActivitiesActions,
}
