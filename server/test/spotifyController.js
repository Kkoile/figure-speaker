var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');

var constants = require('../lib/constants.js');
var spotifyController = require('../lib/spotifyController');

var sHomePath = require("os").homedir();

describe('Spotify Controller', function () {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        spotifyController.spotifyApi.resetAccessToken();
    });


    describe('getAccountInfo', function () {
        it('should read account info from config', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_SPOTIFY_SECTION.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);

            spotifyController.getAccountInfo();
            assert(oFSReadFileStub.calledOnce);
            done();
        });
        it('should transform account info correctly', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_SPOTIFY_SECTION.conf', 'utf8');
            sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);

            var oAccount = spotifyController.getAccountInfo();
            assert(oAccount.enabled === true);
            assert(oAccount.username === 'DUMMY_USERNAME');
            done();
        });
        it('should set account to disabled, if section is commented out', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_COMMENTED_SPOTIFY_SECTION.conf', 'utf8');
            sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);

            var oAccount = spotifyController.getAccountInfo();
            assert(oAccount.enabled === false);
            assert(oAccount.username === null);
            done();
        });
        it('should put own host name into info', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_SPOTIFY_SECTION.conf', 'utf8');
            sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);

            var oAccount = spotifyController.getAccountInfo();
            assert(oAccount.name === 'Spotify');
            done();
        });
    });

    describe('search', function () {
        it('should get and set an auth token', function (done) {

            var oSpotifyQueryStub = sandbox.stub(spotifyController.spotifyApi, 'search');
            oSpotifyQueryStub.onFirstCall().rejects({statusCode: 401});
            var oSpotifyAuthTokenStub = sandbox.stub(spotifyController.spotifyApi, 'clientCredentialsGrant').resolves({body: {access_token: 'DUMMY_ACCESS_TOKEN'}});
            oSpotifyQueryStub.onSecondCall().resolves({body: {}});

            spotifyController.search('QUERY').then(function (oData) {
                assert(oSpotifyAuthTokenStub.calledOnce);
                done();
            });

        });
        it('should not get an auth token, because it already exists', function (done) {

            var oSpotifyQueryStub = sandbox.stub(spotifyController.spotifyApi, 'search').resolves({body: {}});
            var oSpotifyAuthTokenStub = sandbox.stub(spotifyController.spotifyApi, 'clientCredentialsGrant');

            spotifyController.search('QUERY').then(function (oData) {
                assert(oSpotifyAuthTokenStub.notCalled);
                done();
            });

        });
    });
});