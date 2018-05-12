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
        it('should set account to enabled, if section is commented out', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_COMMENTED_SPOTIFY_SECTION.conf', 'utf8');
            sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);

            var oAccount = spotifyController.getAccountInfo();
            assert(oAccount.enabled === true);
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

    describe('saveAccount', function () {
        it('should add a spotify section to the config file', function (done) {
            var sSavedFile;

            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITHOUT_SPOTIFY_SECTION.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            spotifyController.saveAccount({
                username: 'DUMMY_EMAIL',
                password: 'DUMMY_PASSWORD',
                client_id: 'DUMMY_CLIENT_ID',
                client_secret: 'DUMMY_CLIENT_SECRET'
            }).then(function () {
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);

                assert(sSavedFile.includes('[spotify]'));
                assert(sSavedFile.includes('username = DUMMY_EMAIL'));
                assert(sSavedFile.includes('password = DUMMY_PASSWORD'));
                assert(sSavedFile.includes('client_id = DUMMY_CLIENT_ID'));
                assert(sSavedFile.includes('client_secret = DUMMY_CLIENT_SECRET'));
                done();
            });

        });
        it('should keep the existing spotify section and overwrite the comments', function (done) {
            var sSavedFile;

            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_COMMENTED_SPOTIFY_SECTION.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            spotifyController.saveAccount({
                username: 'DUMMY_EMAIL',
                password: 'DUMMY_PASSWORD',
                client_id: 'DUMMY_CLIENT_ID',
                client_secret: 'DUMMY_CLIENT_SECRET'
            }).then(function () {
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);

                assert(sSavedFile.includes('[spotify]'));
                assert(sSavedFile.includes('username = DUMMY_EMAIL'));
                assert(sSavedFile.includes('password = DUMMY_PASSWORD'));
                assert(sSavedFile.includes('client_id = DUMMY_CLIENT_ID'));
                assert(sSavedFile.includes('client_secret = DUMMY_CLIENT_SECRET'));
                done();
            });
        });

        it('should keep the existing spotify section and overwrite the old credentials', function (done) {
            var sSavedFile;

            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_OLD_SPOTIFY_SECTION.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            spotifyController.saveAccount({
                username: 'DUMMY_EMAIL',
                password: 'DUMMY_PASSWORD',
                client_id: 'DUMMY_CLIENT_ID',
                client_secret: 'DUMMY_CLIENT_SECRET'
            }).then(function () {
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);

                assert(sSavedFile.includes('[spotify]'));
                assert(sSavedFile.includes('username = DUMMY_EMAIL'));
                assert(sSavedFile.includes('password = DUMMY_PASSWORD'));
                assert(sSavedFile.includes('client_id = DUMMY_CLIENT_ID'));
                assert(sSavedFile.includes('client_secret = DUMMY_CLIENT_SECRET'));
                done();
            });
        });

        it('should not overwrite other existing config', function (done) {
            var sSavedFile;

            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_OLD_SPOTIFY_SECTION.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            spotifyController.saveAccount({
                username: 'DUMMY_EMAIL',
                password: 'DUMMY_PASSWORD',
                client_id: 'DUMMY_CLIENT_ID',
                client_secret: 'DUMMY_CLIENT_SECRET'
            }).then(function () {
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);

                assert(sSavedFile.includes('color = true'));
                done();
            });
        });
    });

    describe('deleteAccount', function () {
        it('should set enabled to false in config file and delete old properties', function (done) {
            var sSavedFile;

            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITH_SPOTIFY_SECTION.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            spotifyController.deleteAccount();
            assert(oFSReadFileStub.calledOnce);
            assert(oFSWriteFileStub.calledOnce);

            assert(sSavedFile.includes('[spotify]\nenabled = false'));
            assert(!sSavedFile.includes('username = DUMMY_USERNAME'));
            done();
        });
        it('should set enabled to false in config file even if it did not exist', function (done) {
            var sSavedFile;

            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITHOUT_SPOTIFY_SECTION.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            spotifyController.deleteAccount();
            assert(oFSReadFileStub.calledOnce);
            assert(oFSWriteFileStub.calledOnce);

            assert(sSavedFile.includes('[spotify]\nenabled = false'));
            done();
        });
    });
});