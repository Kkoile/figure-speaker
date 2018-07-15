const state = {
  query: ''
};

const mutations = {
  resetData (state) {
    state.query = '';
  }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  saveItem ({dispatch}, sUri) {
    dispatch('saveItem', 'yt:' + sUri, { root: true });
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
