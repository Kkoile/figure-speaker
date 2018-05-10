'use strict';

var winston = require('winston');
var constants = require('./constants.js');
var ApplicationError = require('./ApplicationError.js');

exports.getAccountInfo = function () {
    return {
        name: 'Youtube',
        enabled: true,
        configurable: false
    };
};

exports.saveAccount = function (oAccount) {
    winston.info("Cannot save account for youtube");
};

exports.deleteAccount = function () {
    winston.info("Cannot delete account for youtube");
};

exports.getItemForUri = function (sUri) {
    var aParts = sUri.split(':');

    return Promise.resolve(aParts[1]);
};