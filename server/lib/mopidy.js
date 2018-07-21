'use strict';

var winston = require('winston');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');
var child_process = require('child_process');
var settingsController = require('./settingsController');

var Mopidy = require("mopidy");
exports.mopidy = undefined;

var rfidConnection = require('./rfidConnection');
rfidConnection.listenForScan(this);

var volumeController = require('./volumeController');
volumeController.listen(this);

exports.mopidyProcess = undefined;
exports.mopidyStarted = undefined;

exports.start = function () {
    winston.info("starting mopidy");
    this.mopidyStarted = new Promise(function (resolve) {
        if (this.mopidyProcess) {
            throw new ApplicationError('Mopidy is already running', 500);
        }
        this.mopidyProcess = child_process.spawn('mopidy');
        this.mopidyProcess.stderr.on('data', function (data) {
            if (data.toString().includes('server running')) {
                winston.info("Mopidy started");
                return resolve();
            }
        });
    }.bind(this));
    return this.mopidyStarted;
};

exports.stop = function () {
    winston.info("stopping mopidy");
    return new Promise(function (resolve) {
        if (!this.mopidyProcess) {
            return resolve();
        }
        this.mopidyProcess.on('close', function () {
            resolve();
        });
        this.onCardRemoved().then(function () {
            this.mopidyProcess.kill('SIGTERM');
            delete this.mopidyProcess;
        }.bind(this));
    }.bind(this));
};

exports.restart = function () {
    winston.info("restarting mopidy");
    return this.stop()
        .then(this.start.bind(this));
};

exports._playItem = function (oData) {
    if (oData) {
        this._sCurrentFigureId = oData.cardId;
        this.mopidy.tracklist.clear()
            .then(this.mopidy.library.lookup.bind(this.mopidy, oData.uri))
            .then(this.mopidy.tracklist.add.bind(this.mopidy))
            .then(function () {
                return this.mopidy.playback.play();
            }.bind(this))
            .then(function () {
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        this.mopidy.playback.seek(oData.progress || 0).then(resolve);
                    }.bind(this), 10);
                }.bind(this));
            }.bind(this));
    }
};

exports._getAndPlayFigure = function () {
    settingsController.getFigurePlayInformation()
        .then(this._playItem.bind(this));
};

exports.onNewCardDetected = function () {
    this.mopidyStarted.then(function () {
        this.mopidy = new Mopidy({
            webSocketUrl: constants.Mopidy.WebSocketUrl,
            callingConvention: 'by-position-only'
        });
        this.mopidy.on("state:online", this._getAndPlayFigure.bind(this));
    }.bind(this));
};

exports.onCardRemoved = function () {
    if (!this.mopidy || !this._sCurrentFigureId) {
        return Promise.resolve();
    }
    return this.mopidy.playback.pause()
        .then(function () {
            return this.mopidy.playback.getTimePosition();
        }.bind(this))
        .then(settingsController.saveFigurePlayInformation.bind(settingsController, this._sCurrentFigureId))
        .catch(function (oError) {
            winston.error('Error while getting current time position, or saving figure play information', oError);
        })
        .then(function () {
            this._sCurrentFigureId = null;
            this.mopidy.close();
            this.mopidy.off();
        }.bind(this));
};

exports.onVolumeChange = function (sVolumeChange) {
    if (!this.mopidy) {
        return Promise.resolve();
    }
    return settingsController.getCurrentVolume()
        .then(function(iCurrentVolume) {
            return settingsController.getMaxVolume()
                .then(function(iMaxVolume) {
                    var iNewVolume = iCurrentVolume;
                    if (sVolumeChange === constants.VolumeChange.Increase) {
                        iNewVolume += constants.VolumeChange.Interval;
                    }
                    if (sVolumeChange === constants.VolumeChange.Decrease) {
                        iNewVolume -= constants.VolumeChange.Interval;
                    }
                    if (iNewVolume === iCurrentVolume || iNewVolume > iMaxVolume || iNewVolume < constants.General.MinVolume) {
                        return;
                    }
                    return this.mopidy.playback.volume(iNewVolume)
                        .then(settingsController.setCurrentVolume.bind(settingsController, iNewVolume));
                }.bind(this));
        }.bind(this));
};