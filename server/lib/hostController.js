'use strict';

var winston = require('winston');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');

const hosts = {
    spotify: require('./spotifyController'),
    youtube: require('./youtubeController'),
    mp3: require('./mp3Controller')
};

exports.getAccounts = function () {
    return new Promise(function (resolve) {
        var aAccounts = [];
        for (var sHostId in hosts) {
            if (!hosts[sHostId].hasOwnProperty() && constants.Mopidy.Extensions.includes(sHostId)) {
                var oAccount = hosts[sHostId].getAccountInfo();
                oAccount.id = sHostId;
                aAccounts.push(oAccount);
            }
        }
        resolve(aAccounts);
    });
};

exports.getAccountInfo = function (sHostId) {
    return new Promise(function (resolve) {
        var oAccount = hosts[sHostId].getAccountInfo();
        oAccount.id = sHostId;
        resolve(oAccount);
    });
};

exports.saveAccount = function (sHostId, oAccount) {
    return new Promise(function (resolve) {
        hosts[sHostId].saveAccount(oAccount);
        resolve();
    });
};

exports.deleteAccount = function (sHostId) {
    return new Promise(function (resolve) {
        hosts[sHostId].deleteAccount();
        resolve();
    });
};

exports.search = function (sHost, sQuery) {
    return hosts[sHost].search(sQuery);
};

exports.getArtist = function (sHost, sId) {
    return hosts[sHost].getArtist(sId);
};

exports.getItemForUri = function (sUri) {
    var aParts = sUri.split(':');
    return hosts[aParts[0]].getItemForUri(sUri);
};

exports.getAuthToken = function (sHost) {
    return hosts[sHost].getAuthToken();
};