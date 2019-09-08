/*eslint no-console: 0*/
"use strict";

var winston = require('winston');

var url = require('url');
var path = require('path');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,api-auth-token');

    next();
});

app.use('/settings/', require('./api/settingsApi'));
app.use('/data/', require('./api/dataApi'));

app.use(require('./api/errorHandler'));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('/', function (req, res) {
    res.redirect('/index.html');
});

app.post('/logLevel', function (req, res) {
    var query = url.parse(req.url, true).query,
        sLevel = query.level;
    if (!sLevel) {
        res.status(400).send("A log level has to be provided through a query parameter like ?level='debug'");
        return;
    }
    winston.level = sLevel;
    winston.info("Log level set to ", sLevel);
    res.send("Successfully set log level to " + sLevel);
});

var port = process.env.PORT || 3000;
var listener = app.listen(port, function () {
    winston.info('Figure Speaker HTTP server up and running, listening on port ' + listener.address().port);
});

module.exports = listener;

var rfidConnection;
try {
    rfidConnection = require('./lib/rfidConnection');
    rfidConnection.init();
} catch (oError) {
    winston.error("Could not initialized RFID Connection.", oError);
}

var buttonController = require('./lib/buttonController');
buttonController.init();

//NOTE: Can be removed after it is ensured that all clients have at least version 1.0.3 installed
require('./lib/migrationController').moveSpotifyCountryConfigFromMopidyToGeneralConfig();
/*
var mopidy = require('./lib/mopidy');
mopidy.start();

var signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(function (sSignal) {
    process.on(sSignal, function () {
        rfidConnection && rfidConnection.stop();
        buttonController.stop();
        mopidy.stop().then(function () {
            process.exit(0);
        });
    });
});
*/