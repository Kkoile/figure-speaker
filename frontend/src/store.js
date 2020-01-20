import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { app } from './main';
import spotify from './lib/spotify/store';
import mp3 from './lib/mp3/store';
import youtube from './lib/youtube/store';

axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:3000' : '';

Vue.use(Vuex);

const state = {
  playMode: null,
  repeatMode: false,
  resetAfterDays: 0,
  accounts: [],
  language: 'en',
  availableLanguages: [
    {
      id: 'en',
      text: 'settings.languageEn.text'
    },
    {
      id: 'de',
      text: 'settings.languageDe.text'
    }
  ],
  maxVolume: 100,
  currentVersion: null,
  latestVersion: null,
  updateAvailable: false
};

const mutations = {
  setPlayMode (state, playMode) {
    state.playMode = playMode.playMode;
    state.resetAfterDays = playMode.resetAfterDays;
  },
  setRepeatMode (state, repeatMode) {
    state.repeatMode = repeatMode;
  },
  setAccounts (state, accounts) {
    state.accounts = accounts;
  },
  setLanguage (state, sLanguage) {
    state.language = sLanguage;
    app.$i18n.locale = sLanguage;
  },
  setMaxVolume (state, iMaxVolume) {
    state.maxVolume = iMaxVolume;
  },
  setCurrentVersion (state, sCurrentVersion) {
    state.currentVersion = sCurrentVersion;
  },
  setUpdateAvailable (state, oData) {
    state.updateAvailable = oData.higherVersionAvailable;
    state.latestVersion = oData.latestVersion;
  }
};

const settingsActions = {
  loadPlayMode ({ commit }) {
    return axios.get('/settings/playMode')
      .then(function (oData) {
        commit('setPlayMode', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  loadRepeatMode ({ commit }) {
    return axios.get('/settings/repeatMode')
      .then(function (oData) {
        commit('setRepeatMode', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  savePlayMode ({ commit }, oPlayMode) {
    return axios.post('/settings/playMode', oPlayMode)
      .then(function (oData) {
        alert('success');
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  saveRepeatMode ({ commit }, bRepeatMode) {
    return axios.post('/settings/repeatMode', { repeatMode: bRepeatMode })
      .then(function (oData) {
        alert('success');
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  loadAccounts ({ commit }) {
    return axios.get('/settings/accounts')
      .then(function (oData) {
        commit('setAccounts', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  loadLanguage ({ commit }) {
    return axios.get('/settings/language')
      .then(function (oData) {
        commit('setLanguage', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  saveLanguage ({ commit }, sLanguage) {
    return axios.post('/settings/language', { language: sLanguage })
      .then(function (oData) {
        commit('setLanguage', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  loadMaxVolume ({ commit }) {
    return axios.get('/settings/maxVolume')
      .then(function (oData) {
        commit('setMaxVolume', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  saveMaxVolume ({ commit }, iMaxVolume) {
    return axios.post('/settings/maxVolume', { maxVolume: iMaxVolume })
      .then(function (oData) {
        commit('setMaxVolume', oData.data);
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
  checkForUpdate ({ commit }) {
    return axios.get('/settings/currentVersion')
      .then(function (oData) {
        commit('setCurrentVersion', oData.data);
        return oData.data;
      })
      .then(function (sCurrentVersion) {
        return axios.get('http://' + window.location.hostname + ':3001/updates/checkForUpdate?version=' + sCurrentVersion)
          .then(function (oData) {
            commit('setUpdateAvailable', oData.data);
          });
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  }

};

const actions = {
  saveItem ({ commit }, sUri) {
    return axios.post('/settings/saveFigure', { streamUri: sUri })
      .then(function () {
        alert('success');
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  }
};

const getters = {};

export default new Vuex.Store({
  actions,
  modules: {
    settings: {
      state,
      getters,
      actions: settingsActions,
      mutations
    },
    spotify,
    mp3,
    youtube
  }
});
