'use strict';

var sPathToGeneralConfig = require("os").homedir() + '/.config';
var sPathToAppConfig = sPathToGeneralConfig + '/figure-speaker';
var sPathToConfigFile = sPathToAppConfig + '/figures.conf';


module.exports = {
    General: {
        Language: 'en',
        MinVolume: 5,
        MaxVolume: 100,
        CurrentVolume: 70
    },
    Data: {
        PathToGeneralConfig: sPathToGeneralConfig,
        PathToAppConfig: sPathToAppConfig,
        PathToFigures: sPathToConfigFile
    },
    Mopidy: {
        PathToConfig: require("os").homedir() + '/.config/mopidy/mopidy.conf',
        WebSocketUrl: process.env.MOPIDY_WEB_SOCKET_URL || 'ws://localhost:6680/mopidy/ws/'
    },
    PlayMode: {
        Resume: 'RESUME',
        Reset: 'RESET'
    },
    VolumeChange: {
        Increase: "INCREASE",
        Decrease: "DECREASE",
        Push: 1,
        Release: 0,
        Interval: 5
    },
    Player: {
        DefaultPlayMode: 'RESUME',
        DefaultResetAfterDays: 7
    },
    Spotify: {
        ClientId: process.env.SPOTIFY_CLIENT_ID,
        ClientSecret: process.env.SPOTIFY_CLIENT_SECRET
    }
};