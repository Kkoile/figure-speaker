'use strict';

var winston = require('winston');
var constants = require('./constants.js');
var ApplicationError = require('./ApplicationError.js');

exports.getAccountInfo = function () {
    return {
        name: 'MP3',
        enabled: true,
        configurable: false
    };
};

exports.saveAccount = function (oAccount) {
    return Promise.reject("Cannot save credentials for mp3");
};

exports.deleteAccount = function () {
    winston.info("Cannot delete account for mp3");
};

exports.getItemForUri = function (sUri) {
    return Promise.resolve(sUri);
};