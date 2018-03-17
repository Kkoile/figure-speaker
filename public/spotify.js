var _getAuthToken = function () {
    return new Promise(function (resolve) {
        if (this.authToken) {
            return resolve(this.authToken);
        }
        Vue.http.get('./data/spotify/authToken', function (sAuthToken) {
            resolve(sAuthToken);
        });
    }.bind(this));
};

var search = function (sQuery) {
    return new Promise(function (resolve, reject) {
        _getAuthToken().then(function (sAuthToken) {
            Vue.http.get('https://api.spotify.com/v1/search?type=artist,album,track&q=' + sQuery, {
                headers: {
                    'Authorization': 'Bearer ' + sAuthToken,
                    'Accept': 'application/json'
                }
            }, resolve).catch(reject);
        });
    });
};

// Vue.http.interceptors.push(function (request, next) {
//     _getAuthToken().then(function (sAuthToken) {
//         request.headers.set('Authorization', 'Bearer ' + sAuthToken);
//         request.headers.set('Accept', 'application/json');
//         next()
//     });
// });