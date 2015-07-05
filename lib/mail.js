var nodemailer = require('nodemailer');
var config = require('../lib/config');
var error = require('../models/error');

// Create a SMTP transporter object
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport({
    service: config.mail_smtp_transport_service, //"Gmail",
    auth: {
        user: config.mail_smtp_transport_auth_user,
        pass: config.mail_smtp_transport_auth_pass
    }
});

var mail = {};

mail.sendError = function (err, errCode, otherDescription) {
    console.log("Error, Error code: "+ errCode);
    console.log("Error, Description: "+ error.code [errCode] );
    var desc = error.code [errCode];
    if(otherDescription) {
        desc = desc +". "+ otherDescription;
        console.log("Error, More description: "+ otherDescription );
    }
    var jsonError = "";
    if(err) {
        jsonError = "<b>Error, JsonError:<b/> <br><br>"+ JSON.stringify(err);
        console.log(jsonError );
    }
    console.log("Senting mail with the error...");

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: config.mail_error_from, // sender address
        to: config.mail_error_to, // list of receivers kelvyns.aguilar1@gmail.com, robert.reimi@gmail.com
        subject: "Error Fantasy updater api", // Subject line
        html: "<b>Error code:</b> <br><br>" + errCode+ "<br><br><br> <b>Description:</b> <br><br>" + desc + "<br><br>" + jsonError
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{

            console.log("Message sent: " + JSON.stringify(response));
        }
    });

};

module.exports = mail;