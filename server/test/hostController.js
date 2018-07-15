var assert = require('assert');
var sinon = require('sinon');

var constants = require('../lib/constants.js');
var hostController = require('../lib/hostController');

var spotifyController = require('../lib/spotifyController');
var mp3Controller = require('../lib/mp3Controller');
var youtubeController = require('../lib/youtubeController');

describe('Host Controller', function () {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('getAccounts', function () {
        it('should call all known hosts', function (done) {
            var oSpotifyStub = sandbox.stub(spotifyController, 'getAccountInfo').returns({
                name: 'Spotify',
                enabled: true,
                username: 'DUMMY_USERNAME',
                configurable: true
            });
            var oMP3Stub = sandbox.stub(mp3Controller, 'getAccountInfo').returns({
                name: 'MP3',
                enabled: true,
                configurable: false
            });
            var oYoutubeStub = sandbox.stub(youtubeController, 'getAccountInfo').returns({
                name: 'Youtube',
                enabled: true,
                configurable: false
            });

            hostController.getAccounts().then(function (aAccounts) {
                assert(aAccounts.length === 3);
                assert(oSpotifyStub.calledOnce);
                assert(oMP3Stub.calledOnce);
                assert(oYoutubeStub.calledOnce);
                done();
            });
        });
    });

    describe('getAccountInfo', function () {
        it('should return account info of given host', function (done) {

            var oSpotifyStub = sandbox.stub(spotifyController, 'getAccountInfo').returns({
                enabled: true,
                username: 'DUMMY_USERNAME'
            });

            hostController.getAccountInfo('spotify').then(function (oAccountInfo) {
                assert(oAccountInfo.enabled === true);
                assert(oAccountInfo.username === 'DUMMY_USERNAME');

                assert(oSpotifyStub.calledOnce);
                done();
            });
        });
    });

    describe('getControllerOfHost', function () {
        it('should return controller of host', function (done) {
            var oController = hostController.getControllerOfHost('spotify');
            assert(oController === spotifyController);
            done();
        });
        it('should throw a 404 error, if host does not exist', function (done) {
            try {
                hostController.getControllerOfHost('NOT_EXISTING_HOST_ID');
            } catch (oError) {
                assert(oError.status === 404);
                done();
            }
        });
    });
});