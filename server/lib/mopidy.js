'use strict';

var winston = require('winston');
var ApplicationError = require('./ApplicationError.js');
var constants = require('./constants.js');
var child_process = require('child_process');
var settingsController = require('./settingsController');

var Mopidy = require("mopidy");
exports.mopidy = undefined;

try {
    var rfidConnection = require('./rfidConnection');
    rfidConnection.listenForScan(this);
} catch (oError) {
    winston.error("Could not listen for RFID Scans.", oError);
}

var buttonController = require('./buttonController');

exports.mopidyProcess = undefined;
exports.mopidyStarted = undefined;
exports.isSpotifyReady = undefined;

exports.start = function () {
    winston.info("starting mopidy");
    this.mopidyStarted = new Promise(function (resolveMopidyStarted) {
        if (this.mopidyProcess) {
            throw new ApplicationError('Mopidy is already running', 500);
        }
        this.mopidyProcess = child_process.spawn('mopidy');
        this.isSpotifyReady = new Promise(function (resolveSpotifyLoggedIn) {
            this.mopidyProcess.stderr.on('data', function (data) {
                winston.debug(data.toString());
                if (data.toString().includes('HTTP server running')) {
                    winston.info("Mopidy started");
                    resolveMopidyStarted();
                }
                if (data.toString().includes('Logged in to Spotify in online mode')) {
                    winston.info("Logged in to Spotify");
                    resolveSpotifyLoggedIn();
                }
            }.bind(this));
        }.bind(this));
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

exports.scanMp3Files = function () {
    winston.info("scanning mp3 files");
    return new Promise(function (resolve, reject) {
        var oProcess = child_process.spawn('mopidy', ['local', 'scan']);
        oProcess.on('close', function (iCode) {
            if (iCode !== 0) {
                winston.error("Scanning mp3 files return error code: " + iCode);
                reject(new Error("Scanning mp3 files return error code: " + iCode));
            }
            resolve();
        });
    });

};

exports._waitForMopidyToPlayThisTrack = function (sUri) {
    return new Promise(function (resolve) {
        if (sUri.indexOf("spotify") === 0) {
            this.isSpotifyReady.then(resolve);
        } else {
            resolve();
        }
    }.bind(this));
};

exports._playItem = function (oData) {
    if (oData) {
        this._sCurrentFigureId = oData.cardId;
        return this._waitForMopidyToPlayThisTrack(oData.uri)
            .then(function () {
                return this.mopidy.tracklist.clear();
            }.bind(this))
            .then(this.mopidy.library.lookup.bind(this.mopidy, oData.uri))
            .then(this.mopidy.tracklist.add.bind(this.mopidy))
            .then(function () {
                return this.mopidy.tracklist.getTlTracks();
            }.bind(this))
            .then(function (aItems) {
                return oData.progress.track < aItems.length ? aItems[oData.progress.track] : aItems[0];
            }.bind(this))
            .then(function (oItem) {
                return this.mopidy.playback.play(oItem);
            }.bind(this))
            .then(function () {
                return this.mopidy.playback.setVolume(oData.volume);
            }.bind(this))
            .then(function () {
                return this.mopidy.playback.repeat(!!oData.repeat);
            }.bind(this))
            .then(function () {
                return new Promise(function (resolve) {
                    if (oData.progress.position > 0) {
                        setTimeout(function () {
                            this.mopidy.playback.seek(oData.progress.position).then(resolve);
                        }.bind(this), 10);
                    } else {
                        resolve();
                    }
                }.bind(this));
            }.bind(this));
    } else {
        return Promise.resolve();
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
        .then(function (iTimePosition) {
            return this.mopidy.tracklist.index()
                .then(function (iIndex) {
                    return {timePosition: iTimePosition, trackIndex: iIndex};
                });
        }.bind(this))
        .then(function (oTrackInfo) {
            return this.mopidy.tracklist.getLength()
                .then(function (iLength) {
                    oTrackInfo.tracklistLength = iLength;
                    return oTrackInfo;
                });
        }.bind(this))
        .then(function (oTrackInfo) {
            return this.mopidy.playback.getCurrentTrack()
                .then(function (oTrack) {
                    oTrackInfo.trackLength = oTrack.length;
                    return oTrackInfo;
                });
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
        .then(function (iCurrentVolume) {
            return settingsController.getMaxVolume()
                .then(function (iMaxVolume) {
                    var iNewVolume = iCurrentVolume;
                    if (sVolumeChange === constants.Buttons.Increase) {
                        iNewVolume += constants.Buttons.WatchInterval;
                    }
                    if (sVolumeChange === constants.Buttons.Decrease) {
                        iNewVolume -= constants.Buttons.WatchInterval;
                    }
                    if (iNewVolume === iCurrentVolume || iNewVolume > iMaxVolume || iNewVolume < constants.General.MinVolume) {
                        return;
                    }
                    return this.mopidy.playback.setVolume(iNewVolume)
                        .then(settingsController.setCurrentVolume.bind(settingsController, iNewVolume));
                }.bind(this));
        }.bind(this));
};

exports.onWindAction = function (sWindAction) {
    if (!this.mopidy) {
        return Promise.resolve();
    }
    if (sWindAction === constants.Buttons.WindForwards) {
        return this.mopidy.tracklist.index()
            .then(function (iIndex) {
                return this.mopidy.tracklist.getLength()
                    .then(function (iLength) {
                        if (iIndex < iLength - 1) {
                            return this.mopidy.playback.next();
                        }
                    }.bind(this));
            }.bind(this));
    } else if (sWindAction === constants.Buttons.ReWind) {
        return this.mopidy.tracklist.index()
            .then(function (iIndex) {
                if (iIndex === 0) {
                    return this.mopidy.playback.stop()
                        .then(this.mopidy.playback.play.bind(this.mopidy));
                } else {
                    return this.mopidy.playback.previous();
                }
            }.bind(this));
    }
};

buttonController.listen(this);
