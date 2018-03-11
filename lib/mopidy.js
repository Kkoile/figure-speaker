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

exports.start = function () {
    winston.info("starting mopidy");
    return new Promise(function (resolve) {
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

var playItem = function (sUri) {
    if (sUri) {
        mopidy.tracklist.clear()
            .then(mopidy.library.lookup.bind(mopidy, sUri))
            .then(function (oData) {
                mopidy.tracklist.add(oData);
            })
            .then(mopidy.playback.play);
    }
};

var getAndPlayFigure = function () {
    settingsController.getFiguresUri()
        .then(playItem);
};

exports.onNewCardDetected = function () {
    setTimeout(function () {
        mopidy = new Mopidy({
            webSocketUrl: constants.Mopidy.WebSocketUrl,
            callingConvention: 'by-position-only'
        });
        mopidy.on("state:online", getAndPlayFigure);
    }, 1000);
};

exports.onCardRemoved = function () {
    mopidy.playback.pause();
    mopidy.close();
};