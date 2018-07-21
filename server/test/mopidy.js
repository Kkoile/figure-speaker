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
    });

    describe('start', function () {
        it('should start a mopidy process', function (done) {

            var oProcess = {
                stderr: {
                    on: function () {
                    }
                }
            };
            sandbox.stub(oProcess.stderr, 'on').yields('server running');
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
            sandbox.stub(oProcess.stderr, 'on').yields('server running');
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

    describe('onVolumeChange', function () {
        it('should increase the volume', function (done) {
            var oGetCurrentVolumeStub = sandbox.stub(settingsController, 'getCurrentVolume').resolves(70);
            var oMaxVolumeStub = sandbox.stub(settingsController, 'getMaxVolume').resolves(100);
            var iNewCurrentVolume;
            var oSetCurrentVolumeStub = sandbox.stub(settingsController, 'setCurrentVolume').callsFake(function(iCurrentVolumeToSet) {
                iNewCurrentVolume = iCurrentVolumeToSet;
            });
            var iCurrentVolumeToSet;
            mopidy.mopidy =  {
                playback: {
                    volume: function(iVolume) {
                        iCurrentVolumeToSet = iVolume;
                        return Promise.resolve();
                    }
                }
            };

            mopidy.onVolumeChange(constants.VolumeChange.Increase).then(function () {
                assert(iNewCurrentVolume === 70 + constants.VolumeChange.Interval);
                assert(iCurrentVolumeToSet === 70 + constants.VolumeChange.Interval);

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
            var oSetCurrentVolumeStub = sandbox.stub(settingsController, 'setCurrentVolume').callsFake(function(iCurrentVolumeToSet) {
                iNewCurrentVolume = iCurrentVolumeToSet;
            });
            var iCurrentVolumeToSet;
            mopidy.mopidy =  {
                playback: {
                    volume: function(iVolume) {
                        iCurrentVolumeToSet = iVolume;
                        return Promise.resolve();
                    }
                }
            };

            mopidy.onVolumeChange(constants.VolumeChange.Decrease).then(function () {
                assert(iNewCurrentVolume === 70 - constants.VolumeChange.Interval);
                assert(iCurrentVolumeToSet === 70 - constants.VolumeChange.Interval);

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
            mopidy.mopidy =  {
                playback: {
                    volume: function() {
                        assert(false);
                    }
                }
            };

            mopidy.onVolumeChange(constants.VolumeChange.Increase).then(function () {
                assert(oGetCurrentVolumeStub.calledOnce);
                assert(oMaxVolumeStub.calledOnce);
                assert(oSetCurrentVolumeStub.notCalled);
                done();
            });
        });
        it('should not decrease the volume', function (done) {
            var oGetCurrentVolumeStub = sandbox.stub(settingsController, 'getCurrentVolume').resolves(10);
            var oMaxVolumeStub = sandbox.stub(settingsController, 'getMaxVolume').resolves(100);
            var oSetCurrentVolumeStub = sandbox.stub(settingsController, 'setCurrentVolume');
            mopidy.mopidy =  {
                playback: {
                    volume: function() {
                        assert(false);
                    }
                }
            };

            mopidy.onVolumeChange(constants.VolumeChange.Decrease).then(function () {
                assert(oGetCurrentVolumeStub.calledOnce);
                assert(oMaxVolumeStub.calledOnce);
                assert(oSetCurrentVolumeStub.notCalled);
                done();
            });
        });
    });

});