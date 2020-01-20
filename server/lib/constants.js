const sPathToGeneralConfig = require('os').homedir() + '/.config';
const sPathToAppConfig = sPathToGeneralConfig + '/figure-speaker';
const sPathToConfigFile = sPathToAppConfig + '/figures.conf';
const sPathToMp3Files = sPathToAppConfig + '/files';


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
        PathToFigures: sPathToConfigFile,
        PathToMp3Files: sPathToMp3Files
    },
    Mopidy: {
        PathToConfig: require('os').homedir() + '/.config/mopidy/mopidy.conf',
        WebSocketUrl: process.env.MOPIDY_WEB_SOCKET_URL || 'ws://localhost:6680/mopidy/ws/'
    },
    PlayMode: {
        Resume: 'RESUME',
        Reset: 'RESET',
        Repeat: false
    },
    Buttons: {
        Increase: 'INCREASE',
        Decrease: 'DECREASE',
        WindForwards: 'WIND_FORWARDS',
        ReWind: 'REWIND',
        Push: 1,
        Release: 0,
        WatchInterval: 5,
        WindInterval: 500
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