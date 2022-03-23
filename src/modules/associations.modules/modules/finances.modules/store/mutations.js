import * as types from './mutation-types'

export default {
  // Operations
  [types.SET_OPERATION](state, operation) {
    state.operation = operation
  },

  [types.SET_OPERATIONS](state, operations) {
    state.operations = operations
  },

  [types.SET_TRESORERIES](state, tresoreries) {
    state.tresoreries = tresoreries
  },

  [types.SET_VALIDATE_OPERATIONS](state, operations) {
    state.operations_valides = operations
  },

  [types.SET_REJECTED_OPERATIONS](state, operations) {
    state.operations_rejetes = operations
  },

  [types.SET_TRANSACTIONS](state, transactions) {
    state.transactions = transactions
  },

  [types.SET_VIREMENTS](state, virements) {
    state.virements = virements
  },

  [types.SET_ECHEANCIERS](state, echeanciers) {
    state.echeanciers = echeanciers
  },

  [types.SET_EXIT_VOUCHERS](state, exitVouchers) {
    state.exitVouchers = exitVouchers
  },

  [types.SET_HISTORIES](state, historiques) {
    state.historiques = historiques
  },

  [types.REMOVE_OPERATION](state, itemId) {
    const ItemIndex = state.operations.findIndex((acc) => acc.id == itemId)
    state.operations.splice(ItemIndex, 1)
  },
}
