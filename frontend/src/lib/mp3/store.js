import axios from 'axios';

const state = {
  query: '',
  uploadStatus: null,
  files: []
};

const mutations = {
  resetData (state) {
    state.query = '';
    state.uploadStatus = null;
    state.files = [];
  },
  updateUploadStatus (state, sStatus) {
    state.uploadStatus = sStatus;
  },
  setAvailableMp3Files (state, aFiles) {
    state.files = aFiles;
  }
};

const actions = {
  saveItem ({dispatch}, sUri) {
    dispatch('saveItem', sUri, { root: true });
  },
  loadAvailable ({commit}) {
    axios.get('/data/mp3')
      .then(function (oData) {
        commit('setAvailableMp3Files', oData.data);
      });
  },
  upload ({commit, dispatch}, oFile) {
    var oFormData = new FormData();
    oFormData.append('file', oFile);
    axios.post('/data/mp3/upload',
      oFormData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    ).then(function () {
      commit('updateUploadStatus', 'SUCCESS');
      dispatch('loadAvailable');
    })
      .catch(function () {
        commit('updateUploadStatus', 'FAILURE');
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
