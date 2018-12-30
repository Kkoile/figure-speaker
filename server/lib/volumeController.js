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

exports._notifyListeners = function(sVolumeChange) {
    this.listeners.forEach(function(oListener) {
        try {
            oListener.onVolumeChange(sVolumeChange);
        } catch (oError) {
            winston.error("Could not notify listener for volume change", oError);
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
        if (iValue === constants.VolumeChange.Push) {
            this._increaseVolumeButtonPressed = true;
            this._increaseVolumeButtonPressedSince = new Date().getTime();
        }
        if (iValue === constants.VolumeChange.Release && !!this._increaseVolumeButtonPressed) {
            this._increaseVolumeButtonPressed = false;
            if (new Date().getTime() - this._increaseVolumeButtonPressedSince >= constants.VolumeChange.WindInterval) {
                this._notifyListeners(constants.VolumeChange.WindForwards);
            } else {
                this._notifyListeners(constants.VolumeChange.Increase);
            }
            this._increaseVolumeButtonPressedSince = null;
        }
    }.bind(this));

    this.decreaseVolumeButton.watch(function (err, iValue) {
        if (err) {
            winston.error('There was an error while watching decrease volume button ', err);
            return;
        }
        if (iValue === constants.VolumeChange.Push) {
            this._decreaseVolumeButtonPressed = true;
            this._decreaseVolumeButtonPressedSince = new Date().getTime();
        }
        if (iValue === constants.VolumeChange.Release && !!this._decreaseVolumeButtonPressed) {
            this._decreaseVolumeButtonPressed = false;
            if (new Date().getTime() - this._decreaseVolumeButtonPressedSince >= constants.VolumeChange.WindInterval) {
                this._notifyListeners(constants.VolumeChange.ReWind);
            } else {
                this._notifyListeners(constants.VolumeChange.Decrease);
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
    if (!oListener.onVolumeChange) {
        winston.error("Could not add volume listener, because it does not implement `onVolumeChange` method");
        return;
    }
    this.listeners.push(oListener);
};
