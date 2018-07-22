var ApplicationError = require('./ApplicationError.js');
var winston = require('winston');
var aSupportedAdapters = ['./rfidRC522Connection', './rfidUSBConnection'];

var oConnection = {
    DUMMY_CONNECTION: true,
    init: function () {},
    stop: function(){},
    isCardDetected: function(){},
    getCardId: function(){},
    listenForScan: function(){}
};
oConnection = aSupportedAdapters.map(function (sAdapter) {
    try {
        oConnection = require(sAdapter);
        winston.debug('Found an adapter for the following connection: ' + sAdapter);
        return oConnection;
    } catch (e) {
        winston.debug('No NPM Module for the following adapter installed: ' + sAdapter);
        return null;
    }
})
    .find(function (oAdapter) {
        return !!oAdapter;
    }) ||oConnection;

if (oConnection.DUMMY_CONNECTION && process.env.NODE_ENV === 'production') {
    throw new ApplicationError('Could not establish an RFID connection, because no npm module is installed for any supported device.');
}
module.exports = oConnection;