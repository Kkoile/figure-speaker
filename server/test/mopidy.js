var assert = require('assert');
var sinon = require('sinon');
var constants = require('../lib/constants');

var child_process = require('child_process');
var settingsController = require('../lib/settingsController');

var mopidy = require('../lib/mopidy.js');

describe('Mopidy', function () {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        mopidy.mopidyProcess = undefined;
        mopidy.isSpotifyReady = undefined;
    });

    describe('start', function () {
        it('should start a mopidy process', function (done) {

            var oProcess = {
                stderr: {
                    on: function () {
                    }
                }
            };
            sandbox.stub(oProcess.stderr, 'on').yields('HTTP server running');
            var oChildProcessStub = sandbox.stub(child_process, 'spawn').withArgs('mopidy').returns(oProcess);

            mopidy.start().then(function () {
                assert(oChildProcessStub.calledOnce);
                done();
            });

        });
        it('should fail when trying to start two processes', function (done) {

            var oProcess = {
                stderr: {
                    on: function () {
                    }
                }
            };
            sandbox.stub(oProcess.stderr, 'on').yields('HTTP server running');
            var oChildProcessStub = sandbox.stub(child_process, 'spawn').withArgs('mopidy').returns(oProcess);

            mopidy.start().then(function () {
                mopidy.start()
                    .catch(function (oError) {
                        assert(oChildProcessStub.calledOnce);
                        assert(oError.status === 500);
                        done();
                    });
            });
        });
        it('should resolve spotify logged on promise', function (done) {

            var oProcess = {
                stderr: {
                    on: function () {
                    }
                }
            };
            sandbox.stub(oProcess.stderr, 'on').yields('HTTP server running Logged in to Spotify in online mode');
            var oChildProcessStub = sandbox.stub(child_process, 'spawn').withArgs('mopidy').returns(oProcess);

            mopidy.start().then(function () {
                mopidy.isSpotifyReady.then(function () {
                    done();
                });
            });
        });
    });

    describe('stop', function () {
        it('should stop an existing mopidy process', function (done) {
            var oProcess = {
                kill: function () {
                },
                on: function () {

                }
            };
            mopidy.mopidyProcess = oProcess;
            var oProcessStub = sandbox.stub(oProcess, 'kill').withArgs('SIGTERM');
            sandbox.stub(oProcess, 'on').withArgs('close').yields();

            mopidy.stop().then(function () {
                assert(oProcessStub.calledOnce);
                done();
            });
        });
        it('should do nothing because there is no existing process', function (done) {
            mopidy.mopidyProcess = undefined;

            mopidy.stop().then(function () {
                done();
            });
        });
    });

    describe('restart', function () {
        it('should stop and restart the mopidy process', function (done) {
            var oStopStub = sandbox.stub(mopidy, 'stop').resolves();
            var oStartStub = sandbox.stub(mopidy, 'start').resolves();

            mopidy.restart().then(function () {
                assert(oStopStub.calledOnce);
                assert(oStartStub.calledOnce);
                done();
            });
        });
    });

    describe('scanMp3Files', function () {
        it('should spawn the child process `mopidy local scan`', function (done) {
            var oProcess = {
                on: function (sEvent, cb) {
                    if (sEvent === 'close') {
                        return cb(0);
                    }
                }
            };
            var oChildProcessStub = sandbox.stub(child_process, 'spawn').withArgs('mopidy', ['local', 'scan']).returns(oProcess);

            mopidy.scanMp3Files().then(function () {
                assert(oChildProcessStub.calledOnce);
                done();
            });
        });
        it('should reject if exit code is not 0', function (done) {
            var oProcess = {
                on: function (sEvent, cb) {
                    if (sEvent === 'close') {
                        return cb(1);
                    }
                }
            };
            var oChildProcessStub = sandbox.stub(child_process, 'spawn').withArgs('mopidy', ['local', 'scan']).returns(oProcess);

            mopidy.scanMp3Files().catch(function () {
                assert(oChildProcessStub.calledOnce);
                done();
            });
        });
    });

    describe('_waitForMopidyToPlayThisTrack', function () {
        it('should resolve directly if uri does not start with `spotify`', function (done) {
            mopidy._waitForMopidyToPlayThisTrack('local:file').then(function () {
                done();
            });
        });
        it('should wait for spotify to be logged on if uri starts with `spotify`', function (done) {
            var bSpotifyResolve = false;
            mopidy.isSpotifyReady = new Promise(function (resolve) {
                setTimeout(function () {
                    bSpotifyResolve = true;
                    resolve();
                }, 10);
            });
            mopidy._waitForMopidyToPlayThisTrack('spotify').then(function () {
                assert(bSpotifyResolve);
                done();
            });
        });
    });

    describe('_playItem', function () {
        it('should not do anything if no figure data is given', function (done) {
            var oMopidyWaitForTrackStub = sandbox.stub(mopidy, '_waitForMopidyToPlayThisTrack');
            mopidy.mopidy = {
                tracklist: {
                    clear: function () {
                        assert(false);
                        return Promise.resolve();
                    },
                    add: function (oItem) {
                        assert(false);
                        return Promise.resolve();
                    },
                    getTlTracks: function () {
                        assert(false);
                        return Promise.resolve([]);
                    }
                },
                library: {
                    lookup: function (sUri) {
                        assert(false);
                        return Promise.resolve({item: true});
                    }
                },
                playback: {
                    setVolume: function (iVolume) {
                        assert(false);
                        return Promise.resolve();
                    },
                    play: function (oItem) {
                        assert(false);
                        return Promise.resolve();
                    },
                    seek: function (iPosition) {
                        assert(false);
                        return Promise.resolve();
                    }
                }
            };

            mopidy._playItem(null).then(function () {
                assert(oMopidyWaitForTrackStub.notCalled);
                done();
            });
        });
        it('should pass uri to _waitForMopidyToPlayThisTrack', function (done) {
            var oMopidyWaitForTrackStub = sandbox.stub(mopidy, '_waitForMopidyToPlayThisTrack').withArgs("DUMMY_URI").resolves();
            mopidy.mopidy = {
                tracklist: {
                    clear: function () {
                        return Promise.resolve();
                    },
                    add: function (oItem) {
                        return Promise.resolve();
                    },
                    getTlTracks: function () {
                        return Promise.resolve([]);
                    }
                },
                library: {
                    lookup: function (sUri) {
                        return Promise.resolve({item: true});
                    }
                },
                playback: {
                    setVolume: function (iVolume) {
                        return Promise.resolve();
                    },
                    play: function (oItem) {
                        return Promise.resolve();
                    },
                    seek: function (iPosition) {
                        return Promise.resolve();
                    }
                }
            };

            mopidy._playItem({uri: "DUMMY_URI", progress: {}}).then(function () {
                assert(oMopidyWaitForTrackStub.calledOnce);
                done();
            });
        });
        it('should seek if position > 0', function (done) {
            var oMopidyWaitForTrackStub = sandbox.stub(mopidy, '_waitForMopidyToPlayThisTrack').resolves();
            var iSeekPosition = null,
                bSeekCalled = false;
            mopidy.mopidy = {
                tracklist: {
                    clear: function () {
                        return Promise.resolve();
                    },
                    add: function (oItem) {
                        return Promise.resolve();
                    },
                    getTlTracks: function () {
                        return Promise.resolve([]);
                    }
                },
                library: {
                    lookup: function (sUri) {
                        return Promise.resolve({item: true});
                    }
                },
                playback: {
                    setVolume: function (iVolume) {
                        return Promise.resolve();
                    },
                    play: function (oItem) {
                        return Promise.resolve();
                    },
                    seek: function (iPosition) {
                        bSeekCalled = true;
                        iSeekPosition = iPosition;
                        return Promise.resolve();
                    }
                }
            };

            mopidy._playItem({progress: {position: 10}}).then(function () {
                assert(bSeekCalled);
                assert(iSeekPosition == 10);
                done();
            });
        });
        it('should not seek if position is 0', function (done) {
            var oMopidyWaitForTrackStub = sandbox.stub(mopidy, '_waitForMopidyToPlayThisTrack').resolves();
            var iSeekPosition = null,
                bSeekCalled = false;
            mopidy.mopidy = {
                tracklist: {
                    clear: function () {
                        return Promise.resolve();
                    },
                    add: function (oItem) {
                        return Promise.resolve();
                    },
                    getTlTracks: function () {
                        return Promise.resolve([]);
                    }
                },
                library: {
                    lookup: function (sUri) {
                        return Promise.resolve({item: true});
                    }
                },
                playback: {
                    setVolume: function (iVolume) {
                        return Promise.resolve();
                    },
                    play: function (oItem) {
                        return Promise.resolve();
                    },
                    seek: function (iPosition) {
                        bSeekCalled = true;
                        iSeekPosition = iPosition;
                        return Promise.resolve();
                    }
                }
            };

            mopidy._playItem({progress: {position: 0}}).then(function () {
                assert(!bSeekCalled);
                done();
            });
        });
        it('should not seek if not position is `null`', function (done) {
            var oMopidyWaitForTrackStub = sandbox.stub(mopidy, '_waitForMopidyToPlayThisTrack').resolves();
            var iSeekPosition = null,
                bSeekCalled = false;
            mopidy.mopidy = {
                tracklist: {
                    clear: function () {
                        return Promise.resolve();
                    },
                    add: function (oItem) {
                        return Promise.resolve();
                    },
                    getTlTracks: function () {
                        return Promise.resolve([]);
                    }
                },
                library: {
                    lookup: function (sUri) {
                        return Promise.resolve({item: true});
                    }
                },
                playback: {
                    setVolume: function (iVolume) {
                        return Promise.resolve();
                    },
                    play: function (oItem) {
                        return Promise.resolve();
                    },
                    seek: function (iPosition) {
                        bSeekCalled = true;
                        iSeekPosition = iPosition;
                        return Promise.resolve();
                    }
                }
            };

            mopidy._playItem({progress: {position: null}}).then(function () {
                assert(!bSeekCalled);
                done();
            });
        });
        it('should play the first item from position if track is 0', function (done) {
            var oMopidyWaitForTrackStub = sandbox.stub(mopidy, '_waitForMopidyToPlayThisTrack').resolves();
            var aItems = [{item: 0}, {item: 1}, {item: 2}],
                oItemToPlay = null;

            mopidy.mopidy = {
                tracklist: {
                    clear: function () {
                        return Promise.resolve();
                    },
                    add: function (oItem) {
                        return Promise.resolve();
                    },
                    getTlTracks: function () {
                        return Promise.resolve(aItems);
                    }
                },
                library: {
                    lookup: function (sUri) {
                        return Promise.resolve({item: true});
                    }
                },
                playback: {
                    setVolume: function (iVolume) {
                        return Promise.resolve();
                    },
                    play: function (oItem) {
                        oItemToPlay = oItem;
                        return Promise.resolve();
                    },
                    seek: function (iPosition) {
                        return Promise.resolve();
                    }
                }
            };

            mopidy._playItem({progress: {track: 0}}).then(function () {
                assert(oItemToPlay === aItems[0]);
                done();
            });
        });
        it('should play the nth item from position', function (done) {
            var oMopidyWaitForTrackStub = sandbox.stub(mopidy, '_waitForMopidyToPlayThisTrack').resolves();
            var aItems = [{item: 0}, {item: 1}, {item: 2}],
                oItemToPlay = null;

            mopidy.mopidy = {
                tracklist: {
                    clear: function () {
                        return Promise.resolve();
                    },
                    add: function (oItem) {
                        return Promise.resolve();
                    },
                    getTlTracks: function () {
                        return Promise.resolve(aItems);
                    }
                },
                library: {
                    lookup: function (sUri) {
                        return Promise.resolve({item: true});
                    }
                },
                playback: {
                    setVolume: function (iVolume) {
                        return Promise.resolve();
                    },
                    play: function (oItem) {
                        oItemToPlay = oItem;
                        return Promise.resolve();
                    },
                    seek: function (iPosition) {
                        return Promise.resolve();
                    }
                }
            };

            mopidy._playItem({progress: {track: 1}}).then(function () {
                assert(oItemToPlay === aItems[1]);
                done();
            });
        });
        it('should play the first item if track is greater than items', function (done) {
            var oMopidyWaitForTrackStub = sandbox.stub(mopidy, '_waitForMopidyToPlayThisTrack').resolves();
            var aItems = [{item: 0}, {item: 1}, {item: 2}],
                oItemToPlay = null;

            mopidy.mopidy = {
                tracklist: {
                    clear: function () {
                        return Promise.resolve();
                    },
                    add: function (oItem) {
                        return Promise.resolve();
                    },
                    getTlTracks: function () {
                        return Promise.resolve(aItems);
                    }
                },
                library: {
                    lookup: function (sUri) {
                        return Promise.resolve({item: true});
                    }
                },
                playback: {
                    setVolume: function (iVolume) {
                        return Promise.resolve();
                    },
                    play: function (oItem) {
                        oItemToPlay = oItem;
                        return Promise.resolve();
                    },
                    seek: function (iPosition) {
                        return Promise.resolve();
                    }
                }
            };

            //should return the first item, if index is greater than length of items
            mopidy._playItem({progress: {track: 5}}).then(function () {
                assert(oItemToPlay === aItems[0]);
                done();
            });
        });
    });

    describe('onVolumeChange', function () {
        it('should increase the volume', function (done) {
            var oGetCurrentVolumeStub = sandbox.stub(settingsController, 'getCurrentVolume').resolves(70);
            var oMaxVolumeStub = sandbox.stub(settingsController, 'getMaxVolume').resolves(100);
            var iNewCurrentVolume;
            var oSetCurrentVolumeStub = sandbox.stub(settingsController, 'setCurrentVolume').callsFake(function (iCurrentVolumeToSet) {
                iNewCurrentVolume = iCurrentVolumeToSet;
            });
            var iCurrentVolumeToSet;
            mopidy.mopidy = {
                playback: {
                    setVolume: function (iVolume) {
                        iCurrentVolumeToSet = iVolume;
                        return Promise.resolve();
                    }
                }
            };

            mopidy.onVolumeChange(constants.Buttons.Increase).then(function () {
                assert(iNewCurrentVolume === 70 + constants.Buttons.WatchInterval);
                assert(iCurrentVolumeToSet === 70 + constants.Buttons.WatchInterval);

                assert(oGetCurrentVolumeStub.calledOnce);
                assert(oMaxVolumeStub.calledOnce);
                assert(oSetCurrentVolumeStub.calledOnce);
                done();
            });
        });
        it('should decrease the volume', function (done) {
            var oGetCurrentVolumeStub = sandbox.stub(settingsController, 'getCurrentVolume').resolves(70);
            var oMaxVolumeStub = sandbox.stub(settingsController, 'getMaxVolume').resolves(100);
            var iNewCurrentVolume;
            var oSetCurrentVolumeStub = sandbox.stub(settingsController, 'setCurrentVolume').callsFake(function (iCurrentVolumeToSet) {
                iNewCurrentVolume = iCurrentVolumeToSet;
            });
            var iCurrentVolumeToSet;
            mopidy.mopidy = {
                playback: {
                    setVolume: function (iVolume) {
                        iCurrentVolumeToSet = iVolume;
                        return Promise.resolve();
                    }
                }
            };

            mopidy.onVolumeChange(constants.Buttons.Decrease).then(function () {
                assert(iNewCurrentVolume === 70 - constants.Buttons.WatchInterval);
                assert(iCurrentVolumeToSet === 70 - constants.Buttons.WatchInterval);

                assert(oGetCurrentVolumeStub.calledOnce);
                assert(oMaxVolumeStub.calledOnce);
                assert(oSetCurrentVolumeStub.calledOnce);
                done();
            });
        });
        it('should not increase the volume', function (done) {
            var oGetCurrentVolumeStub = sandbox.stub(settingsController, 'getCurrentVolume').resolves(70);
            var oMaxVolumeStub = sandbox.stub(settingsController, 'getMaxVolume').resolves(70);
            var oSetCurrentVolumeStub = sandbox.stub(settingsController, 'setCurrentVolume');
            mopidy.mopidy = {
                playback: {
                    setVolume: function () {
                        assert(false);
                    }
                }
            };

            mopidy.onVolumeChange(constants.Buttons.Increase).then(function () {
                assert(oGetCurrentVolumeStub.calledOnce);
                assert(oMaxVolumeStub.calledOnce);
                assert(oSetCurrentVolumeStub.notCalled);
                done();
            });
        });
        it('should not decrease the volume', function (done) {
            var oGetCurrentVolumeStub = sandbox.stub(settingsController, 'getCurrentVolume').resolves(5);
            var oMaxVolumeStub = sandbox.stub(settingsController, 'getMaxVolume').resolves(100);
            var oSetCurrentVolumeStub = sandbox.stub(settingsController, 'setCurrentVolume');
            mopidy.mopidy = {
                playback: {
                    setVolume: function () {
                        assert(false);
                    }
                }
            };

            mopidy.onVolumeChange(constants.Buttons.Decrease).then(function () {
                assert(oGetCurrentVolumeStub.calledOnce);
                assert(oMaxVolumeStub.calledOnce);
                assert(oSetCurrentVolumeStub.notCalled);
                done();
            });
        });
        it('should do nothing if no track is playing', function (done) {
            var oGetCurrentVolumeStub = sandbox.stub(settingsController, 'getCurrentVolume');
            var oMaxVolumeStub = sandbox.stub(settingsController, 'getMaxVolume');
            var oSetCurrentVolumeStub = sandbox.stub(settingsController, 'setCurrentVolume');
            mopidy.mopidy = undefined;

            mopidy.onVolumeChange(constants.Buttons.Increase).then(function () {
                assert(oGetCurrentVolumeStub.notCalled);
                assert(oMaxVolumeStub.notCalled);
                assert(oSetCurrentVolumeStub.notCalled);
                done();
            });
        });
    });

    describe('onWindAction', function () {
        it('should seek to next track', function (done) {
            var bNextCalled = false;
            var bPreviousCalled = false;
            var bIndexCalled = false;
            var bLengthCalled = false;
            mopidy.mopidy = {
                playback: {
                    next: function () {
                        bNextCalled = true;
                        return Promise.resolve();
                    },
                    previous: function () {
                        bPreviousCalled = true;
                        return Promise.resolve();
                    }
                },
                tracklist: {
                    index: function () {
                        bIndexCalled = true;
                        return Promise.resolve(0);
                    },
                    getLength: function () {
                        bLengthCalled = true;
                        return Promise.resolve(2);
                    }
                }
            };

            mopidy.onWindAction(constants.Buttons.WindForwards).then(function () {
                assert(bIndexCalled);
                assert(bLengthCalled);
                assert(bNextCalled);
                assert(!bPreviousCalled);
                done();
            });
        });
        it('should do nothing if track is the last one', function (done) {
            var bNextCalled = false;
            var bPreviousCalled = false;
            var bIndexCalled = false;
            var bLengthCalled = false;
            mopidy.mopidy = {
                playback: {
                    next: function () {
                        bNextCalled = true;
                        return Promise.resolve();
                    },
                    previous: function () {
                        bPreviousCalled = true;
                        return Promise.resolve();
                    }
                },
                tracklist: {
                    index: function () {
                        bIndexCalled = true;
                        return Promise.resolve(0);
                    },
                    getLength: function () {
                        bLengthCalled = true;
                        return Promise.resolve(1);
                    }
                }
            };

            mopidy.onWindAction(constants.Buttons.WindForwards).then(function () {
                assert(bIndexCalled);
                assert(bLengthCalled);
                assert(!bNextCalled);
                assert(!bPreviousCalled);
                done();
            });
        });
        it('should play previous track if track index is greater than 0', function (done) {
            var bNextCalled = false;
            var bPreviousCalled = false;
            var bIndexCalled = false;
            mopidy.mopidy = {
                playback: {
                    next: function () {
                        bNextCalled = true;
                        return Promise.resolve();
                    },
                    previous: function () {
                        bPreviousCalled = true;
                        return Promise.resolve();
                    }
                },
                tracklist: {
                    index: function () {
                        bIndexCalled = true;
                        return Promise.resolve(1);
                    }
                }
            };

            mopidy.onWindAction(constants.Buttons.ReWind).then(function () {
                assert(!bNextCalled);
                assert(bIndexCalled);
                assert(bPreviousCalled);
                done();
            });
        });
        it('should play play the track from beginning if track index is 0', function (done) {
            var bNextCalled = false;
            var bPreviousCalled = false;
            var bStopCalled = false;
            var bPlayCalled = false;
            var bIndexCalled = false;
            mopidy.mopidy = {
                playback: {
                    next: function () {
                        bNextCalled = true;
                        return Promise.resolve();
                    },
                    previous: function () {
                        bPreviousCalled = true;
                        return Promise.resolve();
                    },
                    stop: function () {
                        bStopCalled = true;
                        return Promise.resolve();
                    },
                    play: function () {
                        bPlayCalled = true;
                        return Promise.resolve();
                    }
                },
                tracklist: {
                    index: function () {
                        bIndexCalled = true;
                        return Promise.resolve(0);
                    }
                }
            };

            mopidy.onWindAction(constants.Buttons.ReWind).then(function () {
                assert(!bNextCalled);
                assert(bIndexCalled);
                assert(!bPreviousCalled);
                assert(bStopCalled);
                assert(bPlayCalled);
                done();
            });
        });
        it('should not do anything if mopidy is not initialized', function (done) {
            mopidy.mopidy = null;

            mopidy.onWindAction(constants.Buttons.ReWind).then(function () {
                done();
            });
        });
    });

});