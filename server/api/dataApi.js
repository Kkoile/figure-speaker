/*eslint no-console: 0*/
"use strict";

var winston = require('winston');
var express = require('express');
var ApplicationError = require('../lib/ApplicationError');
var FileUpload = require('express-fileupload');

var hostController = require('../lib/hostController');
var mp3Controller = require('../lib/mp3Controller');

var dataApi = express.Router();

dataApi.route('/:host/authToken').get(function (req, res, next) {
    hostController.getAuthToken(req.params.host)
        .then(function (oData) {
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