
import axios from "@/services/http/axios/index.js"
import store from "@/store"

import Token from '@/helpers/token.js'
//import router from '@/router'

// Token Refresh
let isAlreadyFetchingAccessToken = false
let subscribers = []

function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter(callback => callback(access_token))
}

function addSubscriber(callback) {
  subscribers.push(callback)
}


export default {
  init() {
    axios.interceptors.response.use(  function (response) {
      return response
    },  async function (error) {
      // const { config, response: { status } } = error
      const { config, response } = error
      const originalRequest = config

      // if (status === 401) {

      if (response && response.status === 401 && response.data.data.errMsg =='Expired token')
      {
        if (!isAlreadyFetchingAccessToken) {
          store.dispatch("authentificated/fetchAccessToken")
            .then((response) => {
              Token.setAccessToken(response)
              isAlreadyFetchingAccessToken = false
              onAccessTokenFetched(response.data.data.bearerData)
            })
            .catch((err) => {
              window.console.log(err)
              store.dispatch('authentificated/LOG_OUT')
              //router.push({name: 'user:login'})
            })
        }

        const retryOriginalRequest = new Promise((resolve) => {
          addSubscriber((/*response*/) => {
            originalRequest.headers.Authorization = 'Bearer ' +  Token.getAccessToken()
            resolve(axios(originalRequest))
          })
        })
        return retryOriginalRequest
      }

      return Promise.reject(error)
    })
  },
  login(phone, pwd) {
    return axios.post("/api/user/login", {phone: phone, password: pwd})
  },
  registerUser(name, email, pwd) {
    return axios.post("/api/auth/register", {displayName: name, email: email, password: pwd})
  },
  refreshToken() {
    return axios.post("/api/user/refreshToken", {refresh_token: Token.getRefreshToken() })
  }
}
