var winston = require('winston');
var constants = require('./constants');
var onoff;
try {
    onoff = require('onoff');
} catch (oError) {
    winston.error("Dependency onoff could not be required. Perhaps you do not run on raspberry?");
}
exports.Gpio = undefined;
if (onoff) {
    this.Gpio = onoff.Gpio;
}

exports.increaseVolumeButton = undefined;
exports._increaseVolumeButtonPressed = false;
exports._increaseVolumeButtonPressedSince = null;
exports.decreaseVolumeButton = undefined;
exports._decreaseVolumeButtonPressed = false;
exports._decreaseVolumeButtonPressedSince = null;

exports.listeners = [];

exports._notifyListenersOnVolumeChange = function(sVolumeChange) {
    this.listeners.forEach(function(oListener) {
        try {
            oListener.onVolumeChange && oListener.onVolumeChange(sVolumeChange);
        } catch (oError) {
            winston.error("Could not notify listener for volume change", oError);
        }
    });
};

exports._notifyListenersOnWindAction = function(sWindAction) {
    this.listeners.forEach(function(oListener) {
        try {
            oListener.onWindAction && oListener.onWindAction(sWindAction);
        } catch (oError) {
            winston.error("Could not notify listener for wind action", oError);
        }
    });
};

exports.init = function () {
    if (!this.Gpio) {
        winston.warn("Did not find dependency for connecting to GPIO. Perhaps you do not run on raspberry?");
        return;
    }

    var increaseVolumeButtonGPIO = process.env.GPIO_INCREASE_VOLUME_BUTTON;
    var decreaseVolumeButtonGPIO = process.env.GPIO_DECREASE_VOLUME_BUTTON;

    if (!increaseVolumeButtonGPIO || !decreaseVolumeButtonGPIO) {
        winston.error("Could not initialize Volume Controller, because environment variables for GPIOs for buttons are not set.");
        winston.error("Set GPIO_INCREASE_VOLUME_BUTTON and GPIO_DECREASE_VOLUME_BUTTON to their GPIO pin number.");
        return;
    }

    this.increaseVolumeButton = new this.Gpio(increaseVolumeButtonGPIO, 'in', 'both');
    this.decreaseVolumeButton = new this.Gpio(decreaseVolumeButtonGPIO, 'in', 'both');

    this.increaseVolumeButton.watch(function (err, iValue) {
        if (err) {
            winston.error('There was an error while watching increase volume button ', err);
            return;
        }
        if (iValue === constants.Buttons.Push) {
            this._increaseVolumeButtonPressed = true;
            this._increaseVolumeButtonPressedSince = new Date().getTime();
        }
        if (iValue === constants.Buttons.Release && !!this._increaseVolumeButtonPressed) {
            this._increaseVolumeButtonPressed = false;
            if (new Date().getTime() - this._increaseVolumeButtonPressedSince >= constants.Buttons.WindInterval) {
                this._notifyListenersOnWindAction(constants.Buttons.WindForwards);
            } else {
                this._notifyListenersOnVolumeChange(constants.Buttons.Increase);
            }
            this._increaseVolumeButtonPressedSince = null;
        }
    }.bind(this));

    this.decreaseVolumeButton.watch(function (err, iValue) {
        if (err) {
            winston.error('There was an error while watching decrease volume button ', err);
            return;
        }
        if (iValue === constants.Buttons.Push) {
            this._decreaseVolumeButtonPressed = true;
            this._decreaseVolumeButtonPressedSince = new Date().getTime();
        }
        if (iValue === constants.Buttons.Release && !!this._decreaseVolumeButtonPressed) {
            this._decreaseVolumeButtonPressed = false;
            if (new Date().getTime() - this._decreaseVolumeButtonPressedSince >= constants.Buttons.WindInterval) {
                this._notifyListenersOnWindAction(constants.Buttons.ReWind);
            } else {
                this._notifyListenersOnVolumeChange(constants.Buttons.Decrease);
            }
            this._decreaseVolumeButtonPressedSince = null;
        }
    }.bind(this));
};

exports.stop = function() {
    this.increaseVolumeButton && this.increaseVolumeButton.unexport();
    this.decreaseVolumeButton && this.decreaseVolumeButton.unexport();
};

exports.listen = function (oListener) {
    if (!oListener.onVolumeChange && !oListener.onWindAction) {
        winston.error("Could not add volume listener, because it does not implement `onVolumeChange` or `onWindAction` method");
        return;
    }
    this.listeners.push(oListener);
};
