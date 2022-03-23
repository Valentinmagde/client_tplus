import * as api from '../services/api'

export default {
  getInvoices({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.getInvoices(payload.credentials)
      .then((response) => {
        commit(payload.commitAction, response.data.data)
        resolve(response)
      })
      .catch((error) => { reject(error) })
    })
  },

  getInvoiceById({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.getInvoiceById(payload.credentials)
      .then((response) => {
        commit(payload.commitAction, response.data.data)
        resolve(response)
      })
      .catch((error) => { reject(error) })
    })
  },

  buyInvoice({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.buyInvoice(payload.credentials)
      .then((response) => {
        commit(payload.commitAction, response.data.data)
        resolve(response)
      })
      .catch(error => reject(error))
    })
  },

  applyCoupon({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.applyCoupon(payload.credentials)
      .then((response) => {
        commit(payload.commitAction, response.data.data)
        resolve(response)
      })
      .catch(error => reject(error))
    })
  },

  revertCoupon({ commit }, payload) {
    return new Promise((resolve, reject) => {
      api.revertCoupon(payload.credentials)
      .then(response => {
        commit(payload.commitAction, response.data.data)
        resolve(response)
      })
      .catch(error => reject(error))
    })
  }
}
