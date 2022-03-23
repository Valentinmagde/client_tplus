
import axios from "@/axios.js"

export default {
  post({commit}, payload) {
    return new Promise((resolve, reject) => {
      axios.post(payload.resourceUrl, payload.data)
        .then((response) => {
          commit(payload.commitAction, response.data.data)
          resolve(response)
        })
        .catch(error => {
            // handle authentication and validation errors here
            let erreur = error.response.data.data.errMsg

            reject(erreur)
          })
    })
  },

  put({commit}, payload) {
    return new Promise((resolve, reject) => {
      axios.put(payload.resourceUrl, payload.data)
        .then((response) => {
          commit(payload.commitAction, response.data.data)
          resolve(response)
        })
        .catch(error => {
            // handle authentication and validation errors here
            let erreur = error.response.data.data.errMsg

            reject(erreur)
        })
    })
  },

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * @deprecated since 14/05/2021
   * @returns
   */
  get({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(payload.resourceUrl)
        .then((response) => {
          commit(payload.commitAction, response.data.data)
          resolve(response)
        })
        .catch((error) => {
          // handle authentication and validation errors here
          let erreur = error.response.data.data.errMsg

          reject(erreur)
        })
    })
  },

  /**
   *
   * @param {*} param0
   * @param {*} payload
   * @returns JSON data
   */
  getUpdated({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.get(payload.resourceUrl)
        .then((response) => {
          commit(payload.commitAction, response.data.data)
          resolve(response)
        })
        .catch((error) => {
          // handle authentication and validation errors here
          let erreur = error.response.data.data.errMsg

          reject(erreur)
        })
    })
  },


  delete({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios.delete(payload.resourceUrl)
        .then((response) => {
          commit(payload.commitAction, payload.memberId)
          resolve(response)
        })
        .catch((error) => {
          // handle authentication and validation errors here
          let erreur = error.response.data.data.errMsg

          reject(erreur)
        })
    })
  }
}
