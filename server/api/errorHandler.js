const ApplicationError = require('../lib/ApplicationError.js');

module.exports = function (err, req, res) {
    if (err instanceof ApplicationError) {
        return res.status(err.status).send(err.message);
    }
    return res.status(500).send('Internal Server Error!');
};