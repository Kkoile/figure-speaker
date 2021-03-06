const mfrc522 = require('mfrc522-rpi');
mfrc522.initWiringPi(0);

const aListeners = [];
let sCard = null;
let iInactivityCounter = 0;
let sIntervalId = null;

exports.init = function () {
    sIntervalId = setInterval(function () {
        mfrc522.reset();
        let response = mfrc522.findCard();
        if (!response.status) {
            iInactivityCounter++;
            if (sCard && iInactivityCounter > 4) {
                console.log('Card removed');
                sCard = null;
                aListeners.forEach(function (oListener) {
                    try {
                        oListener.onCardRemoved && oListener.onCardRemoved.call(oListener);
                    } catch (err) {
                        console.error('Error while informing listener.', err);
                    }
                });
            }
            return;
        }
        iInactivityCounter = 0;
        response = mfrc522.getUid();
        if (!response.status) {
            console.log('UID Scan Error');
            return;
        }
        const uid = response.data;
        const sId = uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16) + uid[3].toString(16);
        if (sId === sCard) {
            return;
        }
        sCard = sId;
        console.log('Card detected: ', sCard);
        aListeners.forEach(function (oListener) {
            try {
                oListener.onNewCardDetected && oListener.onNewCardDetected.call(oListener, sCard);
            } catch (err) {
                console.error('Error while informing listener.', err);
            }
        });

    }.bind(this), 100);
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
