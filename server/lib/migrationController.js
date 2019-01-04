'use strict';

var fs = require('fs');
var ini = require('ini');
var constants = require('./constants.js');
var settingsController = require('./settingsController');

exports.moveSpotifyCountryConfigFromMopidyToGeneralConfig = function () {
    try {
        var oMopidyConfig = ini.parse(fs.readFileSync(constants.Mopidy.PathToConfig, 'utf-8'));
        if (oMopidyConfig.spotify && oMopidyConfig.spotify.country) {
            var sCountry = oMopidyConfig.spotify.country;
            delete oMopidyConfig.spotify.country;
            fs.writeFileSync(constants.Mopidy.PathToConfig, ini.stringify(oMopidyConfig, {whitespace: true}));

            var oConfig = settingsController.getConfigFile();
            if (!oConfig.general.spotify_country) {
                oConfig.general.spotify_country = sCountry;
                settingsController.saveConfigFile(oConfig);
            }
        }
    } catch (oError) {
        console.error(oError);
    }
};
