'use strict';

module.exports = {
    General: {
        Language: 'en',
        MinVolume: 10,
        MaxVolume: 100,
        CurrentVolume: 70
    },
    Data: {
        PathToFigures: './figures.conf'
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