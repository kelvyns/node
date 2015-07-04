var mail = {};

mail.send = function (err, errCode, otherDescription) {
    //TODO we should be register error in database for critical error
    console.log("Error, Error code: "+ errCode);
    console.log("Error, Description: "+ error.code [errCode] );
    if(otherDescription) {
        console.log("Error, More description: "+ otherDescription );
    }
    if(err) {
        jsonError = JSON.stringify(err);
        console.log("Error, JsonError: "+ jsonError );
    }
    console.log("Error, Senting mail with the error");

};

module.exports = mail;