import http_service from '../../../services/api/httpService'
import axios from '@/services/http/axios'

export default {
  fetchAssociationDocuments({ commit }, payload) {
    return http_service.get({commit}, payload)
  },

  fetchAssociationDocumentById({ commit }, payload) {
   /*  return http_service.get({commit}, payload) */
   return new Promise((resolve, reject) => {
    axios.get(payload.resourceUrl, {responseType: 'arraybuffer'})
      .then((response) => {
        /* commit(payload.commitAction, response.data) */
        resolve(response)
      })
      .catch((error) => {
        commit(payload.commitAction, null)
        reject(error) })
    })
  },
}
