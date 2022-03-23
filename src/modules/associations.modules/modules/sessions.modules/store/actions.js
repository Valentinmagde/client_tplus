import http_service from '../../../services/api/httpService';

export default {
  fetchAgsByCycle({ commit }, payload) {
    return http_service.get({commit}, payload)
  },
  fetchAgById({ commit }, payload) {
    return http_service.get({commit}, payload)
  },
}
