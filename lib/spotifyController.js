'use strict';

var winston = require('winston');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: constants.Spotify.ClientId,
    clientSecret: constants.Spotify.ClientSecret
});

exports.spotifyApi = spotifyApi;

exports.getAuthToken = function () {
    return spotifyApi.clientCredentialsGrant()
        .then(function (data) {
            spotifyApi.setAccessToken(data.body['access_token']);
            return data.body['access_token'];
        }, function (err) {
            console.log('Something went wrong when retrieving an access token for Spotify', err.message);
        });
};

function _search(sQuery) {
    return spotifyApi.search(sQuery, ['artist', 'album', 'track'])
        .then(function (oData) {
            return oData.body;
        });
}

function _getAlbum(sId) {
    return spotifyApi.getAlbum(sId)
        .then(function (oData) {
            return oData.body;
        });
}

function _getTrack(sId) {
    return spotifyApi.getTrack(sId)
        .then(function (oData) {
            return oData.body;
        });
}

function _getArtist(sId) {
    return spotifyApi.getArtist(sId)
        .then(function (oData) {
            return oData.body;
        });
}

exports.getAlbum = function (sId) {
    return _getAlbum(sId)
        .catch(function (oError) {
            if (oError.statusCode === 401) {
                return _getAuthToken().then(_getAlbum.bind(this, sId));
            } else {
                throw new ApplicationError(oError.message, oError.statusCode);
            }
        });
};

exports.getTrack = function (sId) {
    return _getTrack(sId)
        .catch(function (oError) {
            if (oError.statusCode === 401) {
                return _getAuthToken().then(_getTrack.bind(this, sId));
            } else {
                throw new ApplicationError(oError.message, oError.statusCode);
            }
        });
};

exports.getArtist = function (sId) {
    return _getArtist(sId)
        .catch(function (oError) {
            if (oError.statusCode === 401) {
                return _getAuthToken().then(_getArtist.bind(this, sId));
            } else {
                throw new ApplicationError(oError.message, oError.statusCode);
            }
        });
};

exports.search = function (sQuery) {
    return _search(sQuery)
        .catch(function (oError) {
            if (oError.statusCode === 401) {
                return _getAuthToken().then(_search.bind(this, sQuery));
            } else {
                throw new ApplicationError(oError.message, oError.statusCode);
            }
        });
};

exports.getItemForUri = function (sUri) {
    var aParts = sUri.split(':');

    switch (aParts[1]) {
        case 'album': {
            return this.getAlbum(aParts[2]);
        }
        case 'track': {
            return this.getTrack(aParts[2]);
        }
    }
};