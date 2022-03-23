export default {
  getEvent: state => (eventId) => state.calendar_events.find((event) => event.id == eventId),
}
