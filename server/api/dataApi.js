const express = require('express');
const FileUpload = require('express-fileupload');

const hostController = require('../lib/hostController');
const mp3Controller = require('../lib/mp3Controller');
const settingsController = require('../lib/settingsController');

const dataApi = express.Router();

dataApi.route('/:host/authToken').get(function (req, res, next) {
    hostController.getAuthToken(req.params.host)
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

dataApi.route('/checkIfUriIsInUse').get(function (req, res, next) {
    if (!req.query.uri) {
        return res.status(400).send('Uri to check has to be passed as url parameter');
    }
    settingsController.checkIfUriIsInUse(req.query.uri)
        .then(function(oData) {
            res.send(oData);
        })
        .catch(next);
});

dataApi.route('/mp3').get(function (req, res, next) {
    mp3Controller.getAvailableFileNames()
        .then(function(oData) {
            res.send(oData);
        })
        .catch(next);
});

dataApi.route('/mp3/deleteFile').delete(function (req, res, next) {
    if (!req.query.filename) {
        return res.status(400).send('No filename to be removed passed as url parameter');
    }
    const sFilename = decodeURI(req.query.filename);
    mp3Controller.deleteFile(sFilename)
        .then(function() {
            res.send(200);
        })
        .catch(next);
});

dataApi.use(FileUpload());
dataApi.route('/mp3/upload').post(function (req, res, next) {
    if (!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    mp3Controller.upload(req.files.file)
        .then(function() {
            res.send(200);
        })
        .catch(next);
});

module.exports = dataApi;