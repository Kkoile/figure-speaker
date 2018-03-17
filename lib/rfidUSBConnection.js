var pcsc = require('nfc-pcsc');
var NFC = pcsc.NFC;
var nfc;

var aListeners = [];
var oReader = null;
var oCard = null;

exports.init = function () {
    nfc = new NFC();

    nfc.on('reader', function (oNewReader) {
        oReader = oNewReader;
        oReader.autoProcessing = true;

        console.log(oReader.reader.name + 'device attached');

        oReader.on('card', function (oNewCard) {
            oCard = oNewCard;
            console.log(oReader.reader.name + ' card detected', oCard.uid);

            aListeners.forEach(function (oListener) {
                oListener.onNewCardDetected && oListener.onNewCardDetected.call(oListener, oCard.uid);
            });
        });

        oReader.on('card.off', function (oRemovedCard) {
            console.log(oReader.reader.name + ' card removed', oRemovedCard.uid);
            oCard = null;

            aListeners.forEach(function (oListener) {
                oListener.onCardRemoved && oListener.onCardRemoved.call(oListener);
            });
        });

        oReader.on('error', function (err) {
            console.log(oReader.reader.name + ' an error occurred', err);
        });

        oReader.on('end', function () {
            console.log(oReader.reader.name + ' device removed');
            oReader = null;
        });

    });

    nfc.on('error', function (err) {
        console.log('an error occurred', err);
    });
    return this;
};

exports.stop = function () {
    nfc && nfc.close();
};

exports.isCardDetected = function () {
    return !!oCard;
};

exports.getCardId = function () {
    return oCard.uid;
};

exports.listenForScan = function (oListener) {
    aListeners.push(oListener);
};