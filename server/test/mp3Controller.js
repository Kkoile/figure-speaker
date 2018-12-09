var assert = require('assert');
var sinon = require('sinon');

var constants = require('../lib/constants.js');

var mp3Controller = require('../lib/mp3Controller');

var fs = require('fs');

describe('MP3 Controller', function () {

    var sandbox;
    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('getAvailableFileNames', function () {
        it('should return all available mp3 files', function (done) {

            var oFsStub = sandbox.stub(fs, 'readdir').withArgs(constants.Data.PathToMp3Files).callsFake(function(sPath, cb) {
                cb(null, ['DUMMY_NAME.mp3']);
            });

            mp3Controller.getAvailableFileNames().then(function (aFiles) {
                assert(aFiles.length === 1);
                assert(aFiles[0] === 'DUMMY_NAME.mp3');
                assert(oFsStub.calledOnce);
                done();
            });
        });
        it('should return an empty array if there are no files', function (done) {

            var oFsStub = sandbox.stub(fs, 'readdir').withArgs(constants.Data.PathToMp3Files).callsFake(function(sPath, cb) {
                cb(null, []);
            });

            mp3Controller.getAvailableFileNames().then(function (aFiles) {
                assert(aFiles.length === 0);
                assert(oFsStub.calledOnce);
                done();
            });
        });
        it('should reject if there is an error', function (done) {

            var oFsStub = sandbox.stub(fs, 'readdir').withArgs(constants.Data.PathToMp3Files).callsFake(function(sPath, cb) {
                cb(new Error());
            });

            mp3Controller.getAvailableFileNames().catch(function (oError) {
                assert(oFsStub.calledOnce);
                done();
            });
        });
    });

    describe('upload', function () {
        it('should return all available mp3 files', function (done) {

            var oFsExistsStub = sandbox.stub(fs, 'existsSync');
            var oFsExistsStub1 = oFsExistsStub.withArgs(constants.Data.PathToGeneralConfig).returns(true);
            var oFsExistsStub2 = oFsExistsStub.withArgs(constants.Data.PathToAppConfig).returns(true);
            var oFsExistsStub3 = oFsExistsStub.withArgs(constants.Data.PathToMp3Files).returns(true);

            var oFsMkDirStub = sandbox.stub(fs, 'mkdirSync');
            var oFsMkDirStub1 = oFsMkDirStub.withArgs(constants.Data.PathToGeneralConfig);
            var oFsMkDirStub2 = oFsMkDirStub.withArgs(constants.Data.PathToAppConfig);
            var oFsMkDirStub3 = oFsMkDirStub.withArgs(constants.Data.PathToMp3Files);

            var sCalledPath;
            var oFile = {
                name: 'DUMMY_FILE.mp3',
                mv: function(sPath, cb) {
                    sCalledPath = sPath;
                    cb(null);
                }
            };
            mp3Controller.upload(oFile).then(function () {
                assert(sCalledPath === constants.Data.PathToMp3Files + '/DUMMY_FILE.mp3');
                assert(oFsExistsStub1.calledOnce);
                assert(oFsExistsStub2.calledOnce);
                assert(oFsExistsStub3.calledOnce);
                assert(oFsMkDirStub1.notCalled);
                assert(oFsMkDirStub2.notCalled);
                assert(oFsMkDirStub3.notCalled);
                done();
            });
        });
        it('should create the config directory if it is not already there', function (done) {

            var oFsExistsStub = sandbox.stub(fs, 'existsSync');
            var oFsExistsStub1 = oFsExistsStub.withArgs(constants.Data.PathToGeneralConfig).returns(false);
            var oFsExistsStub2 = oFsExistsStub.withArgs(constants.Data.PathToAppConfig).returns(false);
            var oFsExistsStub3 = oFsExistsStub.withArgs(constants.Data.PathToMp3Files).returns(false);

            var oFsMkDirStub = sandbox.stub(fs, 'mkdirSync');
            var oFsMkDirStub1 = oFsMkDirStub.withArgs(constants.Data.PathToGeneralConfig);
            var oFsMkDirStub2 = oFsMkDirStub.withArgs(constants.Data.PathToAppConfig);
            var oFsMkDirStub3 = oFsMkDirStub.withArgs(constants.Data.PathToMp3Files);


            var sCalledPath;
            var oFile = {
                name: 'DUMMY_FILE.mp3',
                mv: function(sPath, cb) {
                    sCalledPath = sPath;
                    cb(null);
                }
            };
            mp3Controller.upload(oFile).then(function () {
                assert(sCalledPath === constants.Data.PathToMp3Files + '/DUMMY_FILE.mp3');
                assert(oFsExistsStub1.calledOnce);
                assert(oFsExistsStub2.calledOnce);
                assert(oFsExistsStub3.calledOnce);
                assert(oFsMkDirStub1.calledOnce);
                assert(oFsMkDirStub2.calledOnce);
                assert(oFsMkDirStub3.calledOnce);
                done();
            });
        });
        it('should create the app config directory if it is not already there', function (done) {

            var oFsExistsStub = sandbox.stub(fs, 'existsSync');
            var oFsExistsStub1 = oFsExistsStub.withArgs(constants.Data.PathToGeneralConfig).returns(true);
            var oFsExistsStub2 = oFsExistsStub.withArgs(constants.Data.PathToAppConfig).returns(false);
            var oFsExistsStub3 = oFsExistsStub.withArgs(constants.Data.PathToMp3Files).returns(false);

            var oFsMkDirStub = sandbox.stub(fs, 'mkdirSync');
            var oFsMkDirStub1 = oFsMkDirStub.withArgs(constants.Data.PathToGeneralConfig);
            var oFsMkDirStub2 = oFsMkDirStub.withArgs(constants.Data.PathToAppConfig);
            var oFsMkDirStub3 = oFsMkDirStub.withArgs(constants.Data.PathToMp3Files);


            var sCalledPath;
            var oFile = {
                name: 'DUMMY_FILE.mp3',
                mv: function(sPath, cb) {
                    sCalledPath = sPath;
                    cb(null);
                }
            };
            mp3Controller.upload(oFile).then(function () {
                assert(sCalledPath === constants.Data.PathToMp3Files + '/DUMMY_FILE.mp3');
                assert(oFsExistsStub1.calledOnce);
                assert(oFsExistsStub2.calledOnce);
                assert(oFsExistsStub3.calledOnce);
                assert(oFsMkDirStub1.notCalled);
                assert(oFsMkDirStub2.calledOnce);
                assert(oFsMkDirStub3.calledOnce);
                done();
            });
        });
        it('should create the files directory if it is not already there', function (done) {

            var oFsExistsStub = sandbox.stub(fs, 'existsSync');
            var oFsExistsStub1 = oFsExistsStub.withArgs(constants.Data.PathToGeneralConfig).returns(true);
            var oFsExistsStub2 = oFsExistsStub.withArgs(constants.Data.PathToAppConfig).returns(true);
            var oFsExistsStub3 = oFsExistsStub.withArgs(constants.Data.PathToMp3Files).returns(false);

            var oFsMkDirStub = sandbox.stub(fs, 'mkdirSync');
            var oFsMkDirStub1 = oFsMkDirStub.withArgs(constants.Data.PathToGeneralConfig);
            var oFsMkDirStub2 = oFsMkDirStub.withArgs(constants.Data.PathToAppConfig);
            var oFsMkDirStub3 = oFsMkDirStub.withArgs(constants.Data.PathToMp3Files);


            var sCalledPath;
            var oFile = {
                name: 'DUMMY_FILE.mp3',
                mv: function(sPath, cb) {
                    sCalledPath = sPath;
                    cb(null);
                }
            };
            mp3Controller.upload(oFile).then(function () {
                assert(sCalledPath === constants.Data.PathToMp3Files + '/DUMMY_FILE.mp3');
                assert(oFsExistsStub1.calledOnce);
                assert(oFsExistsStub2.calledOnce);
                assert(oFsExistsStub3.calledOnce);
                assert(oFsMkDirStub1.notCalled);
                assert(oFsMkDirStub2.notCalled);
                assert(oFsMkDirStub3.calledOnce);
                done();
            });
        });
    });
});