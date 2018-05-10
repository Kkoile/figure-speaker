var assert = require('assert');
var sinon = require('sinon');

var constants = require('../lib/constants.js');
var hostController = require('../lib/hostController');

var spotifyController = require('../lib/spotifyController');

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
                enabled: true,
                username: 'DUMMY_USERNAME'
            });

            hostController.getAccounts().then(function (aAccounts) {
                assert(aAccounts.length === 1);
                assert(aAccounts[0].enabled === true);
                assert(aAccounts[0].username === 'DUMMY_USERNAME');

                assert(oSpotifyStub.calledOnce);
                done();
            });
        });
    });
});