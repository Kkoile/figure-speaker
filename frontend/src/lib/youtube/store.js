import axios from 'axios';

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
  saveItem ({commit}, sUri) {
    return axios.post('/settings/saveFigure', {streamUri: 'yt:' + sUri})
      .then(function () {
        alert('success');
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
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
