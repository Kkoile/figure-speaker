"use strict";

function ApplicationError(message, status) {
    this.message = message || "Application error";
    this.status = status || 500;
}
ApplicationError.prototype = Object.create(Error.prototype);

module.exports = ApplicationError;