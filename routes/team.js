var express = require('express');
var request = require('request');
var dateformat = require('dateformat');
var async = require('async');
var Promise = require('bluebird');
// My own libraries
var db = require('../lib/db');
var util = require('../util/util');
var error = require('../control_error/error');
var teamModel = require('../models/team');

var router = express.Router();

var apiQB = {};
apiQB.urls = [];
//apiQB.urls['base'] = 'http://api.qualitysports.com.ve/api/';
apiQB.urls['base'] = 'http://10.181.4.89:3000/api/mock/';
apiQB.urls['teams'] = 'equipo' ;
apiQB.urls['roster'] = 'roster' ;
apiQB.accessToken = '45eadc85b650776e48bdf666120d0fbc';
var request = request.defaults({
    baseUrl: apiQB.urls['base'],
    method: 'GET'
});

var apiLocal = {};
apiLocal.urls = [];
apiLocal.urls['base'] = 'http://10.181.4.89:3000/team/';
apiLocal.urls['registerTeam'] = 'registerTeam' ;

apiLocal.accessToken = 'myTokenLocal';
var requestLocal = request.defaults({
    baseUrl: apiLocal.urls['base'],
    method: 'GET'
});


var dataBase = {};

apiQB.getUrl = function(urlName, params) {
    var url = apiQB.urls[urlName] + '?access_token=' + apiQB.accessToken;
    for (var key in params) {
        url += '&'+key+'='+params[key];
    }
    return url;
};

apiLocal.getUrl = function(urlName, params) {
    var url = apiLocal.urls[urlName] + '?access_token=' + apiLocal.accessToken;
    if(params) {
    	for (var key in params) {
	        url += '&'+key+'='+params[key];
	    }
    }
    return url;
};

apiQB.getTeam = function(idTeam, callback) {
    var url = apiQB.getUrl('teams', { 'id_equipo': idTeam });
    request(url, function(err, response, body) {
        //console.log(response.statusCode);
        //TODO handle 500, 401, 403 etc
        if (response.statusCode != 200) {
            //TODO return error
            // error code, moreDescription, data
            error.registerInBD(err, '100200', 'Error, getTeam with idTeam:'+ idTeam);
            callback(err, null);
        } else {
            var teamData = JSON.parse(body);
            if (!teamData.data){
            	error.registerInBD(error.jsonDefault, '100205', error.genericUnexpectedError);
            	callback(error.jsonDefault, null);
            } else {
                callback(null, teamData.data.rows);
            }
        }
    });
};

apiQB.getRoster = function(idTeam, callback) {
    var url = apiQB.getUrl('roster', { 'id_equipo': idTeam });
    //console.log(url);
    request(url, function(err, response, body) {
        //console.log(response.statusCode);
        //TODO handle 500, 401, 403 etc
        if (response.statusCode != 200) {
            //TODO return error
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
                callback(null, rosterData.data.rows);
            }
        }
    });
};

apiLocal.getTeams = function(callback) {
	var url = apiLocal.getUrl('registerTeam');
    requestLocal(url, function(err, response, body) {
        //console.log(response.statusCode);
        //TODO handle 500, 401, 403 etc
        if (response.statusCode != 200) {
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

dataBase.insertTeam = function(teams, callback) {
	var allValues = [];
    var data = null;
    var date = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");

    if(teams!=null && teams != undefined && teams.length == 8) {
        for (var i = 0; i < teams.length; ++i) {
            data =  teams[i];
            allValues.push(
                "(" +
                parseInt(data.id_equipo) + "," +
                "'" + data.nombre_equipo  + "'" + "," +
                "'" + data.nombre_completo  + "'" + "," +
                "'" + data.nick_equipo  + "'" + "," +
                "'" + data.ciudad  + "'" + "," +
                "'" + data.sede  + "'" + "," +
                parseInt(data.sede_capacidad.replace(".","")) + "," +
                "'" + data.manager  + "'" + "," +
                "'" + date + "'" +
                ")"
            );
        }

        var table = "TEAM";
        var columns = "id,name,full_name,nick,city,stadium,stadium_capacity,manager,last_updated";
        var columnsUpdate = "name,full_name,nick,city,stadium,stadium_capacity,manager,last_updated";
        var sql = util.massiveInsertFormat(table,columns,columnsUpdate,allValues);
        db.query(sql, function(err, rows){
           if(err){
               error.registerInBD(err, '100202');
               if(err)
               callback(err, null);
           }else {
               callback(null, rows);
           }


        });
    }else {
       error.registerInBD(error.jsonDefault, '100204', error.genericUnexpectedError);
       callback(error.jsonDefault, null);
    }
};

dataBase.insertPrimaryPlayer = function(rosters, callback) {
	
	if(rosters!=null && rosters != undefined && rosters.length == 8) {
		var players= [];
		
		// Get the list of player from  each roster team
		var total = 0;
		for (var i = 0; i < rosters.length; ++i) {
			var cant = 0;
			console.log('equipo: ' + rosters[i].id_equipo);
			 if(rosters[i].pitchers){
				var pichers = rosters[i].pitchers;
				console.log(' pichers.length: ' +  pichers.length);
				cant = cant + pichers.length;
				for (var p = 0; p < pichers.length; ++p) {
					var picher = pichers[p];
					picher.position_id = 1;
					picher.id_equipo = rosters[i].id_equipo;
					players.push(picher);
				}
			 }
			 if(rosters[i].catchers){
				var catchers = rosters[i].catchers;
				console.log(' catchers.length: ' +  catchers.length);
				cant = cant + catchers.length;
				for (var c = 0; c < catchers.length; ++c) {
					var catcher = catchers[c];
					catcher.position_id = 2;
					catcher.id_equipo = rosters[i].id_equipo;
					players.push(catcher);	
				}
			 }
			 if(rosters[i].infielders){
				 var infielders = rosters[i].infielders;
				 console.log(' infielders.length: ' +  infielders.length);
				 cant = cant + infielders.length;
				 for (var inf = 0; inf < infielders.length; ++inf) {
					var infielder = infielders[inf];
					infielder.position_id = 0;
					infielder.id_equipo = rosters[i].id_equipo;
					players.push(infielder);	
				 }
			 }
			 if(rosters[i].outfielders){
				 var outfielders = rosters[i].outfielders;
				 console.log(' outfielders.length: ' +  outfielders.length);
				 cant = cant + outfielders.length;
				 for (var out = 0; out < outfielders.length; ++out) {
					 var outfielder = outfielders[out];
					 outfielder.position_id = 0;
					 outfielder.id_equipo = rosters[i].id_equipo;
					 players.push(outfielder);	
				 }
			 }
			 console.log("cantidad total de jugadores por equipo: "+ cant );
			 total = total + cant;
		}
		console.log("cantidad global de jugadores: "+ total );
		var allValues = [];
	    var data = null;
	    var date = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");

	    console.log("cantidad de jugadores a insertar:" + players.length);
        for (var i = 0; i < players.length; ++i) {
            data =  players[i];
            allValues.push(
                "(" +
                parseInt(data.id_jugador) + "," +
                "'" + data.nombre  + "'" + "," +
                "'" + data.apellido  + "'" + "," +
                parseInt(data.id_equipo) + "," +
                parseInt(data.position_id) + "," +
                parseInt(data.numero_franela) + "," +
                "'" + data.lugar_nacimiento  + "'" + "," +
                "'" + date + "'" +
                ")"
            );
        }
        console.log("cantidad de jugadores a insertar allValues:" + allValues.length);
        var table = "PLAYER";
        var columns = "id,first_name,last_name,id_team,position_id,number,birth_place,last_updated";
        var columnsUpdate = "first_name,last_name,id_team,position_id,number,birth_place,last_updated";
        var sql = util.massiveInsertFormat(table,columns,columnsUpdate,allValues);
        db.query(sql, function(err, rows){
           if(err){
               error.registerInBD(err, '100208');
               if(err)
               callback(err, null);
           }else {
               callback(null, rows);
           }


        });
    } else {
       error.registerInBD(error.jsonDefault, '100209', error.genericUnexpectedError);
       callback(error.jsonDefault, null);
    }
};

Promise.promisifyAll(apiQB);

router.get('/registerTeam', function(req, res, next) {
    var teams = [];
    for (var i = 1; i < 9; ++i) {
        teams.push(apiQB.getTeamAsync(i));
    }
    Promise.all(teams).then(function(teams) {
    	dataBase.insertTeam(teams,function(err, rows) {
            if(err){
            	res.json(error.jsonError('100202'));
            }else {
                db.getAll(db.table.team, function(err, teams) {
                    if(err){
                        error.registerInBD(err, '100203');
                        res.json(error.jsonError('100203'));
                    }else {
                        res.json({"code" : 0, "status" : "Success Team", "teams" : teams});
                    }
                });

            }
        });
    }).catch(function(e) {
    	res.json(error.jsonError('100201', error.genericConecctionError));
    });
});

Promise.promisifyAll(apiLocal);

router.get('/registerRoster', function(req, res, next) {
	
	var rosters = [];
	
	apiLocal.getTeams(function (err, teams) {
		if(err) {
			error.registerInBD(err, '100302');
            res.json(error.jsonError('100302'));
		}else {
			for (var i = 0; i < teams.length; ++i) {
				rosters.push(apiQB.getRosterAsync(teams[i].id));
			}
			Promise.all(rosters).then(function(rosters) {
				
				dataBase.insertPrimaryPlayer(rosters,function(err, rows) {
		            if(err){
		            	res.json(error.jsonError('100210'));
		            }else {
		            	// Get all Pitcher
		            	db.getAllByCondition(db.table.player, " position_id=1 ", function(err, pichers) {
		                    if(err){
		                        error.registerInBD(err, '100211');
		                        res.json(error.jsonError('100211'));
		                    }else {
		                    	console.log("Cantidad jugadores BD: " + pichers.length);
		                        // res.json({"code" : 0, "status" : "Success pichers", "pichers" : pichers, "total" : pichers.length});
		                    	// Get all Players
				            	db.getAllByCondition(db.table.player, " position_id<>1 ", function(err, players) {
				                    if(err){
				                        error.registerInBD(err, '100211');
				                        res.json(error.jsonError('100211'));
				                    }else {
				                    	console.log("Cantidad jugadores BD: " + players.length);
				                        res.json({"code" : 0, "status" : "Success", 
				                        	"players" : players, "total players" : players.length,
				                        	"pichers" : pichers, "total pichers" : pichers.length});
				                    }
				                });
		                        
		                    }
		                });
		            	/*
		                db.getAll(db.table.player, function(err, pichers) {
		                    if(err){
		                        error.registerInBD(err, '100211');
		                        res.json(error.jsonError('100211'));
		                    }else {
		                    	console.log("Cantidad jugadores BD: " + players.length);
		                        res.json({"code" : 0, "status" : "Success players", "players" : players});
		                    }
		                });
		            	*/	
		            }
		        });
			  //res.json({"code" : 0, "status" : "Success rosters", "rosters" : rosters});
		       
		    }).catch(function(e) {
		    	res.json(error.jsonError('100207', error.genericConecctionError));
		    });
		}
	    
	} );
    
});


module.exports = router;
