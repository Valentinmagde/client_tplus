/*=========================================================================================
  File Name: i18n.js
  Description: i18n configuration file. Imports i18n data.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import VueI18n from 'vue-i18n'
import i18nData from './i18nData'

Vue.use(VueI18n)

/* const user = JSON.parse(localStorage.getItem('user'))
const lang = user.langue ? user.langue: navigator.language.substring(0, 1) */

/* window.console.log(navigator.language.substring(0, 1)) */
export default new VueI18n({
  locale: navigator.language.substring(0, 1) == 'en' ? 'en': 'fr', // set default locale
  messages: i18nData,
})
