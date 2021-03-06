var assert = require('assert');
var sinon = require('sinon');
var request = require('supertest');
var winston = require('winston');

var mopidy = require('../lib/mopidy');
var rfidConnection = require('../lib/rfidConnection');

var settingsController = require('../lib/settingsController');

describe('Settings Api', function () {
    var server;

    before(function () {
        sandbox = sinon.sandbox.create();
        sandbox.stub(rfidConnection, 'init').returns(rfidConnection);
        sandbox.stub(mopidy, 'start').resolves();
        sandbox.stub(mopidy, 'stop').resolves();
        server = require('../index.js');
    });

    after(function (done) {
        server.close(done);
    });

    beforeEach(function () {
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('saveFigure', function () {
        it('should pass streamUri to controller', function (done) {
            var oSettingsControllerStub = sandbox.stub(settingsController, 'saveFigure').resolves();

            request(server)
                .post('/settings/saveFigure')
                .send({streamUri: 'DUMMY_STREAM_URI'})
                .expect(200, function (err, res) {
                    assert(res.status === 200);
                    assert(oSettingsControllerStub.calledOnce);
                    done();
                });
        });
        it('should reject if no streamUri has been given', function (done) {
            var oSettingsControllerStub = sandbox.stub(settingsController, 'saveFigure');

            request(server)
                .post('/settings/saveFigure')
                .send({})
                .expect(400, function (err, res) {
                    assert(res.status === 400);
                    assert(oSettingsControllerStub.notCalled);
                    done();
                });
        });
    });
    describe('getFigureWithInformation', function () {
        it('should return something', function (done) {
            var oSettingsControllerStub = sandbox.stub(settingsController, 'getFigureWithInformation').resolves();

            request(server)
                .get('/settings/getFigureWithInformation')
                .expect(200, function (err, res) {
                    assert(res.status === 200);
                    done();
                });
        });
    });
});