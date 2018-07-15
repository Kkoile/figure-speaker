import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import spotify from './lib/spotify/store';
import mp3 from './lib/mp3/store';
import youtube from './lib/youtube/store';

axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:3000' : '';

Vue.use(Vuex);

const state = {
  playMode: null,
  resetAfterDays: 0,
  accounts: [],
  account: {requiredInfo: []}
};

const mutations = {
  setPlayMode (state, playMode) {
    state.playMode = playMode.playMode;
    state.resetAfterDays = playMode.resetAfterDays;
  },
  setAccounts (state, accounts) {
    state.accounts = accounts;
  },
  setAccountInfo (state, account) {
    state.account = account;
  }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  loadPlayMode ({commit}) {
    return axios.get('/settings/playMode')
      .then(function (oData) {
        commit('setPlayMode', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  savePlayMode ({commit}, oPlayMode) {
    return axios.post('/settings/playMode', oPlayMode)
      .then(function (oData) {
        alert('success');
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  loadAccounts ({commit}) {
    return axios.get('/settings/accounts')
      .then(function (oData) {
        commit('setAccounts', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  loadAccountInfo ({commit}, sHostId) {
    return axios.get('/settings/accounts/' + sHostId)
      .then(function (oData) {
        commit('setAccountInfo', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  saveAccount ({dispatch}, oAccount) {
    return axios.post('/settings/accounts/' + oAccount.id, oAccount)
      .then(function () {
        dispatch('loadAccountInfo', oAccount.id);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  deleteAccount ({dispatch}, sHostId) {
    return axios.delete('/settings/accounts/' + sHostId)
      .then(function () {
        dispatch('loadAccountInfo', sHostId);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  }
};

const getters = {};

export default new Vuex.Store({
  modules: {
    settings: {
      state,
      getters,
      actions,
      mutations
    },
    spotify,
    mp3,
    youtube
  }
});
