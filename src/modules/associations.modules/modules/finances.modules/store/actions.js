import http_service from '../../../services/api/httpService'

export default {

  fetchFinances({ commit }, payload) {
    return http_service.get({commit}, payload)
  },

  // Fetch exit vouchers
  fetchExitVouchers({ commit }, {association_id, state }) {
    let payload = {
      resourceUrl: `api/member/all/association/${ association_id }/bon/sortie/${ state }/get`,
      commitAction: 'SET_EXIT_VOUCHERS'
    }
    return http_service.getUpdated({ commit }, payload);
  },

  // Fetch treasury data
  fetchTreasury({ commit }, { association_id }) {
    let payload = {
      resourceUrl: `api/association/${association_id}/activites/tresorerie`,
      commitAction: 'SET_TRESORERIES'
    }

    return http_service.getUpdated({ commit }, payload);
  },

  // Create a disbursement operation from exit vouchers
  createWidthrawal({ commit }, { member_id, data }) {
    let payload = {
      resourceUrl: `api/membre/${member_id}/operation/decaissement/bon`,
      commitAction: 'NO_COMMIT',
      data: data
    };

    return http_service.post({ commit }, payload);
  }
}
