const ApplicationError = require('./ApplicationError.js');

const hosts = {
    spotify: require('./spotifyController'),
    youtube: require('./youtubeController'),
    mp3: require('./mp3Controller')
};

exports.getControllerOfHost = function (sHostId) {
    if (!hosts[sHostId]) {
        throw new ApplicationError('Host does not exist: ' + sHostId, 404);
    }
    return hosts[sHostId];
};

exports.getAccounts = function () {
    return new Promise(function (resolve) {
        const aAccounts = [];
        for (const sHostId in Object.keys(hosts)) {
            const oAccount = this.getControllerOfHost(sHostId).getAccountInfo();
            oAccount.id = sHostId;
            aAccounts.push(oAccount);
        }
        resolve(aAccounts);
    }.bind(this));
};

exports.getAccountInfo = function (sHostId) {
    return new Promise(function (resolve) {
        const oAccount = this.getControllerOfHost(sHostId).getAccountInfo();
        oAccount.id = sHostId;
        resolve(oAccount);
    }.bind(this));
};

exports.saveAccount = function (sHostId, oAccount) {
    return this.getControllerOfHost(sHostId).saveAccount(oAccount);
};

exports.deleteAccount = function (sHostId) {
    return new Promise(function (resolve) {
        this.getControllerOfHost(sHostId).deleteAccount();
        resolve();
    }.bind(this));
};

exports.search = function (sHostId, sQuery) {
    return this.getControllerOfHost(sHostId).search(sQuery);
};

exports.getArtist = function (sHostId, sId) {
    return this.getControllerOfHost(sHostId).getArtist(sId);
};

exports.getItemForUri = function (sUri) {
    const aParts = sUri.split(':');
    return this.getControllerOfHost(aParts[0]).getItemForUri(sUri);
};

exports.getAuthToken = function (sHostId) {
    return this.getControllerOfHost(sHostId).getAuthToken();
};