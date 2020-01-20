const winston = require('winston');

exports.getAccountInfo = function () {
    return {
        name: 'Youtube',
        enabled: false,
        configurable: false
    };
};

exports.saveAccount = function () {
    return Promise.reject('Cannot save account for youtube');
};

exports.deleteAccount = function () {
    winston.info('Cannot delete account for youtube');
};

exports.getItemForUri = function (sUri) {
    const aParts = sUri.split(':');

    return Promise.resolve(aParts[1]);
};