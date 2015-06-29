var error = {};

function sendMail(err, errCode, otherDescription) {
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

}

function registerInBD(err, errCode, otherDescription) {
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
    console.log("Error, Creating register of error in DataBase");

}

function updateTeams(teams) {
    console.log(teams);
}

error.code = [];
error.code['100101'] = 'Cannot connect to Database server';
error.code['100103'] = 'Cannot make to select in BD';
error.code['100104'] = 'Cannot insert the register in BD';

error.code['100200'] = 'Error to connect with api league';
error.code['100201'] = 'Cannot gets the list of teams from the api league';
error.code['100202'] = 'Cannot insert the list of teams in database';
error.code['100203'] = 'Cannot gets the list of teams from the database';

error.genericInternalError = 'An internal error occurred, please contact the administrator';
error.genericConecctionError = 'We have some problems with the conection, please try again later';
error.genericUnexpectedError = 'An unexpected error has occurred, please try again later';

error.registerInBD = registerInBD;
error.sendMail = sendMail;
module.exports = error;