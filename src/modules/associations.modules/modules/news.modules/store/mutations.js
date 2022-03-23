import * as types from './mutation-types'

export default {
  // News
  [types.SET_NEW](state, new_) {
    state.new = new_
  },

  [types.SET_NEWS](state, news) {
    state.news = news
  },

  [types.REMOVE_NEW](state, itemId) {
    const ItemIndex = state.news.nouvelles.findIndex((acc) => acc.id == itemId)
    state.news.nouvelles.splice(ItemIndex, 1)
  },
}
