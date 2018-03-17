var mfrc522 = require('mfrc522-rpi');
mfrc522.initWiringPi(0);

var aListeners = [];
var sCard = null;
var iSameActivityCounter = 0;

setInterval(function(){
    mfrc522.reset();
    var response = mfrc522.findCard();
    if (!response.status) {
        if (sCard && iSameActivityCounter > 5) {
	    console.log("Card removed");
	    sCard = null;
	    iSameActivityCounter = 0;
	    aListeners.forEach(function (oListener) {
                oListener.onCardRemoved && oListener.onCardRemoved.call(oListener);
            });
	}
	iSameActivityCounter++;
        return;
    }
    if (sCard) {
        return;
    }
    response = mfrc522.getUid();
    if (!response.status) {
        console.log("UID Scan Error");
        return;
    }
    const uid = response.data;
    sCard = uid[0].toString(16) + uid[1].toString(16) + uid[2].toString(16) + uid[3].toString(16);
    console.log("Card detected: ", sCard);
    aListeners.forEach(function (oListener) {
        oListener.onNewCardDetected && oListener.onNewCardDetected.call(oListener, sCard);
    });

}.bind(this), 500);

exports.isCardDetected = function () {
    return !!sCard;
};

exports.getCardId = function () {
    return sCard;
};

exports.listenForScan = function (oListener) {
    aListeners.push(oListener);
};
