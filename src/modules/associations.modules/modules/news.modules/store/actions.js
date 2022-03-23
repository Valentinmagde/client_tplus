import axios from '@/services/http/axios'

export default {
  fetchNews({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(payload.resourceUrl)
        .then((response) => {
          commit(payload.commitAction, response.data.data)
          resolve(response)
        })
        .catch((error) => { reject(error) })
    })
  },
}
