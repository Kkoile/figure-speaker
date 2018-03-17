/*eslint no-console: 0*/
"use strict";

var winston = require('winston');

var url = require('url');
var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/settings/', require('./api/settingsApi'));
app.use('/search/', require('./api/searchApi'));

app.use(require('./api/errorHandler'));

app.use(express.static('public'));

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

require('./lib/rfidConnection');

var mopidy = require('./lib/mopidy');
mopidy.start().then(function () {
    console.log("Mopidy started");
});
var signals = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
signals.forEach(function (sSignal) {
    process.on(sSignal, function () {
        mopidy.stop().then(function () {
            process.exit(0);
        });
    });
});
