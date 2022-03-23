import * as types from './mutation-types';


import {logOutApi, getUserInfoApi} from '../services/api';



import axios from "@/axios.js"
import jwt from "@/services/http/requests/auth/jwt"

import i18n from "@/services/i18n/i18n"

import firebase from 'firebase/app'
import 'firebase/auth'

import router from '@/router'

import * as api from '../services/api'


import Token from '@/helpers/token'

//Social Login
function loginSocial({commit}, payload, request){
    axios.post(payload.resourceUrlLogin, payload.data)
        .then((response) => {
            const credentials = {
              accessToken: response.data.data.bearerData,
              refreshToken: response.data.data.refresh_token,
              expires_in: response.data.data.expires_in,
              user: response.data.data.user,
            }

            if (payload.rememberMe)
                Token.processStorage(response)
            else
                Token.processStorage(response, false)

            commit("SET_CREDENTIALS", credentials)

            axios.defaults.headers.Authorization = 'Bearer ' +  response.data.data.bearerData

            // Navigate User to homepage
            router.push(router.currentRoute.query.to || '/associations')
        })
        .catch((error) => {
            // handle authentication and validation errors here
            if (error.response) {
              let erreur = error.response.data.data.errMsg

              request.notify({
                  position: 'top-center',
                  text: erreur,
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
              })
            }
        })
}


export default {

  postRequest ({commit}, playload) {
    return api.postRequest({commit}, playload)
  },

  fetchUser ({ commit }, payload) {
    return api.fetchUser({ commit }, payload)
  },

  fetchUserRoles ({ commit }, payload) {
    return api.fetchUserRoles({ commit }, payload)
  },


    async [types.INITIALIZE]({commit}){

        let payload = Token.getStore()

        if(payload){
            commit(types.INITIALIZE, payload)

            return await getUserInfoApi()
                .then(e => {
                    commit(types.SET_CREDENTIALS,  Object.assign(payload ,{user: e.data}))
                })
                .then(() => true )
                .catch(() => false )

        }else{
            // commit(types.LOG_OUT)
            //router.push(router.currentRoute.query.to || {name: 'user:login'})
            return false
        }
	},

	[types.LOG_OUT]({commit}, payload){

        if (payload)
            return logOutApi(payload)
                .then(() => commit(types.LOG_OUT))
        else
            commit(types.LOG_OUT)
	},


    loginAttempt({ dispatch }, payload) {
        // New payload for login action
        const newPayload = {
            userDetails: payload.userDetails,
            notify: payload.notify,
            closeAnimation: payload.closeAnimation
        }

        // If remember_me is enabled change firebase Persistence
        if (!payload.checkbox_remember_me) {

            // Change firebase Persistence
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

                // If success try to login
                .then(function() {
                    dispatch('login', newPayload)
                })

                // If error notify
                .catch(function(err) {

                    // Close animation if passed as payload
                    if(payload.closeAnimation) payload.closeAnimation()

                    payload.notify({
                        time: 2500,
                        text: err.message,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'danger'
                    })
                })
        } else {
            // Try to login
            dispatch('login', newPayload)
        }
    },
    login({ commit, state, dispatch }, payload) {

        // If user is already logged in notify and exit
        if (state.isUserLoggedIn()) {
            // Close animation if passed as payload
            if(payload.closeAnimation) payload.closeAnimation()

            payload.notify({
                title: 'Login Attempt',
                text: 'You are already logged in!',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning'
            })

            return false
        }

        // Try to sigin
        firebase.auth().signInWithEmailAndPassword(payload.userDetails.email, payload.userDetails.password)

            .then((result) => {

                // Set FLAG username update required for updating username
                let isUsernameUpdateRequired = false

                // if username is provided and updateUsername FLAG is true
                  // set local username update FLAG to true
                  // try to update username
                if(payload.updateUsername && payload.userDetails.displayName) {

                    isUsernameUpdateRequired = true

                    dispatch('updateUsername', {
                      user: result.user,
                      username: payload.userDetails.displayName,
                      notify: payload.notify,
                      isReloadRequired: true
                    })
                }

                // Close animation if passed as payload
                if(payload.closeAnimation) payload.closeAnimation()

                // if username update is not required
                  // just reload the page to get fresh data
                  // set new user data in localstorage
                if(!isUsernameUpdateRequired) {
                  router.push(router.currentRoute.query.to || '/')
                  commit('UPDATE_USER_INFO', result.user.providerData[0], {root: true})
                }
            }, (err) => {

                // Close animation if passed as payload
                if(payload.closeAnimation) payload.closeAnimation()

                payload.notify({
                    time: 2500,
                    text: err.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
    },

    // Social login
    socialLogin({commit, state}, request) {

        var provider = (request.type == 'facebook') ?
            new firebase.auth.FacebookAuthProvider() :
            new firebase.auth.GoogleAuthProvider()


        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                let payload = {
                    resourceUrlLogin: "/api/user/loginSocial",
                    resourceUrlRegister: "/api/user/registerSocial",
                    data: {
                        firstName: result.user.displayName,
                        email: result.additionalUserInfo.profile.email,
                        source: request.type,
                        photo_profil: result.user.photoURL
                    }
                }
                axios.post(payload.resourceUrlRegister, payload.data)
                    .then(() => {
                        loginSocial({commit, state}, payload, request)
                    })
                    .catch(() => {
                        loginSocial({commit, state}, payload, request)
                    })
            })
            .catch((err) => {
                request.notify({
                    position: 'top-center',
                    text: err.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
    },
    // Google Login
    loginWithGoogle({commit, state}, payload) {
        if (state.isUserLoggedIn()) {
            payload.notify({
                position:'top-center',
                title: i18n.t('loginAttempt'),
                text: i18n.t('youAreAlreadyLoggedIn'),
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning'
            })
            return false
        }
        const provider = new firebase.auth.GoogleAuthProvider()

        firebase.auth().signInWithPopup(provider)
          .then((result) => {
            let playload = {
                resourceUrlLogin:"/api/user/loginSocial",
                resourceUrlRegister:"/api/user/registerSocial",
                commitAction: 'UPDATE_USER_INFO',
                data: {
                    lastName : result.user.displayName,
                    email   : result.user.email,
                    source  : 'google'
                }
            }
            axios.post(playload.resourceUrlRegister, playload.data)
                .then(() => {
                    loginSocial({commit, state}, playload)
                })
                .catch(() => {
                    loginSocial({commit, state}, playload)
                })
          }).catch((err) => {
              payload.notify({
                  position:'top-center',
                  text: err.message,
                  iconPack: 'feather',
                  icon: 'icon-alert-circle',
                  color: 'danger'
              })
          })
    },

    // Facebook Login
    loginWithFacebook({commit, state}, payload) {
        if (state.isUserLoggedIn()) {
            payload.notify({
                position:'top-center',
                title: i18n.t('loginAttempt'),
                text: i18n.t('youAreAlreadyLoggedIn'),
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning'
            })
            return false
        }
        const provider = new firebase.auth.FacebookAuthProvider()

        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                let playload = {
                    resourceUrlLogin:"/api/user/loginSocial",
                    resourceUrlRegister:"/api/user/registerSocial",
                    commitAction: 'UPDATE_USER_INFO',
                    data: {
                        lastName : result.user.displayName,
                        email   : result.user.email,
                        source  : 'facebook'
                    }
                  }
                  axios.post(playload.resourceUrlRegister, playload.data)
                  .then(() => {
                    loginSocial({commit, state}, playload)
                  })
                  .catch(() => {
                    loginSocial({commit, state}, playload)
                  })
            }).catch((err) => {
                payload.notify({
                    time: 2500,
                    text: err.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
    },

    // Twitter Login
    loginWithTwitter({commit, state}, payload) {
        if (state.isUserLoggedIn()) {
            payload.notify({
                title: 'Login Attempt',
                text: 'You are already logged in!',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning'
            })
            return false
        }
        const provider = new firebase.auth.TwitterAuthProvider()

        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                router.push(router.currentRoute.query.to || '/')
                commit('UPDATE_USER_INFO', result.user.providerData[0], {root: true})
            }).catch((err) => {
                payload.notify({
                    time: 2500,
                    text: err.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
    },

    // Github Login
    loginWithGithub({commit, state}, payload) {
        if (state.isUserLoggedIn()) {
            payload.notify({
                title: 'Login Attempt',
                text: 'You are already logged in!',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'warning'
            })
            return false
        }
        const provider = new firebase.auth.GithubAuthProvider()

        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                router.push(router.currentRoute.query.to || '/')
                commit('UPDATE_USER_INFO', result.user.providerData[0], {root: true})
            }).catch((err) => {
                payload.notify({
                    time: 2500,
                    text: err.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
    },
    registerUser({dispatch}, payload) {

        // create user using firebase
        firebase.auth().createUserWithEmailAndPassword(payload.userDetails.email, payload.userDetails.password)
            .then(() => {
                payload.notify({
                    title: 'Account Created',
                    text: 'You are successfully registered!',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    color: 'success'
                })

                const newPayload = {
                    userDetails: payload.userDetails,
                    notify: payload.notify,
                    updateUsername: true
                }
                dispatch('login', newPayload)
            }, (error) => {
                payload.notify({
                    text: error.message,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                })
            })
    },
    updateUsername({ commit }, payload) {
        payload.user.updateProfile({
            displayName: payload.displayName
        }).then(() => {

            // If username update is success
              // update in localstorage
            let newUserData = Object.assign({}, payload.user.providerData[0])
            newUserData.displayName = payload.displayName
            commit('UPDATE_USER_INFO', newUserData, {root: true})

            // If reload is required to get fresh data after update
              // Reload current page
            if(payload.isReloadRequired) {
                router.push(router.currentRoute.query.to || '/')
            }
        }).catch((err) => {
              payload.notify({
                time: 8800,
                text: err.message,
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
            })
        })
    },


    // JWT
    loginJWT({ commit }, payload) {

        return new Promise((resolve,reject) => {
            jwt.login(payload.userDetails.phone, payload.userDetails.password)
            .then(response => {
              if(response.data.status == 'OK') {
                const credentials = {
                  accessToken: response.data.data.bearerData,
                  refreshToken: response.data.data.refresh_token,
                  expires_in: response.data.data.expires_in,
                  user: response.data.data.user,
                }

                if (payload.rememberMe)
                    Token.processStorage(response)
                else
                    Token.processStorage(response, false)

                commit("SET_CREDENTIALS", credentials)

                axios.defaults.headers.Authorization = 'Bearer ' +  response.data.data.bearerData

                resolve(response)
              }
              else {
                reject({message: "Wrong Phone number or Password"})
              }

            })
            .catch(error => {
              // handle authentication and validation errors here
              let erreur = error.response.data.data.errMsg
              let userId = error.response.data.data.errMsg.hasOwnProperty('user') ? error.response.data.data.errMsg.user : null
              if (20 == error.response.data.data.errNo)
              reject({
                errNo: 20,
                text: error.response.data.data.errMsg.msg,
                user_id: userId,
              })
              reject(erreur)
            })
        })
    },

    registerUserJWT({ commit }, payload) {

      const { displayName, email, password, confirmPassword } = payload.userDetails

      return new Promise((resolve,reject) => {

        // Check confirm password
        if(password !== confirmPassword) {
          reject({message: "Password doesn't match. Please try again."})
        }

        jwt.registerUser(displayName, email, password)
          .then(response => {
            // Redirect User
            router.push(router.currentRoute.query.to || '/')

            // Update data in localStorage
            localStorage.setItem("accessToken_tpls", response.data.accessToken)
            commit('UPDATE_USER_INFO', response.data.userData, {root: true})

            resolve(response)
          })
          .catch(error => { reject(error) })
      })
    },

    async fetchAccessToken({commit}) {
      return await new Promise((resolve, reject) => {
         jwt.refreshToken()
            .then(response => {


                axios.defaults.headers.Authorization = 'Bearer ' +  response.data.data.bearerData
                let credentials = {
                    accessToken: response.data.data.bearerData,
                    refreshToken: response.data.data.refresh_token,
                    expires_in: response.data.data.expires_in,
                 }

                commit("SET_CREDENTIALS", credentials)

                resolve(response)

            })
            .catch((e) => {
                // Navigation vers la page du login
                router.push(router.currentRoute.query.to || {name: 'user:login'})

                reject(e)
            })
      })
    },
}

