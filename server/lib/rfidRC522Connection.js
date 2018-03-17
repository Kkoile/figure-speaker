var mfrc522 = require('mfrc522-rpi');
mfrc522.initWiringPi(0);

var aListeners = [];
var sCard = null;
var iInactivityCounter = 0;
var sIntervalId = null;

exports.init = function () {
    sIntervalId = setInterval(function () {
        mfrc522.reset();
        var response = mfrc522.findCard();
        if (!response.status) {
            iInactivityCounter++;
            if (sCard && iInactivityCounter > 4) {
                console.log("Card removed");
                sCard = null;
                iInactivityCounter = 0;
                aListeners.forEach(function (oListener) {
                    try {

                        oListener.onCardRemoved && oListener.onCardRemoved.call(oListener);
                    } catch (err) {
                        console.error("Error while informing listener.", err);
                    }
                });
            }
            return;
        }
        response = mfrc522.getUid();
        if (!response.status) {
            console.log("UID Scan Error");
            return;
        }
        var uid = response.data;
        var sId = uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16) + uid[3].toString(16);
        if (sId === sCard) {
            return;
        }
        sCard = sId;
        console.log("Card detected: ", sCard);
        aListeners.forEach(function (oListener) {
            try {
                oListener.onNewCardDetected && oListener.onNewCardDetected.call(oListener, sCard);
            } catch (err) {
                console.error("Error while informing listener.", err);
            }
        });

    }.bind(this), 500);
};

exports.stop = function () {
    clearInterval(sIntervalId);
};

exports.isCardDetected = function () {
    return !!sCard;
};

exports.getCardId = function () {
    return sCard;
};

exports.listenForScan = function (oListener) {
    aListeners.push(oListener);
};
