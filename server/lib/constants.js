'use strict';

module.exports = {
    Data: {
        PathToFigures: './data/figures.conf'
    },
    Mopidy: {
        PathToConfig: require("os").homedir() + '/.config/mopidy/mopidy.conf',
        WebSocketUrl: process.env.MOPIDY_WEB_SOCKET_URL || 'ws://localhost:6680/mopidy/ws/'
    },
    Spotify: {
        ClientId: process.env.SPOTIFY_CLIENT_ID,
        ClientSecret: process.env.SPOTIFY_CLIENT_SECRET
    }
};