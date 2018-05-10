'use strict';

var winston = require('winston');
var fs = require('fs');
var ini = require('ini');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');
var SpotifyWebApi = require('spotify-web-api-node');

var spotifyApi = new SpotifyWebApi({
    clientId: constants.Spotify.ClientId,
    clientSecret: constants.Spotify.ClientSecret
});

exports.spotifyApi = spotifyApi;

exports.getAccountInfo = function () {
    var oConfig = ini.parse(fs.readFileSync(constants.Mopidy.PathToConfig, 'utf-8'));
    if (!oConfig.spotify) {
        oConfig.spotify = {};
    }
    var bEnabled = true;
    if (oConfig.spotify.enabled !== null && oConfig.spotify.enabled !== undefined) {
        bEnabled = !!oConfig.spotify.enabled;
    }
    return {
        name: 'Spotify',
        enabled: bEnabled,
        username: !!oConfig.spotify.username ? oConfig.spotify.username : null,
        client_id: !!oConfig.spotify.client_id ? oConfig.spotify.client_id : null,
        configurable: true,
        requiredInfo: [
            {
                key: 'username',
                name: 'User Name'
            }, {
                key: 'password',
                name: 'Password',
                password: true
            },
            {
                key: 'client_id',
                name: 'Client Id'
            },
            {
                key: 'client_secret',
                name: 'Client Secret',
                password: true
            }
        ]
    };
};

exports.saveAccount = function (oAccount) {
    if (!oAccount.username || !oAccount.password || !oAccount.client_id || !oAccount.client_secret) {
        throw new ApplicationError('Not enough input given', 400);
    }
    winston.info("saving credentials");
    try {
        var oConfig = ini.parse(fs.readFileSync(constants.Mopidy.PathToConfig, 'utf-8'));
        if (!oConfig.spotify) {
            oConfig.spotify = {};
        }
        oConfig.spotify.enabled = true;
        oConfig.spotify.username = oAccount.username;
        oConfig.spotify.password = oAccount.password;
        oConfig.spotify.client_id = oAccount.client_id;
        oConfig.spotify.client_secret = oAccount.client_secret;

        fs.writeFileSync(constants.Mopidy.PathToConfig, ini.stringify(oConfig, {whitespace: true}));
    } catch (oError) {
        throw new ApplicationError('Error while saving credentials', 500);
    }
};

exports.deleteAccount = function () {
    winston.info("deleting credentials");
    try {
        var oConfig = ini.parse(fs.readFileSync(constants.Mopidy.PathToConfig, 'utf-8'));
        oConfig.spotify = {enabled: false};

        fs.writeFileSync(constants.Mopidy.PathToConfig, ini.stringify(oConfig, {whitespace: true}));
    } catch (oError) {
        throw new ApplicationError('Error while deleting credentials', 500);
    }
};

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
                return this.getAuthToken().then(_getAlbum.bind(this, sId));
            } else {
                throw new ApplicationError(oError.message, oError.statusCode);
            }
        }.bind(this));
};

exports.getTrack = function (sId) {
    return _getTrack(sId)
        .catch(function (oError) {
            if (oError.statusCode === 401) {
                return this.getAuthToken().then(_getTrack.bind(this, sId));
            } else {
                throw new ApplicationError(oError.message, oError.statusCode);
            }
        }.bind(this));
};

exports.getArtist = function (sId) {
    return _getArtist(sId)
        .catch(function (oError) {
            if (oError.statusCode === 401) {
                return this.getAuthToken()().then(_getArtist.bind(this, sId));
            } else {
                throw new ApplicationError(oError.message, oError.statusCode);
            }
        }.bind(this));
};

exports.search = function (sQuery) {
    return _search(sQuery)
        .catch(function (oError) {
            if (oError.statusCode === 401) {
                return this.getAuthToken().then(_search.bind(this, sQuery));
            } else {
                throw new ApplicationError(oError.message, oError.statusCode);
            }
        }.bind(this));
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