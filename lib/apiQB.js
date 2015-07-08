var request = require('request');
// My own libraries
var config = require('../lib/config');
var error = require('../models/error');
var async = require('async'); //TODO estudiar para sacarla
var apiQB = {};
apiQB.urls = [];
apiQB.urls['base'] = config.remote_api_url;
apiQB.urls['teams'] = 'equipo' ;
apiQB.urls['roster'] = 'roster' ;
apiQB.urls['player'] = 'biopelotero' ;
apiQB.urls['picher'] = 'biolanzador' ;
apiQB.urls['calendar'] = 'calendario' ;
apiQB.accessToken = config.token;

var request = request.defaults({
    baseUrl: apiQB.urls['base'],
    method: 'GET'
});

apiQB.getUrl = function(urlName, params) {
    var url = apiQB.urls[urlName] + '?access_token=' + apiQB.accessToken;
    for (var key in params) {
        url += '&'+key+'='+params[key];
    }
    return url;
};
apiQB.getTeam = function(idTeam, callback) {
    var url = apiQB.getUrl('teams', { 'id_equipo': idTeam });
    //console.log(url);
    request(url, function(err, response, body) {
        if (err || (response && response.statusCode != 200)) {
        	error.registerInBD(err, '100200', 'Error, getTeam with idTeam:'+ idTeam);
            callback(err, null);
        } else {
        	var teamData = JSON.parse(body);
           if (!teamData.data){
            	error.registerInBD(error.jsonDefault, '100205', error.genericUnexpectedError);
            	callback(error.jsonDefault, null);
            } else {
            	 //console.log(teamData.data.rows);
                callback(null, teamData.data.rows);
            }
        }
    });
};

apiQB.getCalendar = function(season, period, date, callback) {
	var params;
	if( date ) {
		params = { 'temporada': season, 'periodo': period, 'fecha': date  };
	}else {
		params = { 'temporada': season, 'periodo': period  };
	}
	
    var url = apiQB.getUrl('calendar', params);
    console.log(url);
    request(url, function(err, response, body) {
        if (err || (response && response.statusCode != 200)) {
        	error.registerInBD(err, '100216', 'Error, getCalendar with season: '+ season + ' and period: '+ period);
            callback(err, null);
        } else {
        	var calendarData = JSON.parse(body);
           if (!calendarData.data){
            	error.registerInBD(error.jsonDefault, '100217', error.genericUnexpectedError);
            	callback(error.jsonDefault, null);
            } else {
            	 //console.log(teamData.data.rows);
                callback(null, calendarData.data.rows);
            }
        }
    });
};

apiQB.getRoster = function(idTeam, season, period, id, callback) {
	var timer = (config.roster_sleep*id);
    setTimeout(function () {  
        var url = apiQB.getUrl('roster', { 'id_equipo': idTeam, 'temporada':season, 'periodo':period });
        //console.log(url);	
	    request(url, function(err, response, body) {
	        //console.log(response.statusCode);
	        if (err || (response && response.statusCode != 200)) {
	            // error code, moreDescription, data
	            error.registerInBD(err, '100207', 'Error, getRoster with idTeam:'+ idTeam);
	            callback(err, null);
	        } else {
	            var rosterData = JSON.parse(body);
	            if (!rosterData.data){
	            	error.registerInBD(error.jsonDefault, '100206', error.genericUnexpectedError);
	            	callback(error.jsonDefault, null);
	            } else {
	            	var dataRows = rosterData.data.rows; 
	            	dataRows.id_equipo = idTeam;
	            	console.log("Get Roster, teamId:" + idTeam);
	            	callback(null, rosterData.data.rows);
	            }
	        }
	    });
    }, timer);
};

apiQB.getPlayer = function(idPlayer, id, callback) {
	var timer = (config.player_sleep*id);
    setTimeout(function () {
	    var url = apiQB.getUrl('player', { 'id_jugador': idPlayer });
	    //console.log(url);
	    request(url, function(err, response, body) {
	        //console.log(JSON.stringify(response));
	        //TODO handle 500, 401, 403 etc
	        if (err || (response && response.statusCode != 200)) {
	            //TODO return error
	            // error code, moreDescription, data
	            error.registerInBD(err, '100212', 'Error, getPlayer with idPlayer:'+ idPlayer);
	            callback(err, null);
	        } else {
	            var playerData = JSON.parse(body);
	            if (!playerData.data){
	                error.registerInBD(error.jsonDefault, '100213', error.genericUnexpectedError);
	                callback(error.jsonDefault, null);
	            } else {
	                var player = playerData.data.rows;
	                console.log("Get player: " + player[0].id_jugador);
	                callback(null, player[0]);
	            }
	        }
	    });
    }, timer);
};

apiQB.getPicher = function(idPlayer, id, callback) {
	var timer = (config.picher_sleep*id);
    setTimeout(function () {
	    var url = apiQB.getUrl('picher', { 'id_jugador': idPlayer });
	    //console.log(url);
	    request(url, function(err, response, body) {
	        //TODO handle 500, 401, 403 etc
	        if (err || (response && response.statusCode != 200)) {
	            error.registerInBD(err, '100214', 'Error, getPicher with idPlayer:'+ idPlayer);
	            callback(err, null);
	        } else {
	            var picherData = JSON.parse(body);
	            if (!picherData.data){
	                error.registerInBD(error.jsonDefault, '100215', error.genericUnexpectedError);
	                callback(error.jsonDefault, null);
	            } else {
	                var picher = picherData.data.rows;
	                console.log("Get picher: " + picher[0].id_jugador);
	                callback(null, picher[0]);
	            }
	        }
	    });
    }, timer);
};

module.exports = apiQB;
