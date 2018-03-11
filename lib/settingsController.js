'use strict';

var winston = require('winston');
var fs = require('fs');
var ini = require('ini');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');
var mopidy = require('./mopidy.js');
var rfidConnection = require('./rfidConnection');
var hostController = require('./hostController');

exports.saveCredentials = function (oCredentials) {
    winston.info("saving credentials");
    try {
        var oConfig = ini.parse(fs.readFileSync(constants.Mopidy.PathToConfig, 'utf-8'));
        if (!oConfig.spotify) {
            oConfig.spotify = {};
        }
        oConfig.spotify.enabled = true;
        oConfig.spotify.username = oCredentials.email;
        oConfig.spotify.password = oCredentials.password;
        oConfig.spotify.client_id = oCredentials.clientId;
        oConfig.spotify.client_secret = oCredentials.clientSecret;

        fs.writeFileSync(constants.Mopidy.PathToConfig, ini.stringify(oConfig, {whitespace: true}));
    } catch (oError) {
        throw new ApplicationError('Error while saving credentials', 500);
    }
    return mopidy.restart();
};

exports.saveFigure = function (sStreamUri) {
    winston.info("saving figure");
    return new Promise(function (resolve) {
        if (!rfidConnection.isCardDetected()) {
            throw new ApplicationError('No Card detected', 400);
        }
        try {
            var oConfig = ini.parse(fs.readFileSync(constants.Data.PathToFigures, 'utf-8'));
            if (!oConfig.figures) {
                oConfig.figures = {};
            }
            oConfig.figures[rfidConnection.getCardId()] = sStreamUri;

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