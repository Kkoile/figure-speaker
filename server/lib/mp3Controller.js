'use strict';

var winston = require('winston');
var constants = require('./constants.js');
var ApplicationError = require('./ApplicationError.js');
var fs = require('fs');

exports.getAccountInfo = function () {
    return {
        name: 'MP3',
        enabled: true,
        configurable: false
    };
};

exports.saveAccount = function (oAccount) {
    return Promise.reject("Cannot save credentials for mp3");
};

exports.deleteAccount = function () {
    winston.info("Cannot delete account for mp3");
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
            return reject(new ApplicationError(400, "No File provided"));
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
    });
};