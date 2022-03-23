import * as types from './mutation-types'

export default {
  [types.ADD_EVENT](state, event) {
    state.calendar_events.push(event)
  },
  [types.SET_CALENDAR_EVENTS](state, events) {
    state.calendar_events = events
  },
  [types.SET_LABELS](state, labels) {
    state.eventLabels = labels
  },
  [types.UPDATE_EVENT](state, event) {
      const eventIndex = state.calendar_events.findIndex((e) => e.id == event.id)
      Object.assign(state.calendar_events[eventIndex], event)
  },
  [types.REMOVE_EVENT](state, eventId) {
      const eventIndex = state.calendar_events.findIndex((e) => e.id == eventId)
      state.calendar_events.splice(eventIndex, 1)
  },
}
