'use strict';

var winston = require('winston');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');
var child_process = require('child_process');
var settingsController = require('./settingsController');

var Mopidy = require("mopidy");
var mopidy;

var rfidConnection = require('./rfidConnection');
rfidConnection.listenForScan(this);

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
        this.mopidyProcess.kill('SIGTERM');
    }.bind(this));
};

exports.restart = function () {
    winston.info("restarting mopidy");
    return this.stop()
        .then(this.start);
};

exports._playItem = function (oData) {
    if (oData) {
        this._sCurrentFigureId = oData.cardId;
        mopidy.tracklist.clear()
            .then(mopidy.library.lookup.bind(mopidy, oData.uri))
            .then(mopidy.tracklist.add.bind(mopidy))
            .then(function () {
                return mopidy.playback.seek(oData.progress || 0);
            }.bind(this));
    }
};

exports._getAndPlayFigure = function () {
    settingsController.getFigurePlayInformation()
        .then(this._playItem.bind(this));
};

exports.onNewCardDetected = function () {
    this.mopidyStarted.then(function () {
        mopidy = new Mopidy({
            webSocketUrl: constants.Mopidy.WebSocketUrl,
            callingConvention: 'by-position-only'
        });
        mopidy.on("state:online", this._getAndPlayFigure.bind(this));
    }.bind(this));
};

exports.onCardRemoved = function () {
    if (!mopidy || !this._sCurrentFigureId) {
        return Promise.resolve();
    }
    return mopidy.playback.pause()
        .then(function () {
            return mopidy.playback.getTimePosition();
        }.bind(this))
        .then(settingsController.saveFigurePlayInformation.bind(settingsController, this._sCurrentFigureId))
        .catch(function (oError) {
            winston.error('Error while getting current time position, or saving figure play information', oError);
        })
        .then(function () {
            this._sCurrentFigureId = null;
            mopidy.close();
            mopidy.off();
        }.bind(this));
};