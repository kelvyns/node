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

function jsonError(errCode, descrition) {
   
    var jsonError = {};
    jsonError.code = errCode;
    jsonError.status = 'err';
    if(descrition) {
    	jsonError.description = descrition;
    }else {
    	jsonError.description = error.genericUnexpectedError;
    }
    return jsonError;
}

error.code = [];
// Data base
error.code['100101'] = 'Cannot connect to Database server';
error.code['100103'] = 'Cannot make to select in BD';
error.code['100104'] = 'Cannot insert the register in BD';

// api league
error.code['100200'] = 'Error to connect with api league';
error.code['100201'] = 'Cannot gets the list of teams from the api league';
error.code['100202'] = 'Cannot insert the list of teams in database';
error.code['100203'] = 'Cannot gets the list of teams from the database';
error.code['100204'] = 'Cannot gets the list of teams from the fuction insertTeam';
error.code['100205'] = 'Invalid data from api league for getTeam';
error.code['100206'] = 'Invalid data from api league for getRoster';
error.code['100207'] = 'Cannot gets the list of roster from the api league';
error.code['100208'] = 'Cannot insert the list of first player in database';
error.code['100209'] = 'Cannot gets the list of rosters from the fuction insertPrimaryPlayer';
error.code['100210'] = 'Cannot insert the list of first player in database';
error.code['100211'] = 'Cannot gets the list of first player from the database';

// api local
error.code['100300'] = 'Error to connect with api local';
error.code['100301'] = 'Invalid data from api local for registerRoster';
error.code['100302'] = 'Cannot gets the list of teams from the api local';

error.genericInternalError = 'An internal error occurred, please contact the administrator';
error.genericConecctionError = 'We have some problems with the conection, please try again later';
error.genericUnexpectedError = 'An unexpected error has occurred, please try again later';
error.jsonDefault = {};
error.jsonDefault.status = "err";
error.jsonDefault.mesage = "An unexpected error has occurred"; 



error.registerInBD = registerInBD;
error.sendMail = sendMail;
error.jsonError = jsonError;
module.exports = error;
