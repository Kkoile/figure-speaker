const winston = require('winston');
const constants = require('./constants.js');
const mopidy = require('./mopidy.js');
const ApplicationError = require('./ApplicationError.js');
const fs = require('fs');

exports.getAccountInfo = function () {
    return {
        name: 'MP3',
        enabled: true,
        configurable: false
    };
};

exports.saveAccount = function () {
    return Promise.reject('Cannot save credentials for mp3');
};

exports.deleteAccount = function () {
    winston.info('Cannot delete account for mp3');
};

exports.getItemForUri = function (sUri) {
    return Promise.resolve(sUri);
};

exports.getAvailableFileNames = function () {
    return new Promise( function(resolve, reject) {
        fs.readdir(constants.Data.PathToMp3Files, function (oErr, aFiles) {
            if (oErr) {
                return reject(oErr);
            }
            resolve(aFiles);
        });
    });
};

exports.upload = function (oFile) {
    return new Promise(function (resolve, reject) {
        if (!oFile) {
            return reject(new ApplicationError(400, 'No File provided'));
        }
        if (!fs.existsSync(constants.Data.PathToGeneralConfig)){
            fs.mkdirSync(constants.Data.PathToGeneralConfig);
        }
        if (!fs.existsSync(constants.Data.PathToAppConfig)){
            fs.mkdirSync(constants.Data.PathToAppConfig);
        }
        if (!fs.existsSync(constants.Data.PathToMp3Files)){
            fs.mkdirSync(constants.Data.PathToMp3Files);
        }
        oFile.mv(constants.Data.PathToMp3Files + '/' + oFile.name, function(err) {
            if (err){
                return reject(err);
            }
            resolve();
        });
    })
        .then(mopidy.scanMp3Files.bind(mopidy))
        .then(mopidy.restart.bind(mopidy));
};

exports.deleteFile = function (sFilename) {
    return new Promise(function (resolve, reject) {
        if (!sFilename) {
            return reject(new ApplicationError(400, 'No File provided'));
        }
        fs.unlink(constants.Data.PathToMp3Files + '/' + sFilename, function(oError) {
            if (oError) {
                return reject(oError);
            }
            resolve();
        });
    });
};