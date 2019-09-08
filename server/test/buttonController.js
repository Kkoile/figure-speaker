var assert = require('assert');
var sinon = require('sinon');

var constants = require('../lib/constants');

var ButtonController = require('../lib/buttonController');

describe('ButtonController', function () {

    var sandbox;
    var iActualWindInterval = constants.Buttons.WindInterval;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        constants.Buttons.WindInterval = 10;
    });

    afterEach(function () {
        sandbox.restore();
        constants.Buttons.WindInterval = iActualWindInterval;
    });

    describe('init', function () {
        it('should return if environment variables for GPIOs are not set', function (done) {
            function Gpio(iPin) {}
            Gpio.prototype.constructor = Gpio;
            ButtonController.Gpio = Gpio;

            delete process.env.GPIO_INCREASE_VOLUME_BUTTON;
            delete process.env.GPIO_DECREASE_VOLUME_BUTTON;
            ButtonController.increaseVolumeButton = undefined;
            ButtonController._increaseVolumeButtonPressed = false;
            ButtonController._increaseVolumeButtonPressedSince = null;
            ButtonController.decreaseVolumeButton = undefined;
            ButtonController._decreaseVolumeButtonPressed = false;
            ButtonController._decreaseVolumeButtonPressedSince = null;

            ButtonController.init();
            assert(ButtonController.increaseVolumeButton === undefined);
            assert(ButtonController.decreaseVolumeButton === undefined);
            done();
        });
        it('should return if one environment variable for GPIOs is not set', function (done) {
            function Gpio(iPin) {}
            Gpio.prototype.constructor = Gpio;
            ButtonController.Gpio = Gpio;

            delete process.env.GPIO_INCREASE_VOLUME_BUTTON;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 1;
            ButtonController.increaseVolumeButton = undefined;
            ButtonController._increaseVolumeButtonPressed = false;
            ButtonController._increaseVolumeButtonPressedSince = null;
            ButtonController.decreaseVolumeButton = undefined;
            ButtonController._decreaseVolumeButtonPressed = false;
            ButtonController._decreaseVolumeButtonPressedSince = null;

            ButtonController.init();
            assert(ButtonController.increaseVolumeButton === undefined);
            assert(ButtonController.decreaseVolumeButton === undefined);
            done();
        });
        it('should return if one environment variable for GPIOs is not set', function (done) {
            function Gpio(iPin) {}
            Gpio.prototype.constructor = Gpio;
            ButtonController.Gpio = Gpio;

            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            delete process.env.GPIO_DECREASE_VOLUME_BUTTON;
            ButtonController.increaseVolumeButton = undefined;
            ButtonController._increaseVolumeButtonPressed = false;
            ButtonController._increaseVolumeButtonPressedSince = null;
            ButtonController.decreaseVolumeButton = undefined;
            ButtonController._decreaseVolumeButtonPressed = false;
            ButtonController._decreaseVolumeButtonPressedSince = null;

            ButtonController.init();
            assert(ButtonController.increaseVolumeButton === undefined);
            assert(ButtonController.decreaseVolumeButton === undefined);
            done();
        });
        it('should initialize buttons if environment variables for GPIOs are set', function (done) {
            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 2;
            ButtonController.increaseVolumeButton = undefined;
            ButtonController._increaseVolumeButtonPressed = false;
            ButtonController._increaseVolumeButtonPressedSince = null;
            ButtonController.decreaseVolumeButton = undefined;
            ButtonController._decreaseVolumeButtonPressed = false;
            ButtonController._decreaseVolumeButtonPressedSince = null;

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
            ButtonController.Gpio = Gpio;

            ButtonController.init();
            assert(ButtonController.increaseVolumeButton === oIncreaseButton);
            assert(ButtonController.decreaseVolumeButton === oDecreaseButton);
            assert(bIncreaseWatchCalled);
            assert(bDecreaseWatchCalled);
            done();
        });
        it('should notify listeners if button is pressed', function (done) {
            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 2;
            ButtonController.increaseVolumeButton = undefined;
            ButtonController._increaseVolumeButtonPressed = false;
            ButtonController._increaseVolumeButtonPressedSince = null;
            ButtonController.decreaseVolumeButton = undefined;
            ButtonController._decreaseVolumeButtonPressed = false;
            ButtonController._decreaseVolumeButtonPressedSince = null;

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
            ButtonController.Gpio = Gpio;

            var oStub = sandbox.stub(ButtonController, '_notifyListenersOnVolumeChange');
            var oIncreaseNotifyListenersStub = oStub.withArgs("INCREASE");
            var oDecreaseNotifyListenersStub = oStub.withArgs("DECREASE");

            ButtonController.init();
            fnIncreaseWatchCallback(null, 1);
            assert(oIncreaseNotifyListenersStub.notCalled);
            fnIncreaseWatchCallback(null, 0);
            assert(oIncreaseNotifyListenersStub.calledOnce);
            assert(oDecreaseNotifyListenersStub.notCalled);
            fnDecreaseWatchCallback(null, 1);
            assert(oIncreaseNotifyListenersStub.calledOnce);
            assert(oDecreaseNotifyListenersStub.notCalled);
            fnDecreaseWatchCallback(null, 0);
            assert(oIncreaseNotifyListenersStub.calledOnce);
            assert(oDecreaseNotifyListenersStub.calledOnce);
            done();
        });
        it('should not notify listeners if an error occurred when pressing a button', function (done) {
            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 2;
            ButtonController.increaseVolumeButton = undefined;
            ButtonController._increaseVolumeButtonPressed = false;
            ButtonController._increaseVolumeButtonPressedSince = null;
            ButtonController.decreaseVolumeButton = undefined;
            ButtonController._decreaseVolumeButtonPressed = false;
            ButtonController._decreaseVolumeButtonPressedSince = null;

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
            ButtonController.Gpio = Gpio;

            var oStub = sandbox.stub(ButtonController, '_notifyListenersOnVolumeChange');
            var oIncreaseNotifyListenersStub = oStub.withArgs("INCREASE");
            var oDecreaseNotifyListenersStub = oStub.withArgs("DECREASE");

            ButtonController.init();
            fnIncreaseWatchCallback(new Error(), 1);
            assert(oIncreaseNotifyListenersStub.notCalled);
            fnIncreaseWatchCallback(null, 0);
            assert(oIncreaseNotifyListenersStub.notCalled);
            assert(oDecreaseNotifyListenersStub.notCalled);
            fnDecreaseWatchCallback(null, 1);
            assert(oIncreaseNotifyListenersStub.notCalled);
            assert(oDecreaseNotifyListenersStub.notCalled);
            fnDecreaseWatchCallback(new Error(), 0);
            assert(oIncreaseNotifyListenersStub.notCalled);
            assert(oDecreaseNotifyListenersStub.notCalled);
            done();
        });
        it('should notify listeners for wind action if button is pressed long enough', function (done) {
            process.env.GPIO_INCREASE_VOLUME_BUTTON = 1;
            process.env.GPIO_DECREASE_VOLUME_BUTTON = 2;
            ButtonController.increaseVolumeButton = undefined;
            ButtonController._increaseVolumeButtonPressed = false;
            ButtonController._increaseVolumeButtonPressedSince = null;
            ButtonController.decreaseVolumeButton = undefined;
            ButtonController._decreaseVolumeButtonPressed = false;
            ButtonController._decreaseVolumeButtonPressedSince = null;

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
            ButtonController.Gpio = Gpio;

            var oWindStub = sandbox.stub(ButtonController, '_notifyListenersOnWindAction');
            var oWindForwardsNotifyListenersStub = oWindStub.withArgs("WIND_FORWARDS");
            var oRewindNotifyListenersStub = oWindStub.withArgs("REWIND");
            var oVolumeChangeStub = sandbox.stub(ButtonController, '_notifyListenersOnVolumeChange');
            var oIncreaseNotifyListenersStub = oVolumeChangeStub.withArgs("INCREASE");
            var oDecreaseNotifyListenersStub = oVolumeChangeStub.withArgs("DECREASE");

            ButtonController.init();
            fnIncreaseWatchCallback(null, 1);
            setTimeout(function() {
                fnIncreaseWatchCallback(null, 0);
                assert(oWindForwardsNotifyListenersStub.calledOnce);
                assert(oIncreaseNotifyListenersStub.notCalled);
                assert(oRewindNotifyListenersStub.notCalled);
                assert(oDecreaseNotifyListenersStub.notCalled);

                fnIncreaseWatchCallback(null, 1);
                setTimeout(function() {
                    fnIncreaseWatchCallback(null, 0);
                    assert(oWindForwardsNotifyListenersStub.calledTwice);
                    assert(oIncreaseNotifyListenersStub.notCalled);
                    assert(oRewindNotifyListenersStub.notCalled);
                    assert(oDecreaseNotifyListenersStub.notCalled);

                    fnDecreaseWatchCallback(null, 1);
                    setTimeout(function() {
                        fnDecreaseWatchCallback(null, 0);
                        assert(oWindForwardsNotifyListenersStub.calledTwice);
                        assert(oIncreaseNotifyListenersStub.notCalled);
                        assert(oRewindNotifyListenersStub.calledOnce);
                        assert(oDecreaseNotifyListenersStub.notCalled);

                        fnDecreaseWatchCallback(null, 1);
                        setTimeout(function() {
                            fnDecreaseWatchCallback(null, 0);
                            assert(oWindForwardsNotifyListenersStub.calledTwice);
                            assert(oIncreaseNotifyListenersStub.notCalled);
                            assert(oRewindNotifyListenersStub.calledTwice);
                            assert(oDecreaseNotifyListenersStub.notCalled);

                            fnIncreaseWatchCallback(null, 1);
                            setTimeout(function() {
                                fnIncreaseWatchCallback(null, 0);
                                assert(oWindForwardsNotifyListenersStub.calledTwice);
                                assert(oIncreaseNotifyListenersStub.calledOnce);
                                assert(oRewindNotifyListenersStub.calledTwice);
                                assert(oDecreaseNotifyListenersStub.notCalled);

                                fnDecreaseWatchCallback(null, 1);
                                setTimeout(function() {
                                    fnDecreaseWatchCallback(null, 0);
                                    assert(oWindForwardsNotifyListenersStub.calledTwice);
                                    assert(oIncreaseNotifyListenersStub.calledOnce);
                                    assert(oRewindNotifyListenersStub.calledTwice);
                                    assert(oDecreaseNotifyListenersStub.calledOnce);
                                    done();
                                }, constants.Buttons.WindInterval - 5);
                            }, constants.Buttons.WindInterval - 5);
                        }, constants.Buttons.WindInterval + 1);
                    }, constants.Buttons.WindInterval);
                }, constants.Buttons.WindInterval + 1);
            }, constants.Buttons.WindInterval);
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
            ButtonController.increaseVolumeButton = oButton1;
            var bCalled2 = false;
            var oButton2 = {
                unexport: function() {
                    bCalled2 = true;
                }
            };
            ButtonController.decreaseVolumeButton = oButton2;

            ButtonController.stop();
            assert(bCalled1);
            assert(bCalled2);
            done();
        });
    });

    describe('listen', function () {
        it('should add a listener', function (done) {
            ButtonController.listeners = [];

            var oListener = {onVolumeChange: function() {}, onWindAction: function() {}};
            ButtonController.listen(oListener);
            assert(ButtonController.listeners.length === 1);
            assert(ButtonController.listeners[0] === oListener);
            done();
        });
        it('should add a listener if it does implement onVolumeChange but not onWindAction', function (done) {
            ButtonController.listeners = [];

            var oListener = {onVolumeChange: function() {}};
            ButtonController.listen(oListener);
            assert(ButtonController.listeners.length === 1);
            assert(ButtonController.listeners[0] === oListener);
            done();
        });
        it('should add a listener if it does not implement onVolumeChange but onWindAction', function (done) {
            ButtonController.listeners = [];

            var oListener = {onWindAction: function() {}};
            ButtonController.listen(oListener);
            assert(ButtonController.listeners.length === 1);
            assert(ButtonController.listeners[0] === oListener);
            done();
        });
        it('should not add a listener if it does not implement onVolumeChange or onWindAction', function (done) {
            ButtonController.listeners = [];

            var oListener = {};
            ButtonController.listen(oListener);
            assert(ButtonController.listeners.length === 0);
            done();
        });
    });

    describe('_notifyListenersOnVolumeChange', function () {
        it('should notify no one if there are no listeners', function (done) {
            ButtonController.listeners = [];

            ButtonController._notifyListenersOnVolumeChange("INCREASE");
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
            ButtonController.listeners = [oListener];

            ButtonController._notifyListenersOnVolumeChange("INCREASE");
            assert(bCalled);
            assert(sVolumeChange === "INCREASE");
            done();
        });
        it('should notify the second listener, even if the first one failed', function (done) {
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
            ButtonController.listeners = [oListener1, oListener2];

            ButtonController._notifyListenersOnVolumeChange("INCREASE");
            assert(bCalled2);
            assert(sVolumeChange2 === "INCREASE");
            done();
        });
    });

    describe('_notifyListenersOnWindAction', function () {
        it('should notify no one if there are no listeners', function (done) {
            ButtonController.listeners = [];

            ButtonController._notifyListenersOnWindAction("WIND_FORWARDS").then(function() {
                assert(true);
                done();
            });
        });
        it('should notify all listeners', function (done) {
            var bCalled = false;
            var sWindAction;
            var oListener = {
                onWindAction: function(sWindActionToSet) {
                    bCalled = true;
                    sWindAction = sWindActionToSet;
                    return Promise.resolve();
                }
            };
            ButtonController.listeners = [oListener];

            ButtonController._notifyListenersOnWindAction("WIND_FORWARDS").then(function () {
                assert(bCalled);
                assert(sWindAction === "WIND_FORWARDS");
                done();
            });
        });
        it('should notify the second listener, even if the first one failed', function (done) {
            var oListener1 = {
                onWindAction: function() {
                    return Promise.reject();
                }
            };
            var bCalled2 = false;
            var sWindAction2;
            var oListener2 = {
                onWindAction: function(sWindActionToSet) {
                    bCalled2 = true;
                    sWindAction2 = sWindActionToSet;
                    return Promise.resolve();
                }
            };
            ButtonController.listeners = [oListener1, oListener2];

            ButtonController._notifyListenersOnWindAction("WIND_FORWARDS").then(function () {
                assert(bCalled2);
                assert(sWindAction2 === "WIND_FORWARDS");
                done();
            });
        });
    });

});
