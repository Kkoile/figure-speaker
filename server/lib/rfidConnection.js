if (process.env.USER === 'root') {
    module.exports = require('./rfidRC522Connection');
} else {
    module.exports = require('./rfidUSBConnection');
}