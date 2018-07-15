import Vue from 'vue';
import Vuex from 'vuex';
import Spotify from './lib/Spotify';
import axios from 'axios';

Vue.use(Vuex);

const state = {
  playMode: null,
  resetAfterDays: 0,
  accounts: [],
  account: {requiredInfo: []},
  query: '',
  artists: [],
  artistsOffset: 0,
  moreArtists: false,
  albums: [],
  albumsOffset: 0,
  moreAlbums: false,
  tracks: [],
  tracksOffset: 0,
  moreTracks: false,
  selectedArtistId: null,
  artistName: null,
  artistAlbums: [],
  artistAlbumsOffset: 0,
  moreArtistAlbums: false,
  artistTracks: [],
  selectedAlbumId: null,
  albumUri: null,
  albumName: null,
  albumArtistName: null,
  albumImage: null,
  albumTracks: [],
  albumTracksOffset: 0,
  moreAlbumTracks: false
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
  },
  resetData (state) {
    state.artists = [];
    state.artistsOffset = 0;
    state.moreArtists = false;
    state.albums = [];
    state.albumsOffset = 0;
    state.moreAlbums = false;
    state.tracks = [];
    state.tracksOffset = 0;
    state.moreTracks = false;
  },
  appendArtists (state, artists) {
    state.artists = state.artists.concat(artists.items);
    state.artistsOffset += artists.limit;
    state.moreArtists = artists.total > state.artistsOffset;
  },
  appendAlbums (state, albums) {
    state.albums = state.albums.concat(albums.items);
    state.albumsOffset += albums.limit;
    state.moreAlbums = albums.total > state.albumsOffset;
  },
  appendTracks (state, tracks) {
    state.tracks = state.tracks.concat(tracks.items);
    state.tracksOffset += tracks.limit;
    state.moreTracks = tracks.total > state.tracksOffset;
  },
  resetArtistData (state) {
    state.artistName = null;
    state.artistAlbums = [];
    state.artistAlbumsOffset = 0;
    state.moreArtistAlbums = false;
    state.artistTracks = [];
  },
  setArtist (state, data) {
    state.artistName = data.name;
  },
  appendArtistAlbums (state, albums) {
    state.artistAlbums = state.artistAlbums.concat(albums.items);
    state.artistAlbumsOffset += albums.limit;
    state.moreArtistAlbums = albums.total > state.artistAlbumsOffset;
  },
  appendArtistTracks (state, tracks) {
    state.artistTracks = state.artistTracks.concat(tracks.tracks);
  },
  resetAlbumData (state) {
    state.albumUri = null;
    state.albumName = null;
    state.albumArtistName = null;
    state.albumImage = null;
    state.albumTracks = [];
    state.albumTracksOffset = 0;
    state.moreAlbumTracks = false;
  },
  setAlbum (state, data) {
    state.albumUri = data.uri;
    state.albumName = data.name;
    state.albumArtistName = data.artists[0].name;
    state.albumImage = data.images && data.images.length > 0 ? data.images[0] : null;
  },
  appendAlbumTracks (state, tracks) {
    state.albumTracks = state.albumTracks.concat(tracks.items);
    state.albumTracksOffset += tracks.limit;
    state.moreAlbumTracks = tracks.total > state.albumTracksOffset;
  }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  search ({commit}) {
    commit('resetData');
    return Spotify.search(state.query, 'artist,album,track', state.artistsOffset)
      .then(function (oData) {
        commit('appendArtists', oData.data.artists);
        commit('appendAlbums', oData.data.albums);
        commit('appendTracks', oData.data.tracks);
      })
      .catch(function (err) {
        alert(err);
      });
  },
  loadMoreArtists ({commit}) {
    return Spotify.search(state.query, 'artist', state.artistsOffset)
      .then(function (oData) {
        commit('appendArtists', oData.data.artists);
      })
      .catch(function (err) {
        alert(err);
      });
  },
  loadMoreAlbums ({commit}) {
    return Spotify.search(state.query, 'album', state.albumsOffset)
      .then(function (oData) {
        commit('appendAlbums', oData.data.albums);
      })
      .catch(function (err) {
        alert(err);
      });
  },
  loadMoreTracks ({commit}) {
    return Spotify.search(state.query, 'track', state.tracksOffset)
      .then(function (oData) {
        commit('appendTracks', oData.data.tracks);
      })
      .catch(function (err) {
        alert(err);
      });
  },
  loadArtist ({commit}, id) {
    state.selectedArtistId = id;
    commit('resetArtistData');
    var aPromises = [
      Spotify.loadArtist(state.selectedArtistId)
        .then(function (oData) {
          commit('setArtist', oData.data);
        })
        .catch(function (err) {
          alert(err);
        }),
      Spotify.loadArtistAlbums(state.selectedArtistId, state.artistAlbumsOffset)
        .then(function (oData) {
          commit('appendArtistAlbums', oData.data);
        })
        .catch(function (err) {
          alert(err);
        }),
      Spotify.loadArtistTracks(state.selectedArtistId)
        .then(function (oData) {
          commit('appendArtistTracks', oData.data);
        })
        .catch(function (err) {
          alert(err);
        })
    ];
    return aPromises;
  },
  loadMoreArtistAlbums ({commit}) {
    return Spotify.loadArtistAlbums(state.selectedArtistId, state.artistAlbumsOffset)
      .then(function (oData) {
        commit('appendArtistAlbums', oData.data);
      })
      .catch(function (err) {
        alert(err);
      });
  },
  loadAlbum ({commit}, id) {
    state.selectedAlbumId = id;
    commit('resetAlbumData');
    var aPromises = [
      Spotify.loadAlbum(state.selectedAlbumId)
        .then(function (oData) {
          commit('setAlbum', oData.data);
        })
        .catch(function (err) {
          alert(err);
        }),
      Spotify.loadAlbumTracks(state.selectedAlbumId, state.albumTracksOffset)
        .then(function (oData) {
          commit('appendAlbumTracks', oData.data);
        })
        .catch(function (err) {
          alert(err);
        })
    ];
    return aPromises;
  },
  loadMoreAlbumTracks ({commit}) {
    return Spotify.loadAlbumTracks(state.selectedAlbumId, state.albumTracksOffset)
      .then(function (oData) {
        commit('appendAlbumTracks', oData.data);
      })
      .catch(function (err) {
        alert(err);
      });
  },
  saveItem ({commit}, sUri) {
    return axios.post('/settings/saveFigure', {streamUri: sUri})
      .then(function () {
        alert('success');
      })
      .catch(function (err) {
        alert(JSON.stringify(err.response.data));
      });
  },
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

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
