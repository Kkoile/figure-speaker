import axios from 'axios';

export default {
  _getAuthToken: function () {
    return new Promise(function (resolve) {
      if (this.authToken) {
        return resolve(this.authToken);
      }
      axios.get('/data/spotify/authToken')
        .then(function (oData) {
          this.authToken = oData.data;
          resolve(this.authToken);
        }.bind(this));
    }.bind(this));
  },
  search: function (sQuery, sCountry, sTypes, iOffset) {
    return this._getAuthToken().then(function (sAuthToken) {
      var sMarketQuery = '';
      if (sCountry) {
        sMarketQuery = '&market=' + sCountry;
      }
      return axios.get('https://api.spotify.com/v1/search?&type=' + sTypes + '&q=' + sQuery + '&offset=' + iOffset + sMarketQuery, {
        headers: {
          Authorization: 'Bearer ' + sAuthToken,
          Accept: 'application/json'
        }
      });
    });
  },
  loadArtist: function (sArtistId) {
    return this._getAuthToken().then(function (sAuthToken) {
      return axios.get('https://api.spotify.com/v1/artists/' + sArtistId, {
        headers: {
          Authorization: 'Bearer ' + sAuthToken,
          Accept: 'application/json'
        }
      });
    });
  },
  loadArtistAlbums: function (sArtistId, iOffset) {
    return this._getAuthToken().then(function (sAuthToken) {
      return axios.get('https://api.spotify.com/v1/artists/' + sArtistId + '/albums?offset=' + iOffset, {
        headers: {
          Authorization: 'Bearer ' + sAuthToken,
          Accept: 'application/json'
        }
      });
    });
  },
  loadArtistTracks: function (sArtistId) {
    return this._getAuthToken().then(function (sAuthToken) {
      return axios.get('https://api.spotify.com/v1/artists/' + sArtistId + '/top-tracks?country=DE', {
        headers: {
          Authorization: 'Bearer ' + sAuthToken,
          Accept: 'application/json'
        }
      });
    });
  },
  loadAlbum: function (sAlbumId) {
    return this._getAuthToken().then(function (sAuthToken) {
      return axios.get('https://api.spotify.com/v1/albums/' + sAlbumId, {
        headers: {
          Authorization: 'Bearer ' + sAuthToken,
          Accept: 'application/json'
        }
      });
    });
  },
  loadAlbumTracks: function (sAlbumId, iOffset) {
    return this._getAuthToken().then(function (sAuthToken) {
      return axios.get('https://api.spotify.com/v1/albums/' + sAlbumId + '/tracks?offset=' + iOffset, {
        headers: {
          Authorization: 'Bearer ' + sAuthToken,
          Accept: 'application/json'
        }
      });
    });
  }
};
