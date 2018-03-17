import Vue from 'vue'
import Vuex from 'vuex'
import Spotify from './lib/Spotify'

Vue.use(Vuex)

const state = {
  query: "",
  artists: [],
  artistsOffset: 0,
  moreArtists: false,
  albums: [],
  albumsOffset: 0,
  moreAlbums: false,
  tracks: [],
  tracksOffset: 0,
  moreTracks: false,
}

const mutations = {
  setArtists (state, artists) {
    state.artists = artists.items
    state.artistsOffset += artists.limit
    state.moreArtists = artists.total > state.artistsOffset
  },
  appendArtists (state, artists) {
    state.artists = state.artists.concat(artists.items)
    state.artistsOffset += artists.limit
    state.moreArtists = artists.total > state.artistsOffset
  },
  setAlbums (state, albums) {
    state.albums = albums.items
    state.albumsOffset += albums.limit
    state.moreAlbums = albums.total > state.albumsOffset
  },
  appendAlbums (state, albums) {
    state.albums = state.albums.concat(albums.items)
    state.albumsOffset += albums.limit
    state.moreAlbums = albums.total > state.albumsOffset
  },
  setTracks (state, tracks) {
    state.tracks = tracks.items
    state.tracksOffset += tracks.limit
    state.moreTracks = tracks.total > state.tracksOffset
  },
  appendTracks (state, tracks) {
    state.tracks = state.tracks.concat(tracks.items)
    state.tracksOffset += tracks.limit
    state.moreTracks = tracks.total > state.tracksOffset
  },
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
  search ({commit}) {
    state.artistsOffset = 0
    return Spotify.search(state.query, 'artist,album,track', state.artistsOffset)
      .then(function (oData) {
        commit('setArtists', oData.data.artists);
        commit('setAlbums', oData.data.albums);
        commit('setTracks', oData.data.tracks);
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
  }
}

const getters = {}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
