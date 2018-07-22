var assert = require('assert');
var sinon = require('sinon');

var VolumeController = require('../lib/volumeController');

describe('VolumeController', function () {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('init', function () {
        it('should return if environment variables for GPIOs are not set', function (done) {
            function Gpio(iPin) {}
            Gpio.prototype.constructor = Gpio;
            VolumeController.Gpio = Gpio;

            delete process.env.GPIO_INCREASE_VOLUME_BUTTON;
            delete process.env.GPIO_DECREASE_VOLUME_BUTTON;
            VolumeController.increaseVolumeButton = undefined;
            VolumeController.decreaseVolumeButton = undefined;

            VolumeController.init();
            assert(VolumeController.increaseVolumeButton === undefined);
            assert(VolumeController.decreaseVolumeButton === undefined);
            done();
        });
        it('should return if one environment variable for GPIOs is not set', function (done) {
            function Gpio(iPin) {}
            Gpio.prototype.constructor = Gpio;
            VolumeController.Gpio = Gpio;

            delete process.env.GPIO_INCREASE_VOLUME_BUTTON;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 1;
            VolumeController.increaseVolumeButton = undefined;
            VolumeController.decreaseVolumeButton = undefined;

            VolumeController.init();
            assert(VolumeController.increaseVolumeButton === undefined);
            assert(VolumeController.decreaseVolumeButton === undefined);
            done();
        });
        it('should return if one environment variable for GPIOs is not set', function (done) {
            function Gpio(iPin) {}
            Gpio.prototype.constructor = Gpio;
            VolumeController.Gpio = Gpio;

            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            delete process.env.GPIO_DECREASE_VOLUME_BUTTON;
            VolumeController.increaseVolumeButton = undefined;
            VolumeController.decreaseVolumeButton = undefined;

            VolumeController.init();
            assert(VolumeController.increaseVolumeButton === undefined);
            assert(VolumeController.decreaseVolumeButton === undefined);
            done();
        });
        it('should initialize buttons if environment variables for GPIOs are set', function (done) {
            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 2;
            VolumeController.increaseVolumeButton = undefined;
            VolumeController.decreaseVolumeButton = undefined;

            var bIncreaseWatchCalled = false;
            var oIncreaseButton = {
                watch: function() {
                    bIncreaseWatchCalled = true;
                }
            };
            var bDecreaseWatchCalled = false;
            var oDecreaseButton = {
                watch: function() {
                    bDecreaseWatchCalled = true;
                }
            };
            function Gpio(iPin) {
                if (iPin == 1) {
                    return oIncreaseButton;
                }
                if (iPin == 2) {
                    return oDecreaseButton;
                }
            }
            Gpio.prototype.constructor = Gpio;
            VolumeController.Gpio = Gpio;

            VolumeController.init();
            assert(VolumeController.increaseVolumeButton === oIncreaseButton);
            assert(VolumeController.decreaseVolumeButton === oDecreaseButton);
            assert(bIncreaseWatchCalled);
            assert(bDecreaseWatchCalled);
            done();
        });
        it('should notify listeners if button is pressed', function (done) {
            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 2;
            VolumeController.increaseVolumeButton = undefined;
            VolumeController.decreaseVolumeButton = undefined;

            var fnIncreaseWatchCallback;
            var oIncreaseButton = {
                watch: function(fnCallback) {
                    fnIncreaseWatchCallback = fnCallback;
                }
            };
            var fnDecreaseWatchCallback;
            var oDecreaseButton = {
                watch: function(fnCallback) {
                    fnDecreaseWatchCallback = fnCallback;
                }
            };
            function Gpio(iPin) {
                if (iPin == 1) {
                    return oIncreaseButton;
                }
                if (iPin == 2) {
                    return oDecreaseButton;
                }
            }
            Gpio.prototype.constructor = Gpio;
            VolumeController.Gpio = Gpio;

            var oStub = sandbox.stub(VolumeController, '_notifyListeners');
            var oIncreaseNotifyListenersStub = oStub.withArgs("INCREASE");
            var oDecreaseNotifyListenersStub = oStub.withArgs("DECREASE");

            VolumeController.init();
            fnIncreaseWatchCallback(null, 1);
            assert(oIncreaseNotifyListenersStub.calledOnce);
            fnIncreaseWatchCallback(null, 0);
            assert(oIncreaseNotifyListenersStub.calledOnce);
            assert(oDecreaseNotifyListenersStub.notCalled);
            fnDecreaseWatchCallback(null, 1);
            assert(oIncreaseNotifyListenersStub.calledOnce);
            assert(oDecreaseNotifyListenersStub.calledOnce);
            fnDecreaseWatchCallback(null, 0);
            assert(oIncreaseNotifyListenersStub.calledOnce);
            assert(oDecreaseNotifyListenersStub.calledOnce);
            done();
        });
        it('should not notify listeners if an error occurred when pressing a button', function (done) {
            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 2;
            VolumeController.increaseVolumeButton = undefined;
            VolumeController.decreaseVolumeButton = undefined;

            var fnIncreaseWatchCallback;
            var oIncreaseButton = {
                watch: function(fnCallback) {
                    fnIncreaseWatchCallback = fnCallback;
                }
            };
            var fnDecreaseWatchCallback;
            var oDecreaseButton = {
                watch: function(fnCallback) {
                    fnDecreaseWatchCallback = fnCallback;
                }
            };
            function Gpio(iPin) {
                if (iPin == 1) {
                    return oIncreaseButton;
                }
                if (iPin == 2) {
                    return oDecreaseButton;
                }
            }
            Gpio.prototype.constructor = Gpio;
            VolumeController.Gpio = Gpio;

            var oStub = sandbox.stub(VolumeController, '_notifyListeners');
            var oIncreaseNotifyListenersStub = oStub.withArgs("INCREASE");
            var oDecreaseNotifyListenersStub = oStub.withArgs("DECREASE");

            VolumeController.init();
            fnIncreaseWatchCallback(new Error(), 1);
            assert(oIncreaseNotifyListenersStub.notCalled);
            fnIncreaseWatchCallback(null, 0);
            assert(oIncreaseNotifyListenersStub.notCalled);
            assert(oDecreaseNotifyListenersStub.notCalled);
            fnDecreaseWatchCallback(null, 1);
            assert(oIncreaseNotifyListenersStub.notCalled);
            assert(oDecreaseNotifyListenersStub.calledOnce);
            fnDecreaseWatchCallback(new Error(), 0);
            assert(oIncreaseNotifyListenersStub.notCalled);
            assert(oDecreaseNotifyListenersStub.calledOnce);
            done();
        });
    });

    describe('stop', function () {
        it('should unexport both buttons', function (done) {
            var bCalled1 = false;
            var oButton1 = {
                unexport: function() {
                    bCalled1 = true;
                }
            };
            VolumeController.increaseVolumeButton = oButton1;
            var bCalled2 = false;
            var oButton2 = {
                unexport: function() {
                    bCalled2 = true;
                }
            };
            VolumeController.decreaseVolumeButton = oButton2;

            VolumeController.stop();
            assert(bCalled1);
            assert(bCalled2);
            done();
        });
    });

    describe('listen', function () {
        it('should add a listener', function (done) {
            VolumeController.listeners = [];

            var oListener = {onVolumeChange: function() {}};
            VolumeController.listen(oListener);
            assert(VolumeController.listeners.length === 1);
            assert(VolumeController.listeners[0] === oListener);
            done();
        });
        it('should not add a listener if it does not implement onVolumeChange', function (done) {
            VolumeController.listeners = [];

            var oListener = {};
            VolumeController.listen(oListener);
            assert(VolumeController.listeners.length === 0);
            done();
        });
    });

    describe('_notifyListeners', function () {
        it('should notify no one if there are no listeners', function (done) {
            VolumeController.listeners = [];

            VolumeController._notifyListeners("INCREASE");
            assert(true);
            done();
        });
        it('should notify all listeners', function (done) {
            var bCalled = false;
            var sVolumeChange;
            var oListener = {
                onVolumeChange: function(sVolumeChangeToSet) {
                    bCalled = true;
                    sVolumeChange = sVolumeChangeToSet;
                }
            };
            VolumeController.listeners = [oListener];

            VolumeController._notifyListeners("INCREASE");
            assert(bCalled);
            assert(sVolumeChange === "INCREASE");
            done();
        });
        it('should notify notify the second listener, even if the first one failed', function (done) {
            var oListener1 = {
                onVolumeChange: function() {
                    throw Error();
                }
            };
            var bCalled2 = false;
            var sVolumeChange2;
            var oListener2 = {
                onVolumeChange: function(sVolumeChangeToSet) {
                    bCalled2 = true;
                    sVolumeChange2 = sVolumeChangeToSet;
                }
            };
            VolumeController.listeners = [oListener1, oListener2];

            VolumeController._notifyListeners("INCREASE");
            assert(bCalled2);
            assert(sVolumeChange2 === "INCREASE");
            done();
        });
    });

});