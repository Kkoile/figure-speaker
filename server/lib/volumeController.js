var winston = require('winston');
var constants = require('./constants');
var onoff;
try {
    onoff = require('onoff');
} catch (oError) {
    winston.error("Dependency onoff could not be required. Perhaps you do not run on raspberry?");
}
var Gpio;
if (onoff) {
    Gpio = onoff.Gpio;
};

var increaseVolumeButton;
var decreaseVolumeButton;

var aListeners = [];

function _notifyListeners(sVolumeChange) {
    aListeners.forEach(function(oListener) {
        try {
            oListener.onVolumeChange(sVolumeChange);
        } catch (oError) {
            console.error("Could not notify listener for volume change", oError);
        }
    });
}

exports.init = function () {
    if (!Gpio) {
        winston.warn("Did not find dependency for connecting to GPIO. Perhaps you do not run on raspberry?");
        return;
    }

    var increaseVolumeButtonGPIO = process.env.GPIO_INCREASE_VOLUME_BUTTON;
    var decreaseVolumeButtonGPIO = process.env.GPIO_DECREASE_VOLUME_BUTTON;

    if (!increaseVolumeButtonGPIO || !decreaseVolumeButtonGPIO) {
        winston.error("Could not initialize Volume Controller, because environment variables for GPIOs for buttons are not set.");
        winston.error("Set GPIO_INCREASE_VOLUME_BUTTON and GPIO_DECREASE_VOLUME_BUTTON to their GPIO pin number.");
    }

    increaseVolumeButton = new Gpio(increaseVolumeButtonGPIO, 'in', 'both');
    decreaseVolumeButton = new Gpio(decreaseVolumeButtonGPIO, 'in', 'both');

    increaseVolumeButton.watch(function (err, value) {
        if (err) {
            console.error('There was an error while watching increase volume button ', err);
            return;
        }
        _notifyListeners(constants.VolumeChange.Increase);
    });

    decreaseVolumeButton.watch(function (err, value) {
        if (err) {
            console.error('There was an error while watching decrease volume button ', err);
            return;
        }
        _notifyListeners(constants.VolumeChange.Decrease);
    });
};

exports.stop = function() {
  increaseVolumeButton && increaseVolumeButton.unexport();
  decreaseVolumeButton && decreaseVolumeButton.unexport();
};

exports.listen = function (oListener) {
    aListeners.push(oListener);
};
