import * as types from './mutation-types'

export default {
  // Documents
  [types.SET_DOCUMENTS](state, documents) {
    state.documents = documents
  },

  [types.SET_DOCUMENT](state, document) {
    state.document = document
  },

  [types.REMOVE_DOCUMENT](state, itemId) {
    const ItemIndex = state.documents.findIndex((acc) => acc.id == itemId)
    state.documents.splice(ItemIndex, 1)
  },
}
