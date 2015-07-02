var request = require('request');
// My own libraries
var config = require('../lib/config');
var error = require('../lib/error');

var apiLocal = {};
apiLocal.urls = [];
apiLocal.urls['base'] = config.local_api_url;

apiLocal.urls['registerInitialRoster'] = 'registerInitialRoster' ;
apiLocal.urls['updatePicher'] = 'updatePicher' ;
apiLocal.urls['updatePlayer'] = 'updatePlayer' ;
apiLocal.urls['registerTeam'] = 'registerTeam';


apiLocal.accessToken = 'myTokenLocal';
var requestLocal = request.defaults({
    baseUrl: apiLocal.urls['base'],
    method: 'GET'
});

apiLocal.getUrl = function(urlName, params) {
    var url = apiLocal.urls[urlName] + '?access_token=' + apiLocal.accessToken;
    if(params) {
    	for (var key in params) {
	        url += '&'+key+'='+params[key];
	    }
    }
    return url;
};

apiLocal.getTeams = function(callback) {
	var url = apiLocal.getUrl('registerTeam');
    requestLocal(url, function(err, response, body) {
        
        //TODO handle 500, 401, 403 etc
        if (err || response.statusCode != 200) {
            //TODO return error
            // error code, moreDescription, data
            error.registerInBD(err, '100300', 'Error, registerRoster with idTeam:'+ idTeam);
            callback(err, null);
        } else {
            var data = JSON.parse(body);
            if (!data){
            	error.registerInBD(error.jsonDefault, '100301', error.genericUnexpectedError);
            	callback(error.jsonDefault, null);
            } else {
            	callback(null, data.teams);
            }
        }
    });
};

module.exports = apiLocal;
