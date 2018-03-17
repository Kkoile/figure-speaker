if (process.env.USER === 'pi') {
    module.exports = require('./rfidRC522Connection');
} else {
    module.exports = require('./rfidUSBConnection');
}