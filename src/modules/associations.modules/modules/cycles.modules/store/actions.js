import axios from '@/axios.js'
import http_service from '../../../services/api/httpService';

export default {
  fetchCycles({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(payload.resourceUrl)
        .then((response) => {
          commit(payload.commitAction, response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },

  fetchAgsByCycle({ commit }, payload) {
    return http_service.get({commit}, payload)
  },
  fetchAgById({ commit }, payload) {
    return http_service.get({commit}, payload)
  },
}
