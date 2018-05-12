var assert = require('assert');
var sinon = require('sinon');

var fs = require('fs');
var mopidy = require('../lib/mopidy.js');
var rfidConnection = require('../lib/rfidConnection');
var hostController = require('../lib/hostController');

var constants = require('../lib/constants.js');
var settingsController = require('../lib/settingsController.js');

var sHomePath = require("os").homedir();

describe('Settings Controller', function () {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('getAccounts', function () {
        it('should get all accounts of available extensions', function (done) {
            var oHostControllerStub = sandbox.stub(hostController, 'getAccounts').resolves([{
                enabled: true,
                username: 'DUMMY_USERNAME'
            }]);

            settingsController.getAccounts().then(function (aAccounts) {
                assert(aAccounts.length === 1);
                assert(aAccounts[0].enabled === true);
                assert(aAccounts[0].username === 'DUMMY_USERNAME');

                assert(oHostControllerStub.calledOnce);
                done();
            });

        });
    });

    describe('saveAccount', function () {
        it('should restart mopidy', function (done) {
            var oHostControllerStub = sandbox.stub(hostController, 'saveAccount').resolves();
            var oMopidyStub = sandbox.stub(mopidy, 'restart').resolves();

            settingsController.saveAccount('HOST_ID', {}).then(function () {
                assert(oHostControllerStub.calledOnce);
                assert(oMopidyStub.calledOnce);
                done();
            });

        });
        it('should not restart mopidy if save failed', function (done) {
            var oHostControllerStub = sandbox.stub(hostController, 'saveAccount').rejects();
            var oMopidyStub = sandbox.stub(mopidy, 'restart');

            settingsController.saveAccount('HOST_ID', {}).catch(function () {
                assert(oHostControllerStub.calledOnce);
                assert(oMopidyStub.notCalled);
                done();
            });

        });
    });

    describe('saveFigure', function () {
        it('should create a new .conf file if it is not there', function (done) {
            var sSavedFile;

            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('DUMMY_ID');

            var oFSAccessStub = sandbox.stub(fs, 'accessSync').throws("Error");
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs('./figures.conf');
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs('./figures.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            settingsController.saveFigure('DUMMY_URI').then(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSAccessStub.calledOnce);
                assert(oFSReadFileStub.notCalled);
                assert(oFSWriteFileStub.calledOnce);

                assert(sSavedFile.includes('DUMMY_ID = DUMMY_URI'));
                done();
            });

        });
        it('should add an uri to a connected figure', function (done) {
            var sSavedFile;

            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('DUMMY_ID');

            var oFSAccessStub = sandbox.stub(fs, 'accessSync');
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs('./figures.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs('./figures.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            settingsController.saveFigure('DUMMY_URI').then(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSAccessStub.calledOnce);
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);

                assert(sSavedFile.includes('DUMMY_ID = DUMMY_URI'));
                done();
            });

        });
        it('should overwrite an existing figure', function (done) {
            var sSavedFile;

            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('EXISTING_ID');

            var oFSAccessStub = sandbox.stub(fs, 'accessSync');
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs('./figures.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs('./figures.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            settingsController.saveFigure('NEW_URI').then(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSAccessStub.calledOnce);
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);

                assert(sSavedFile.includes('EXISTING_ID = NEW_URI'));
                done();
            });

        });
        it('should throw an error because no card is detected', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(false);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId');

            var oFSAccessStub = sandbox.stub(fs, 'accessSync');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs('./figures.conf');
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs('./figures.conf');

            settingsController.saveFigure('DUMMY_URI').catch(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.notCalled);
                assert(oFSAccessStub.notCalled);
                assert(oFSReadFileStub.notCalled);
                assert(oFSWriteFileStub.notCalled);

                done();
            });

        });
    });
    describe('getFigureWithInformation', function () {
        it('should get data of a connected figure', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('EXISTING_ID');

            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs('./figures.conf').returns(sConfigFile);

            var oHostControllerStub = sandbox.stub(hostController, 'getItemForUri').withArgs('OLD_URI').resolves({});

            settingsController.getFigureWithInformation().then(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSReadFileStub.calledOnce);
                assert(oHostControllerStub.calledOnce);

                done();
            });

        });
        it('should return nothing because figure is not yet set', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('NOT_EXISTING_ID');

            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs('./figures.conf').returns(sConfigFile);

            var oHostControllerStub = sandbox.stub(hostController, 'getItemForUri');

            settingsController.getFigureWithInformation().then(function (oData) {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSReadFileStub.calledOnce);
                assert(oHostControllerStub.notCalled);

                assert(oData === undefined);
                done();
            });

        });
        it('should throw an error because no card is detected', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(false);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId');

            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs('./figures.conf');

            var oHostControllerStub = sandbox.stub(hostController, 'getItemForUri').withArgs('OLD_URI');

            settingsController.getFigureWithInformation().catch(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.notCalled);
                assert(oFSReadFileStub.notCalled);
                assert(oHostControllerStub.notCalled);

                done();
            });

        });
    });
});