
import axios from "@/axios.js"


export const registerApi = () => false

export const logOutApi = (credentials) => axios.post(`/api/user/logout`, credentials)

export const loginApi = (credentials) => axios.post("/api/user/login", credentials)

export const  registerUserApi = (credentials) => axios.post("/api/auth/register", credentials)

export const refreshTokenApi = (credentials) => axios.post("api/user/refreshToken" , { refresh_token: credentials.refreshToken })

//export const  refreshTokenApi = (credentials) => axios.post("/api/user/refreshToken", {refresh_token: credentials.refresh_token})

export const getUserInfoApi = () => axios.get('/api/user/info/token')

export const postRequest = ({commit}, playload) => {
  return new Promise((resolve, reject) => {
    axios.post(playload.resourceUrl, playload.data)
      .then((response) => {
        /* window.console.log(response.data) */
        commit(playload.commitAction, response.data.data)
        resolve(response)
      })
      .catch(error => {
        window.console.log(error)
        // handle authentication and validation errors here
        let erreur = error.response.data.data.errMsg

        reject(erreur)
      })
  })
}
export const fetchUserById = ({ commit }) => {
  return new Promise((resolve, reject) => {
    axios.get('/api/associations/user/' + JSON.parse(localStorage.getItem('user')).id)
      .then((response) => {
        commit('SET_USER', response.data)
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export const fetchUser = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    axios.get(payload.resourceUrl)
      .then((response) => {
        commit(payload.commitAction, response.data.data)
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export const fetchUserRoles = ({ commit }, payload) => {
  return new Promise((resolve, reject) => {
    axios.get(payload.resourceUrl)
      .then((response) => {
        commit(payload.commitAction, response.data.data)
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
