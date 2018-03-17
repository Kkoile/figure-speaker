/*eslint no-console: 0*/
"use strict";

var winston = require('winston');
var express = require('express');
var ApplicationError = require('../lib/ApplicationError');

var hostController = require('../lib/hostController');

var dataApi = express.Router();

dataApi.route('/:host/authToken').get(function (req, res, next) {
    hostController.getAuthToken(req.params.host)
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

module.exports = dataApi;