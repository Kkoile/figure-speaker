import axios from 'axios';

const state = {
  query: '',
  uploadStatus: null,
  files: [],
  showFileIsInUseDialog: false,
  itemToDelete: null
};

const mutations = {
  resetData (state) {
    state.query = '';
    state.uploadStatus = null;
    state.files = [];
    state.showFileIsInUseDialog = false;
    state.itemToDelete = null;
  },
  updateUploadStatus (state, sStatus) {
    state.uploadStatus = sStatus;
  },
  setAvailableMp3Files (state, aFiles) {
    state.files = aFiles;
  },
  showFileIsInUseDialog (state, sFilename) {
    state.showFileIsInUseDialog = true;
    state.itemToDelete = sFilename;
  },
  hideFileIsInUseDialog (state) {
    state.showFileIsInUseDialog = false;
    state.itemToDelete = null;
  }
};

var getEncodedUri = function (sUri) {
  return encodeURI(sUri).replace(/\(/g, '%28').replace(/\)/g, '%29');
};

const actions = {
  saveItem ({dispatch}, sUri) {
    dispatch('saveItem', getEncodedUri(sUri), { root: true });
  },
  checkIfFileIsInUse ({commit, dispatch}, sFilename) {
    axios.get('/data/checkIfUriIsInUse', {params: {uri: getEncodedUri('local:track:' + sFilename)}})
      .then(function (oData) {
        if (oData.data) {
          commit('showFileIsInUseDialog', sFilename);
        } else {
          dispatch('deleteFile', sFilename);
        }
      })
      .catch(function (oError) {
        alert(oError);
      });
  },
  deleteFile ({commit, dispatch}, sFilename) {
    axios.delete('/data/mp3/deleteFile', {params: {filename: getEncodedUri(sFilename)}})
      .then(function () {
        dispatch('loadAvailable');
      })
      .catch(function (oError) {
        alert(oError);
      })
      .then(function () {
        commit('hideFileIsInUseDialog');
      });
  },
  cancelDeleteFile ({commit}) {
    commit('hideFileIsInUseDialog');
  },
  loadAvailable ({commit}) {
    axios.get('/data/mp3')
      .then(function (oData) {
        commit('setAvailableMp3Files', oData.data);
      });
  },
  upload ({commit, dispatch}, oFile) {
    commit('updateUploadStatus', 'PENDING');
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
