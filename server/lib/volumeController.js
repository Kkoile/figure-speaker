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
exports.decreaseVolumeButton = undefined;

exports.listeners = [];

exports._notifyListeners = function(sVolumeChange) {
    this.listeners.forEach(function(oListener) {
        try {
            oListener.onVolumeChange(sVolumeChange);
        } catch (oError) {
            console.error("Could not notify listener for volume change", oError);
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
            console.error('There was an error while watching increase volume button ', err);
            return;
        }
        if (iValue === constants.VolumeChange.Push) {
            this._notifyListeners(constants.VolumeChange.Increase);
        }
    }.bind(this));

    this.decreaseVolumeButton.watch(function (err, iValue) {
        if (err) {
            console.error('There was an error while watching decrease volume button ', err);
            return;
        }
        if (iValue === constants.VolumeChange.Push) {
            this._notifyListeners(constants.VolumeChange.Decrease);
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
