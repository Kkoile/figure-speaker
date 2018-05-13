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
        oConfig[rfidConnection.getCardId()] = {
            uri: sStreamUri
        };
        this._saveFiguresFile(oConfig);
        resolve();
    }.bind(this));
};

exports.setPlayMode = function (sPlayMode, iResetAfterDays) {
    return new Promise(function (resolve) {
        var oConfig;
        try {
            oConfig = ini.parse(fs.readFileSync(constants.Data.PathToFigures, 'utf-8'));
        } catch (oError) {
            throw new ApplicationError('Error while reading figure', 500);
        }
        if (!oConfig.general) {
            oConfig.general = {};
        }
        oConfig.general.play_mode = sPlayMode;
        if (sPlayMode === constants.PlayMode.Resume && iResetAfterDays) {
            oConfig.general.reset_after_days = iResetAfterDays;
        } else {
            delete oConfig.general.reset_after_days;
        }
        this._saveFiguresFile(oConfig);
        resolve();
    }.bind(this));
};

exports.getPlayMode = function () {
    return new Promise(function (resolve) {
        var oConfig;
        try {
            oConfig = ini.parse(fs.readFileSync(constants.Data.PathToFigures, 'utf-8'));
        } catch (oError) {
            throw new ApplicationError('Error while reading figure', 500);
        }
        var oPlayMode = {
            playMode: constants.Player.DefaultPlayMode,
            resetAfterDays: constants.Player.DefaultResetAfterDays
        };
        if (oConfig.general && oConfig.general.play_mode) {
            oPlayMode.playMode = oConfig.general.play_mode;
        }
        if (oConfig.general && oConfig.general.reset_after_days) {
            oPlayMode.resetAfterDays = parseInt(oConfig.general.reset_after_days);
        }
        resolve(oPlayMode);
    }.bind(this));
};

exports._getProgressOfSong = function (vProgress, vLastPlayed) {
    return this.getPlayMode().then(function (oPlayMode) {
        var iProgress = parseInt(vProgress),
            oLastPlayed = new Date(vLastPlayed);
        if (oPlayMode.playMode === constants.PlayMode.Resume) {
            var oReferenceDate = new Date();
            oReferenceDate.setDate(oReferenceDate.getDate() - oPlayMode.resetAfterDays);
            if (oReferenceDate > oLastPlayed) {
                return 0;
            } else {
                return iProgress;
            }
        }
        return 0;
    });
};

exports.getFigurePlayInformation = function () {
    winston.debug("get figure play information");
    if (!rfidConnection.isCardDetected()) {
        return Promise.reject(new ApplicationError('No Card detected', 400));
    }
    var oConfig;
    try {
        oConfig = ini.parse(fs.readFileSync(constants.Data.PathToFigures, 'utf-8'));
    } catch (oError) {
        return Promise.reject(new ApplicationError('Error while reading figure', 500));
    }

    var sCardId = rfidConnection.getCardId();
    if (oConfig[sCardId]) {
        return this._getProgressOfSong(oConfig[sCardId].progress, oConfig[sCardId].last_played).then(function (iProgress) {
            var oData = oConfig[sCardId];
            oData.cardId = sCardId;
            oData.progress = iProgress;
            winston.info('Found the following figure:', JSON.stringify(oData));
            return oData;
        });
    }
    return Promise.resolve(null);
};

exports.saveFigurePlayInformation = function (sCardId, iProgress) {
    winston.info("save figure play information");
    return new Promise(function (resolve) {
        var oConfig;
        try {
            oConfig = ini.parse(fs.readFileSync(constants.Data.PathToFigures, 'utf-8'));
        } catch (oError) {
            throw new ApplicationError('Error while reading figure', 500);
        }
        oConfig[sCardId].progress = iProgress;
        oConfig[sCardId].last_played = new Date().toISOString();
        this._saveFiguresFile(oConfig);
        resolve();
    }.bind(this));
};

exports._saveFiguresFile = function (oConfig) {
    try {
        fs.writeFileSync(constants.Data.PathToFigures, ini.stringify(oConfig, {whitespace: true}));
    } catch (oError) {
        throw new ApplicationError('Error while saving figure', 500);
    }
};

exports.getFigureWithInformation = function () {
    winston.info("get figure");
    return this.getFigurePlayInformation()
        .then(function (oData) {
            if (oData) {
                return hostController.getItemForUri(oData.uri);
            }
        });
};