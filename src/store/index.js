
import Vue from 'vue'
import Vuex from 'vuex'

import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

import moduleAuth from '@/modules/users.modules/store'
import moduleAssociationStore from '@/modules/associations.modules/store'
import moduleBillingStore from '@/modules/billing.modules/store'


Vue.use(Vuex)

export default new Vuex.Store({
    getters,
    mutations,
    state,
    actions,
    modules: {
      authentificated: moduleAuth,
      association: moduleAssociationStore,
      billing: moduleBillingStore
    },
    strict: false
})
