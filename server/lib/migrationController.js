const fs = require('fs');
const ini = require('ini');
const constants = require('./constants.js');
const settingsController = require('./settingsController');

exports.moveSpotifyCountryConfigFromMopidyToGeneralConfig = function () {
    try {
        const oMopidyConfig = ini.parse(fs.readFileSync(constants.Mopidy.PathToConfig, 'utf-8'));
        if (oMopidyConfig.spotify && oMopidyConfig.spotify.country) {
            const sCountry = oMopidyConfig.spotify.country;
            delete oMopidyConfig.spotify.country;
            fs.writeFileSync(constants.Mopidy.PathToConfig, ini.stringify(oMopidyConfig, {whitespace: true}));

            const oConfig = settingsController.getConfigFile();
            if (!oConfig.general.spotify_country) {
                oConfig.general.spotify_country = sCountry;
                settingsController.saveConfigFile(oConfig);
            }
        }
    } catch (oError) {
        console.error(oError);
    }
};
