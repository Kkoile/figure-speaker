var ApplicationError = require('./ApplicationError.js');
var winston = require('winston');
var aSupportedAdapters = ['./rfidRC522Connection', './rfidUSBConnection'];

var oConnection = aSupportedAdapters.map(function (sAdapter) {
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
    });

if (!oConnection) {
    throw new ApplicationError('Could not establish an RFID connection, because no npm module is installed for any supported device.');
}
module.exports = oConnection;