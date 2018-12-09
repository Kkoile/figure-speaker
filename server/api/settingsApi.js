/*eslint no-console: 0*/
"use strict";

var winston = require('winston');
var express = require('express');
var ApplicationError = require('../lib/ApplicationError');
var settingsController = require('../lib/settingsController.js');
var constants = require('../lib/constants.js');

var settingsApi = express.Router();

settingsApi.route('/accounts').get(function (req, res, next) {
    settingsController.getAccounts()
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

settingsApi.route('/accounts/:hostId').get(function (req, res, next) {
    settingsController.getAccountInfo(req.params.hostId)
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

settingsApi.route('/accounts/:hostId').post(function (req, res, next) {
    settingsController.saveAccount(req.params.hostId, req.body)
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

settingsApi.route('/accounts/:hostId').delete(function (req, res, next) {
    settingsController.deleteAccount(req.params.hostId)
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

settingsApi.route('/playMode').get(function (req, res, next) {
    settingsController.getPlayMode()
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

settingsApi.route('/playMode').post(function (req, res, next) {
    if (!req.body.playMode) {
        res.status(400).send("PlayMode is missing in body!");
        return;
    }
    settingsController.setPlayMode(req.body.playMode, req.body.resetAfterDays)
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

settingsApi.route('/saveFigure').post(function (req, res, next) {
    if (!req.body.streamUri) {
        res.status(400).send("StreamUri is missing in body!");
        return;
    }
    settingsController.saveFigure(req.body.streamUri)
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

settingsApi.route('/getFigureWithInformation').get(function (req, res, next) {
    settingsController.getFigureWithInformation()
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

settingsApi.route('/language').get(function (req, res, next) {
    settingsController.getLanguage()
        .then(function (sLanguage) {
            res.send(sLanguage);
        })
        .catch(next);
});

settingsApi.route('/language').post(function (req, res, next) {
    if (!req.body.language) {
        res.status(400).send("Language is missing in body!");
        return;
    }
    settingsController.setLanguage(req.body.language)
        .then(function (sLanguage) {
            res.send(sLanguage);
        })
        .catch(next);
});

settingsApi.route('/maxVolume').get(function (req, res, next) {
    settingsController.getMaxVolume()
        .then(function (iMaxVolume) {
            res.send(iMaxVolume.toString());
        })
        .catch(next);
});

settingsApi.route('/maxVolume').post(function (req, res, next) {
    if (!req.body.maxVolume) {
        res.status(400).send("Max Volume is missing in body!");
        return;
    }
    settingsController.setMaxVolume(req.body.maxVolume)
        .then(function (iMaxVolume) {
            res.send(iMaxVolume);
        })
        .catch(next);
});

settingsApi.route('/currentVersion').get(function (req, res, next) {
    settingsController.getCurrentVersion()
        .then(function (sCurrentVersion) {
            res.send(sCurrentVersion);
        })
        .catch(next);
});

module.exports = settingsApi;