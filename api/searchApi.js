/*eslint no-console: 0*/
"use strict";

var winston = require('winston');
var express = require('express');
var ApplicationError = require('../lib/ApplicationError');

var hostController = require('../lib/hostController');

var searchApi = express.Router();

searchApi.route('/:host').get(function (req, res, next) {
    if (!req.query.q) {
        res.status(400).send("Query parameter is missing");
        return;
    }
    hostController.search(req.params.host, req.query.q)
        .then(function (oData) {
            res.send(oData);
        })
        .catch(next);
});

module.exports = searchApi;