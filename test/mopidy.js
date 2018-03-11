var assert = require('assert');
var sinon = require('sinon');

var child_process = require('child_process');

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

});