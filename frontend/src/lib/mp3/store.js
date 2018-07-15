const state = {
  query: ''
};

const mutations = {
  resetData (state) {
    state.query = '';
  }
};

const actions = {
  saveItem ({dispatch}, sUri) {
    dispatch('saveItem', sUri, { root: true });
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
