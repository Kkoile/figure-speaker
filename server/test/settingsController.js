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

    describe('saveCredentials', function () {
        it('should add a spotify section to the config file', function (done) {
            var sSavedFile;

            var sConfigFile = fs.readFileSync('./test/resources/CONFIG_FILE_WITHOUT_SPOTIFY_SECTION.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf').returns(sConfigFile);
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(sHomePath + '/.config/mopidy/mopidy.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });
            var oMopidyStub = sandbox.stub(mopidy, 'restart').resolves();

            settingsController.saveCredentials({
                email: 'DUMMY_EMAIL',
                password: 'DUMMY_PASSWORD',
                clientId: 'DUMMY_CLIENT_ID',
                clientSecret: 'DUMMY_CLIENT_SECRET'
            }).then(function () {
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);
                assert(oMopidyStub.calledOnce);

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
            var oMopidyStub = sandbox.stub(mopidy, 'restart').resolves();

            settingsController.saveCredentials({
                email: 'DUMMY_EMAIL',
                password: 'DUMMY_PASSWORD',
                clientId: 'DUMMY_CLIENT_ID',
                clientSecret: 'DUMMY_CLIENT_SECRET'
            }).then(function () {
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);
                assert(oMopidyStub.calledOnce);

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
            var oMopidyStub = sandbox.stub(mopidy, 'restart').resolves();

            settingsController.saveCredentials({
                email: 'DUMMY_EMAIL',
                password: 'DUMMY_PASSWORD',
                clientId: 'DUMMY_CLIENT_ID',
                clientSecret: 'DUMMY_CLIENT_SECRET'
            }).then(function () {
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);
                assert(oMopidyStub.calledOnce);

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
            var oMopidyStub = sandbox.stub(mopidy, 'restart').resolves();

            settingsController.saveCredentials({
                email: 'DUMMY_EMAIL',
                password: 'DUMMY_PASSWORD',
                clientId: 'DUMMY_CLIENT_ID',
                clientSecret: 'DUMMY_CLIENT_SECRET'
            }).then(function () {
                assert(oFSReadFileStub.calledOnce);
                assert(oFSWriteFileStub.calledOnce);
                assert(oMopidyStub.calledOnce);

                assert(sSavedFile.includes('color = true'));
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