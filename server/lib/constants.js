'use strict';

module.exports = {
    Data: {
        PathToFigures: './figures.conf'
    },
    Mopidy: {
        PathToConfig: require("os").homedir() + '/.config/mopidy/mopidy.conf',
        WebSocketUrl: process.env.MOPIDY_WEB_SOCKET_URL || 'ws://localhost:6680/mopidy/ws/',
        Extensions: !!process.env.MOPIDY_EXTENSIONS ? JSON.parse(process.env.MOPIDY_EXTENSIONS) : []
    },
    PlayMode: {
        Resume: 'RESUME',
        Reset: 'RESET'
    },
    Player: {
        DefaultPlayMode: 'RESUME',
        DefaultResetAfterDays: 7,
    },
    Spotify: {
        ClientId: process.env.SPOTIFY_CLIENT_ID,
        ClientSecret: process.env.SPOTIFY_CLIENT_SECRET
    }
};