var assert = require('assert');
var sinon = require('sinon');

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