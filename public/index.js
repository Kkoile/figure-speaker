"use strict";

var sTenantId;

$(document).ready(function () {
    // $('#url-input').bind('keypress', function (oEvent) {
    //     var iKey = oEvent.which || oEvent.keyCode;
    //     if (iKey === 13) {
    //         getTenantId();
    //     }
    // });
    // $('#email-input').bind('keypress', function (oEvent) {
    //     var iKey = oEvent.which || oEvent.keyCode;
    //     if (iKey === 13) {
    //         cleanUser();
    //     }
    // });
});

function saveCredentials() {
    var sEmail = $("#email-input").val();
    var sPassword = $("#password-input").val()
    var sClientId = $("#clientid-input").val();
    var sClientSecret = $("#clientsecret-input").val();
    $.post('/settings/saveCredentials', {
        email: sEmail,
        password: sPassword,
        clientId: sClientId,
        clientSecret: sClientSecret
    });
}