'use strict';

var winston = require('winston');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');

const hosts = {
    spotify: require('./spotifyController')
};

exports.search = function (sHost, sQuery) {
    return hosts[sHost].search(sQuery);
};

exports.getItemForUri = function (sUri) {
    var aParts = sUri.split(':');
    return hosts[aParts[0]].getItemForUri(sUri);
};