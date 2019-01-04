'use strict';

var packageJson = require('../package.json');
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

exports.getConfigFile = function () {
    winston.debug("get config file");
    var oConfig;
    try {
        oConfig = ini.parse(fs.readFileSync(constants.Data.PathToFigures, 'utf-8'));
    } catch (err) {
        winston.debug("Could not read config file.", err);
        oConfig = {};
    }
    return oConfig;
};

exports.saveFigure = function (sStreamUri) {
    winston.info("saving figure");
    return new Promise(function (resolve) {
        if (!rfidConnection.isCardDetected()) {
            throw new ApplicationError('No Card detected', 400);
        }

        mopidy.onCardRemoved().then(function() {
            var oConfig = this.getConfigFile();
            oConfig[rfidConnection.getCardId()] = {
                uri: sStreamUri
            };
            this.saveConfigFile(oConfig);
            resolve();

        }.bind(this));
    }.bind(this));
};

exports.setPlayMode = function (sPlayMode, iResetAfterDays) {
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
        if (!oConfig.general) {
            oConfig.general = {};
        }
        oConfig.general.play_mode = sPlayMode;
        if (sPlayMode === constants.PlayMode.Resume && iResetAfterDays) {
            oConfig.general.reset_after_days = iResetAfterDays;
        } else {
            delete oConfig.general.reset_after_days;
        }
        this.saveConfigFile(oConfig);
        resolve();
    }.bind(this));
};

exports.getPlayMode = function () {
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
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

exports._getProgressOfSong = function (oTrackInfo) {
    return this.getPlayMode().then(function (oPlayMode) {
        var oProgress = {track: 0, position: 0},
            iProgress = parseInt(oTrackInfo.progress),
            iTrackIndex = parseInt(oTrackInfo.track_index),
            oLastPlayed = new Date(oTrackInfo.last_played);
        if (oPlayMode.playMode === constants.PlayMode.Resume) {
            var oReferenceDate = new Date();
            oReferenceDate.setDate(oReferenceDate.getDate() - oPlayMode.resetAfterDays);
            if (oReferenceDate < oLastPlayed) {
                oProgress.track = iTrackIndex;
                oProgress.position = iProgress;
            }
        }
        return oProgress;
    });
};

exports.getFigurePlayInformation = function () {
    winston.debug("get figure play information");
    if (!rfidConnection.isCardDetected()) {
        return Promise.reject(new ApplicationError('No Card detected', 400));
    }
    var oConfig = this.getConfigFile();

    var sCardId = rfidConnection.getCardId();
    var oFigure = oConfig[sCardId];
    if (oFigure) {
        return this._getProgressOfSong(oFigure).then(function (oProgress) {
            return this.getCurrentVolume().then(function(iCurrentVolume) {
                var oData = oFigure;
                oData.cardId = sCardId;
                oData.progress = oProgress;
                oData.volume = iCurrentVolume;
                winston.info('Found the following figure:', JSON.stringify(oData));
                return oData;
            });
        }.bind(this));
    }
    return Promise.resolve(null);
};

exports.saveFigurePlayInformation = function (sCardId, oTrackInfo) {
    winston.info("save figure play information");
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
        oConfig[sCardId].progress = oTrackInfo.timePosition;
        oConfig[sCardId].track_index = oTrackInfo.trackIndex;
        oConfig[sCardId].track_length = oTrackInfo.trackLength;
        oConfig[sCardId].tracklist_length = oTrackInfo.tracklistLength;
        oConfig[sCardId].last_played = new Date().toISOString();
        this.saveConfigFile(oConfig);
        resolve();
    }.bind(this));
};

exports.saveConfigFile = function (oConfig) {
    if (!fs.existsSync(constants.Data.PathToGeneralConfig)){
        fs.mkdirSync(constants.Data.PathToGeneralConfig);
    }
    if (!fs.existsSync(constants.Data.PathToAppConfig)){
        fs.mkdirSync(constants.Data.PathToAppConfig);
    }
    try {
        fs.writeFileSync(constants.Data.PathToFigures, ini.stringify(oConfig, {whitespace: true}));
    } catch (oError) {
        winston.error(oError);
        throw new ApplicationError('Error while saving config file', 500);
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

exports.getLanguage = function () {
    winston.debug("get language");
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
        var sLanguage = constants.General.Language;
        if (oConfig.general && oConfig.general.language) {
            sLanguage = oConfig.general.language;
        }
        resolve(sLanguage);
    }.bind(this));
};

exports.setLanguage = function (sLanguage) {
    winston.info("set language:", sLanguage);
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
        if (!oConfig.general) {
            oConfig.general = {};
        }
        oConfig.general.language = sLanguage;
        this.saveConfigFile(oConfig);
        resolve(oConfig.general.language);
    }.bind(this));
};

exports.getMaxVolume = function () {
    winston.debug("get max volume");
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
        var iMaxVolume = constants.General.MaxVolume;
        if (oConfig.general && oConfig.general.max_volume) {
            iMaxVolume = parseInt(oConfig.general.max_volume);
        }
        resolve(iMaxVolume);
    }.bind(this));
};

exports.setMaxVolume = function (iMaxVolume) {
    winston.info("set max volume:", iMaxVolume);
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
        if (!oConfig.general) {
            oConfig.general = {};
        }
        oConfig.general.max_volume = iMaxVolume;
        this.saveConfigFile(oConfig);
        resolve(oConfig.general.max_volume);
    }.bind(this));
};

exports.getCurrentVolume = function () {
    winston.debug("get current volume");
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
        var iCurrentVolume = constants.General.CurrentVolume;
        if (oConfig.general && oConfig.general.current_volume) {
            iCurrentVolume = parseInt(oConfig.general.current_volume);
        }
        resolve(iCurrentVolume);
    }.bind(this));
};

exports.setCurrentVolume = function (iCurrentVolume) {
    winston.debug("set current volume:", iCurrentVolume);
    return new Promise(function (resolve) {
        var oConfig = this.getConfigFile();
        if (!oConfig.general) {
            oConfig.general = {};
        }
        oConfig.general.current_volume = iCurrentVolume;
        this.saveConfigFile(oConfig);
        resolve(oConfig.general.current_volume);
    }.bind(this));
};

exports.getCurrentVersion = function () {
    winston.debug("get current version");
    return new Promise(function (resolve) {
        resolve(packageJson.version);
    }.bind(this));
};

exports.checkIfUriIsInUse = function(sUri) {
    return new Promise(function(resolve) {
        var oConfig = this.getConfigFile();
        var bUriIsInUse = Object.keys(oConfig).some(function(sKey) {
            return oConfig[sKey] && oConfig[sKey].uri === sUri;
        });
        resolve(bUriIsInUse);
    }.bind(this));
};