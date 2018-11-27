var assert = require('assert');
var sinon = require('sinon');

var fs = require('fs');
var mopidy = require('../lib/mopidy.js');
var rfidConnection = require('../lib/rfidConnection');
var hostController = require('../lib/hostController');

var constants = require('../lib/constants.js');
var ApplicationError = require('../lib/ApplicationError.js');
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

    describe('_saveFiguresFile', function () {
        it('should create a new .config directory if it does not exist', function (done) {
            var oFSExistsStub = sandbox.stub(fs, 'existsSync');
            var oFSCreateStub = sandbox.stub(fs, 'mkdirSync');
            var oFSExistsConfigDirStub = oFSExistsStub.withArgs(require("os").homedir() + '/.config').returns(false);
            var oFSCreateConfigDirStub = oFSCreateStub.withArgs(require("os").homedir() + '/.config');
            var oFSExistsAppDirStub = oFSExistsStub.withArgs(require("os").homedir() + '/.config/figure-speaker').returns(false);
            var oFSCreateAppDirStub = oFSCreateStub.withArgs(require("os").homedir() + '/.config/figure-speaker');
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf');

            settingsController._saveFiguresFile('DUMMY_URI');

            assert(oFSExistsConfigDirStub.calledOnce);
            assert(oFSCreateConfigDirStub.calledOnce);
            assert(oFSExistsAppDirStub.calledOnce);
            assert(oFSCreateAppDirStub.calledOnce);
            assert(oFSWriteFileStub.calledOnce);

            done();
        });
        it('should not create a new .config directory, because it already exists', function (done) {
            var oFSExistsStub = sandbox.stub(fs, 'existsSync');
            var oFSCreateStub = sandbox.stub(fs, 'mkdirSync');
            var oFSExistsConfigDirStub = oFSExistsStub.withArgs(require("os").homedir() + '/.config').returns(true);
            var oFSCreateConfigDirStub = oFSCreateStub.withArgs(require("os").homedir() + '/.config');
            var oFSExistsAppDirStub = oFSExistsStub.withArgs(require("os").homedir() + '/.config/figure-speaker').returns(false);
            var oFSCreateAppDirStub = oFSCreateStub.withArgs(require("os").homedir() + '/.config/figure-speaker');
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf');

            settingsController._saveFiguresFile('DUMMY_URI');

            assert(oFSExistsConfigDirStub.calledOnce);
            assert(oFSCreateConfigDirStub.notCalled);
            assert(oFSExistsAppDirStub.calledOnce);
            assert(oFSCreateAppDirStub.calledOnce);
            assert(oFSWriteFileStub.calledOnce);

            done();
        });
        it('should not create a new app directory, because it already exists', function (done) {
            var oFSExistsStub = sandbox.stub(fs, 'existsSync');
            var oFSCreateStub = sandbox.stub(fs, 'mkdirSync');
            var oFSExistsConfigDirStub = oFSExistsStub.withArgs(require("os").homedir() + '/.config').returns(true);
            var oFSCreateConfigDirStub = oFSCreateStub.withArgs(require("os").homedir() + '/.config');
            var oFSExistsAppDirStub = oFSExistsStub.withArgs(require("os").homedir() + '/.config/figure-speaker').returns(true);
            var oFSCreateAppDirStub = oFSCreateStub.withArgs(require("os").homedir() + '/.config/figure-speaker');
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf');

            settingsController._saveFiguresFile('DUMMY_URI');

            assert(oFSExistsConfigDirStub.calledOnce);
            assert(oFSCreateConfigDirStub.notCalled);
            assert(oFSExistsAppDirStub.calledOnce);
            assert(oFSCreateAppDirStub.notCalled);
            assert(oFSWriteFileStub.calledOnce);

            done();
        });
        it('should save the correct file', function (done) {
            var sSavedFile;

            var oFSExistsStub = sandbox.stub(fs, 'existsSync');
            var oFSCreateStub = sandbox.stub(fs, 'mkdirSync');
            var oFSExistsConfigDirStub = oFSExistsStub.withArgs(require("os").homedir() + '/.config').returns(true);
            var oFSCreateConfigDirStub = oFSCreateStub.withArgs(require("os").homedir() + '/.config');
            var oFSExistsAppDirStub = oFSExistsStub.withArgs(require("os").homedir() + '/.config/figure-speaker').returns(true);
            var oFSCreateAppDirStub = oFSCreateStub.withArgs(require("os").homedir() + '/.config/figure-speaker');
            var oFSWriteFileStub = sandbox.stub(fs, 'writeFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf')
                .callsFake(function (sPath, sFile) {
                    sSavedFile = sFile;
                });

            settingsController._saveFiguresFile({'DUMMY_ID': {'uri': 'DUMMY_URI'}});

            assert(oFSExistsConfigDirStub.calledOnce);
            assert(oFSCreateConfigDirStub.notCalled);
            assert(oFSExistsAppDirStub.calledOnce);
            assert(oFSCreateAppDirStub.notCalled);
            assert(oFSWriteFileStub.calledOnce);

            assert(sSavedFile.includes('[DUMMY_ID]\nuri = DUMMY_URI'));

            done();
        });
    });

    describe('getConfigFile', function () {
        it('should return an empty object if file does not exist', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').throws(new Error());

            var oConfig = settingsController.getConfigFile();
            assert(oFSReadFileStub.calledOnce);
            assert(typeof oConfig === 'object');
            done();
        });
        it('should parse the config file', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').returns(sConfigFile);

            var oConfig = settingsController.getConfigFile();
            assert(oFSReadFileStub.calledOnce);
            assert(typeof oConfig === 'object');
            assert(oConfig.general.play_mode === 'RESUME');
            done();
        });
    });

    describe('saveFigure', function () {
        it('should create a new .conf file if it is not there', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('DUMMY_ID');
            var oGetConfigFileStub = sandbox.stub(settingsController, 'getConfigFile').returns({});
            var oMopidyStub = sandbox.stub(mopidy, 'onCardRemoved').resolves();

            var oSaveFigureStub = sandbox.stub(settingsController, '_saveFiguresFile').withArgs({'DUMMY_ID': {'uri': 'DUMMY_URI'}});

            settingsController.saveFigure('DUMMY_URI').then(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oGetConfigFileStub.calledOnce);
                assert(oSaveFigureStub.calledOnce);
                assert(oMopidyStub.calledOnce);

                done();
            });

        });
        it('should add an uri to a connected figure', function (done) {
            var oSavedObject;

            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('DUMMY_ID');

            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSaveFigureStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function(oConfig) {
                oSavedObject = oConfig;
            });
            var oMopidyStub = sandbox.stub(mopidy, 'onCardRemoved').resolves();

            settingsController.saveFigure('DUMMY_URI').then(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFigureStub.calledOnce);
                assert(oMopidyStub.calledOnce);

                assert(oSavedObject['DUMMY_ID']['uri'] === 'DUMMY_URI');
                done();
            });

        });
        it('should overwrite an existing figure', function (done) {
            var oSavedObject;

            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('EXISTING_ID');

            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSaveFigureStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function(oConfig) {
                oSavedObject = oConfig;
            });
            var oMopidyStub = sandbox.stub(mopidy, 'onCardRemoved').resolves();

            settingsController.saveFigure('NEW_URI').then(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFigureStub.calledOnce);
                assert(oMopidyStub.calledOnce);

                assert(oSavedObject['EXISTING_ID']['uri'] === 'NEW_URI');
                done();
            });

        });
        it('should throw an error because no card is detected', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(false);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId');

            var oFSAccessStub = sandbox.stub(fs, 'accessSync');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf');
            var oSaveFigureStub = sandbox.stub(settingsController, '_saveFiguresFile');
            var oMopidyStub = sandbox.stub(mopidy, 'onCardRemoved').resolves();

            settingsController.saveFigure('DUMMY_URI').catch(function () {
                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.notCalled);
                assert(oFSAccessStub.notCalled);
                assert(oFSReadFileStub.notCalled);
                assert(oSaveFigureStub.notCalled);
                assert(oMopidyStub.notCalled);

                done();
            });

        });
    });
    describe('getFigureWithInformation', function () {
        it('should get data of a connected figure', function (done) {
            var oGetFigureInfoStub = sandbox.stub(settingsController, 'getFigurePlayInformation').resolves({
                cardId: 'CARD_ID',
                uri: 'DUMMY_URI'
            });

            var oHostControllerStub = sandbox.stub(hostController, 'getItemForUri').withArgs('DUMMY_URI').resolves({});

            settingsController.getFigureWithInformation().then(function () {
                assert(oGetFigureInfoStub.calledOnce);
                assert(oHostControllerStub.calledOnce);

                done();
            });

        });
        it('should return nothing because figure is not yet set', function (done) {
            var oGetFigureInfoStub = sandbox.stub(settingsController, 'getFigurePlayInformation').resolves(null);

            var oHostControllerStub = sandbox.stub(hostController, 'getItemForUri');

            settingsController.getFigureWithInformation().then(function (oData) {
                assert(oGetFigureInfoStub.calledOnce);
                assert(oHostControllerStub.notCalled);

                assert(oData === undefined);
                done();
            });

        });
        it('should throw an error because no card is detected', function (done) {
            var oGetFigureInfoStub = sandbox.stub(settingsController, 'getFigurePlayInformation').rejects(new ApplicationError('No card detected', 400));

            var oHostControllerStub = sandbox.stub(hostController, 'getItemForUri');

            settingsController.getFigureWithInformation().catch(function (oError) {
                assert(oError.status === 400);
                assert(oGetFigureInfoStub.calledOnce);
                assert(oHostControllerStub.notCalled);

                done();
            });

        });
    });
    describe('getFigurePlayInformation', function () {
        it('should get data of a connected figure', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('EXISTING_ID');

            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);

            var oGetProgressStub = sandbox.stub(settingsController, '_getProgressOfSong').resolves(0);
            var oGetCurrentVolumeStub = sandbox.stub(settingsController, 'getCurrentVolume').resolves(70);

            settingsController.getFigurePlayInformation().then(function (oData) {
                assert(oData.cardId === 'EXISTING_ID');
                assert(oData.uri === 'OLD_URI');
                assert(oData.progress === 0);
                assert(oData.lastPlayed === undefined);
                assert(oData.volume === 70);

                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSReadFileStub.calledOnce);
                assert(oGetProgressStub.calledOnce);
                assert(oGetCurrentVolumeStub.calledOnce);

                done();
            });

        });
        it('should return nothing, because figure is not yet set', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(true);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId').returns('NOT_EXISTING_ID');

            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);

            var oGetProgressStub = sandbox.stub(settingsController, '_getProgressOfSong');

            var oHostControllerStub = sandbox.stub(hostController, 'getItemForUri');

            settingsController.getFigurePlayInformation().then(function (oData) {
                assert(oData === null);

                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.calledOnce);
                assert(oFSReadFileStub.calledOnce);
                assert(oGetProgressStub.notCalled);
                assert(oHostControllerStub.notCalled);

                done();
            });

        });
        it('should throw an error because no card is detected', function (done) {
            var oRfidConnectionIsConnectedStub = sandbox.stub(rfidConnection, 'isCardDetected').returns(false);
            var oRfidConnectionGetIdStub = sandbox.stub(rfidConnection, 'getCardId');

            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf');

            var oGetProgressStub = sandbox.stub(settingsController, '_getProgressOfSong');
            var oHostControllerStub = sandbox.stub(hostController, 'getItemForUri');

            settingsController.getFigurePlayInformation().catch(function (oError) {
                assert(oError.status === 400);

                assert(oRfidConnectionIsConnectedStub.calledOnce);
                assert(oRfidConnectionGetIdStub.notCalled);
                assert(oFSReadFileStub.notCalled);
                assert(oGetProgressStub.notCalled);
                assert(oHostControllerStub.notCalled);

                done();
            });

        });
    });

    describe('_getProgressOfSong', function () {
        it('should resume, if play mode is set to RESUME', function (done) {

            var oGetPlayModeStub = sandbox.stub(settingsController, 'getPlayMode').resolves({
                playMode: 'RESUME',
                resetAfterDays: 7
            });

            var oLastPlayed = new Date();
            oLastPlayed.setDate(oLastPlayed.getDate() - 1);
            settingsController._getProgressOfSong({progress: 200, last_played: oLastPlayed, track_index: 1}).then(function (oProgress) {
                assert(oProgress.position === 200);
                assert(oProgress.track === 1);

                assert(oGetPlayModeStub.calledOnce);
                done();
            });

        });
        it('should not resume, if last played is too late', function (done) {

            var oGetPlayModeStub = sandbox.stub(settingsController, 'getPlayMode').resolves({
                playMode: 'RESUME',
                resetAfterDays: 7
            });

            var oLastPlayed = new Date();
            oLastPlayed.setDate(oLastPlayed.getDate() - 10);
            settingsController._getProgressOfSong({progress: 200, last_played: oLastPlayed, track_index: 1}).then(function (oProgress) {
                assert(oProgress.position === 0);
                assert(oProgress.track === 0);

                assert(oGetPlayModeStub.calledOnce);
                done();
            });

        });
        it('should reset, if play mode is set to RESET', function (done) {

            var oGetPlayModeStub = sandbox.stub(settingsController, 'getPlayMode').resolves({
                playMode: 'RESET'
            });

            var oLastPlayed = new Date();
            oLastPlayed.setDate(oLastPlayed.getDate() - 1);
            settingsController._getProgressOfSong({progress: 200, last_played: oLastPlayed, track_index: 1}).then(function (oProgress) {
                assert(oProgress.position === 0);
                assert(oProgress.track === 0);

                assert(oGetPlayModeStub.calledOnce);
                done();
            });

        });
        it('should work with progress as string', function (done) {

            var oGetPlayModeStub = sandbox.stub(settingsController, 'getPlayMode').resolves({
                playMode: 'RESUME',
                resetAfterDays: 7
            });

            var oLastPlayed = new Date();
            oLastPlayed.setDate(oLastPlayed.getDate() - 1);
            settingsController._getProgressOfSong({progress: 200, last_played: oLastPlayed, track_index: 1}).then(function (oProgress) {
                assert(oProgress.position === 200);
                assert(oProgress.track === 1);

                assert(oGetPlayModeStub.calledOnce);
                done();
            });

        });
        it('should work with last played as string', function (done) {

            var oGetPlayModeStub = sandbox.stub(settingsController, 'getPlayMode').resolves({
                playMode: 'RESUME',
                resetAfterDays: 7
            });

            var oLastPlayed = new Date();
            oLastPlayed.setDate(oLastPlayed.getDate() - 1);
            settingsController._getProgressOfSong({progress: 200, last_played: oLastPlayed, track_index: 1}).then(function (oProgress) {
                assert(oProgress.position === 200);
                assert(oProgress.track === 1);

                assert(oGetPlayModeStub.calledOnce);
                done();
            });

        });
    });

    describe('getPlayMode', function () {
        it('should return resume and 7, if figures.conf does not exist', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns('');

            settingsController.getPlayMode().then(function (oPlayMode) {
                assert(oPlayMode.playMode === 'RESUME');
                assert(oPlayMode.resetAfterDays === 7);

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
        it('should return resume and 2 for given figures.conf', function (done) {

            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);

            settingsController.getPlayMode().then(function (oPlayMode) {
                assert(oPlayMode.playMode === 'RESUME');
                assert(oPlayMode.resetAfterDays === 2);

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
        it('should return reset for given figures.conf', function (done) {

            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE_RESET.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);

            settingsController.getPlayMode().then(function (oPlayMode) {
                assert(oPlayMode.playMode === 'RESET');
                assert(oPlayMode.resetAfterDays === 7);

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
    });

    describe('setPlayMode', function () {
        it('should create a section "general" if it does not exist', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns('');
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setPlayMode('RESUME', 2).then(function () {
                assert(!!oSavedConfig.general);
                assert(oSavedConfig.general.play_mode === 'RESUME');
                assert(oSavedConfig.general.reset_after_days === 2);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
        it('should overwrite existing "general" section', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE_RESET.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setPlayMode('RESUME', 2).then(function () {
                assert(oSavedConfig.general.play_mode === 'RESUME');
                assert(oSavedConfig.general.reset_after_days === 2);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
        it('should not set reset_after_days if it is not passed', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE_RESET.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setPlayMode('RESUME').then(function () {
                assert(oSavedConfig.general.play_mode === 'RESUME');
                assert(!oSavedConfig.general.reset_after_days);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
        it('should delete existing reset_after_days if it is not passed', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setPlayMode('RESUME').then(function () {
                assert(oSavedConfig.general.play_mode === 'RESUME');
                assert(!oSavedConfig.general.reset_after_days);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
        it('should set play_mode to RESET', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setPlayMode('RESET').then(function () {
                assert(oSavedConfig.general.play_mode === 'RESET');
                assert(!oSavedConfig.general.reset_after_days);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
        it('should keep play_mode to RESET', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE_RESET.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setPlayMode('RESET').then(function () {
                assert(oSavedConfig.general.play_mode === 'RESET');
                assert(!oSavedConfig.general.reset_after_days);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
    });

    describe('getLanguage', function () {
        it('should return the default language if no language is configured', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns('');

            settingsController.getLanguage().then(function (sLanguage) {
                assert(sLanguage === constants.General.Language);

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
        it('should return the configured language', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);

            settingsController.getLanguage().then(function (sLanguage) {
                assert(sLanguage === 'de');

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
    });

    describe('setLanguage', function () {
        it('should set the language', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns('');
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setLanguage('de').then(function (sLanguage) {
                assert(!!oSavedConfig.general);
                assert(oSavedConfig.general.language === 'de');
                assert(sLanguage === 'de');

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
        it('should overwrite the old language', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setLanguage('new').then(function (sLanguage) {
                assert(!!oSavedConfig.general);
                assert(oSavedConfig.general.language === 'new');
                assert(sLanguage === 'new');

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
    });

    describe('getMaxVolume', function () {
        it('should return the default max volume if no max volume is configured', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns('');

            settingsController.getMaxVolume().then(function (iMaxVolume) {
                assert(iMaxVolume === constants.General.MaxVolume);

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
        it('should return the configured max volume', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);

            settingsController.getMaxVolume().then(function (iMaxVolume) {
                assert(iMaxVolume === 50);

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
    });

    describe('setMaxVolume', function () {
        it('should set the max volume', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns('');
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setMaxVolume(75).then(function (iMaxVolume) {
                assert(!!oSavedConfig.general);
                assert(oSavedConfig.general.max_volume === 75);
                assert(iMaxVolume === 75);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
        it('should overwrite the old max volume', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setMaxVolume(75).then(function (iMaxVolume) {
                assert(!!oSavedConfig.general);
                assert(oSavedConfig.general.max_volume === 75);
                assert(iMaxVolume === 75);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
    });

    describe('getCurrentVolume', function () {
        it('should return the default current volume if no current volume is configured', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns('');

            settingsController.getCurrentVolume().then(function (icurrentVolume) {
                assert(icurrentVolume === constants.General.CurrentVolume);

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
        it('should return the configured current volume', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);

            settingsController.getCurrentVolume().then(function (iCurrentVolume) {
                assert(iCurrentVolume === 30);

                assert(oFSReadFileStub.calledOnce);
                done();
            });

        });
    });

    describe('setCurrentVolume', function () {
        it('should set the current volume', function (done) {
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns('');
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setCurrentVolume(60).then(function (iCurrentVolume) {
                assert(!!oSavedConfig.general);
                assert(oSavedConfig.general.current_volume === 60);
                assert(iCurrentVolume === 60);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
        it('should overwrite the old current volume', function (done) {
            var sConfigFile = fs.readFileSync('./test/resources/FIGURE_FILE.conf', 'utf8');
            var oFSReadFileStub = sandbox.stub(fs, 'readFileSync').withArgs(require("os").homedir() + '/.config/figure-speaker/figures.conf').returns(sConfigFile);
            var oSavedConfig;
            var oSaveFiguresStub = sandbox.stub(settingsController, '_saveFiguresFile').callsFake(function (oConfig) {
                oSavedConfig = oConfig;
            });

            settingsController.setCurrentVolume(40).then(function (iCurrentVolume) {
                assert(!!oSavedConfig.general);
                assert(oSavedConfig.general.current_volume === 40);
                assert(iCurrentVolume === 40);

                assert(oFSReadFileStub.calledOnce);
                assert(oSaveFiguresStub.calledOnce);
                done();
            });

        });
    });
});