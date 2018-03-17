import axios from 'axios';

export default {
  _getAuthToken: function () {
    return new Promise(function (resolve) {
      if (this.authToken) {
        return resolve(this.authToken);
      }
      axios.get('http://localhost:3000/data/spotify/authToken')
        .then(function (oData) {
          this.authToken = oData.data;
          resolve(this.authToken);
        }.bind(this));
    }.bind(this));
  },
  search: function (sQuery, sTypes, iOffset) {
    return this._getAuthToken().then(function (sAuthToken) {
      return axios.get('https://api.spotify.com/v1/search?type=' + sTypes + '&q=' + sQuery + '&offset=' + iOffset, {
        headers: {
          'Authorization': 'Bearer ' + sAuthToken,
          'Accept': 'application/json'
        }
      });
    });
  }

// Vue.http.interceptors.push(function (request, next) {
//     _getAuthToken().then(function (sAuthToken) {
//         request.headers.set('Authorization', 'Bearer ' + sAuthToken);
//         request.headers.set('Accept', 'application/json');
//         next()
//     });
// });

}
