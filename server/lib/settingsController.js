'use strict';

var winston = require('winston');
var fs = require('fs');
var ini = require('ini');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');
var mopidy = require('./mopidy.js');
var rfidConnection = require('./rfidConnection');
var hostController = require('./hostController');

exports.getAccounts = function () {
    winston.debug("load all accounts");
    return hostController.getAccounts();
};

exports.getAccountInfo = function (sHostId) {
    winston.debug("load account info for ", sHostId);
    return hostController.getAccountInfo(sHostId);
};

exports.saveAccount = function (sHostId, oAccount) {
    winston.debug("save account for ", sHostId);
    return hostController.saveAccount(sHostId, oAccount)
        .then(mopidy.restart.bind(mopidy));
};

exports.deleteAccount = function (sHostId) {
    winston.debug("delete account for ", sHostId);
    return hostController.deleteAccount(sHostId)
        .then(mopidy.restart.bind(mopidy));
};

exports.saveFigure = function (sStreamUri) {
    winston.info("saving figure");
    return new Promise(function (resolve) {
        if (!rfidConnection.isCardDetected()) {
            throw new ApplicationError('No Card detected', 400);
        }

        var oConfig;
        try {
            fs.accessSync(constants.Data.PathToFigures, fs.constants.R_OK);
            oConfig = ini.parse(fs.readFileSync(constants.Data.PathToFigures, 'utf-8'));
        } catch (err) {
            oConfig = {};
        }
        if (!oConfig.figures) {
            oConfig.figures = {};
        }
        oConfig.figures[rfidConnection.getCardId()] = sStreamUri;
        try {
            fs.writeFileSync(constants.Data.PathToFigures, ini.stringify(oConfig, {whitespace: true}));
        } catch (oError) {
            throw new ApplicationError('Error while saving figure', 500);
        }
        resolve();
    });
};

exports.getFiguresUri = function () {
    winston.info("get figure");
    return new Promise(function (resolve) {
        if (!rfidConnection.isCardDetected()) {
            throw new ApplicationError('No Card detected', 400);
        }
        var oConfig;
        try {
            oConfig = ini.parse(fs.readFileSync(constants.Data.PathToFigures, 'utf-8'));
        } catch (oError) {
            throw new ApplicationError('Error while reading figure', 500);
        }
        var sUri;
        if (oConfig.figures) {
            sUri = oConfig.figures[rfidConnection.getCardId()];
        }
        resolve(sUri);
    });
};

exports.getFigureWithInformation = function () {
    winston.info("get figure");
    return this.getFiguresUri()
        .then(function (sUri) {
            if (sUri) {
                return hostController.getItemForUri(sUri);
            }
        });
};