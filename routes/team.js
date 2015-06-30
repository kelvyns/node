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
apiQB.urls['base'] = 'http://api.qualitysports.com.ve/api/';
//apiQB.urls['base'] = 'http://10.181.4.89:3000/api/mock/';
apiQB.urls['teams'] = 'equipo' ;
apiQB.urls['roster'] = 'roster' ;
apiQB.urls['player'] = 'biopelotero' ;
apiQB.urls['picher'] = 'biolanzador' ;
apiQB.accessToken = '45eadc85b650776e48bdf666120d0fbc';
var request = request.defaults({
    baseUrl: apiQB.urls['base'],
    method: 'GET'
});

var apiLocal = {};
apiLocal.urls = [];
//apiLocal.urls['base'] = 'http://10.181.4.89:3000/team/';
apiLocal.urls['base'] = 'http://127.0.0.1:3000/team/';
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

apiQB.getRoster = function(idTeam, season, period, callback) {
    var url = apiQB.getUrl('roster', { 'id_equipo': idTeam, 'temporada':season, 'periodo':period });
    console.log(url);
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

apiQB.getPlayer = function(idPlayer, callback) {
    var url = apiQB.getUrl('player', { 'id_jugador': idPlayer });
    console.log(url);
    request(url, function(err, response, body) {
        console.log(JSON.stringify(response));
        //TODO handle 500, 401, 403 etc
        if (response.statusCode != 200) {
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
                //console.log(player[0].id_jugador);
                callback(null, player[0]);
            }
        }
    });
};

apiQB.getPicher = function(idPlayer, callback) {
    var url = apiQB.getUrl('picher', { 'id_jugador': idPlayer });
    console.log(url);
    request(url, function(err, response, body) {
    	// console.log(JSON.stringify(response));
        //console.log(response.statusCode);
        //TODO handle 500, 401, 403 etc
        if (response.statusCode != 200) {
            //TODO return error
            // error code, moreDescription, data
            error.registerInBD(err, '100214', 'Error, getPicher with idPlayer:'+ idPlayer);
            callback(err, null);
        } else {
            var picherData = JSON.parse(body);
            if (!picherData.data){
                error.registerInBD(error.jsonDefault, '100215', error.genericUnexpectedError);
                callback(error.jsonDefault, null);
            } else {
                var picher = picherData.data.rows;
                //console.log(picher[0].id_jugador);
                callback(null, picher[0]);
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

dataBase.insertSecondaryPlayer = function(players, callback) {
	
	if(players!=null && players != undefined) {
		
		var allValues = [];
	    var data = null;
	    var date = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");

	    console.log("cantidad de jugadores a insertar:" + players.length);
        for (var i = 0; i < players.length; ++i) {
            data =  players[i];
            var position_id = 0;
            if('P' == data.posicion ) {
            	position_id = 1;
            }else {
            	position_id = parseInt(data.posicion_id);
            }
            allValues.push(
                "(" +
                parseInt(data.id_jugador) + "," +
                "'" + data.nombre  + "'" + "," +
                "'" + data.apellido  + "'" + "," +
                parseInt(data.id_equipo) + "," +
                "'" + data.posicion  + "'" + "," +
                position_id + "," +
                "'" + data.mano_campo  + "'" + "," +
                "'" + data.mano_bateo  + "'" + "," +
                parseInt(data.numero_franela) + "," +
                "'" + data.lugar_nacimiento  + "'" + "," +
                "'" + data.pais_nacimiento  + "'" + "," +
                "'" + date + "'" +
                ")"
            );
        }
        console.log("cantidad de jugadores a insertar allValues:" + allValues.length);
        var table = "PLAYER";
        var columns = "id,first_name,last_name,id_team,position, position_id, throwing_hand, batting_hand,number,birth_place, birth_country,last_updated";
        var columnsUpdate = "id_team,position, position_id, throwing_hand, batting_hand,number,birth_country,last_updated";
        var sql = util.massiveInsertFormat(table,columns,columnsUpdate,allValues);
        console.log("sql:" + sql);
        db.query(sql, function(err, rows){
           if(err){
               error.registerInBD(err, '100208');//TODO agregar error
               if(err)
               callback(err, null);
           }else {
               callback(null, rows);
           }


        });
    } else {
       error.registerInBD(error.jsonDefault, '100209', error.genericUnexpectedError);//TODO agregar error
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
    var season = req.query.season; // 2014
    var period = req.query.period; //  (Periodo : TR, RR , F)
	apiLocal.getTeams(function (err, teams) {
		if(err) {
			error.registerInBD(err, '100302');
            res.json(error.jsonError('100302'));
		}else {

			for (var i = 0; i < teams.length; ++i) {
				rosters.push(apiQB.getRosterAsync(teams[i].id, season, period ));
			}
			Promise.all(rosters).then(function(rosters) {
				dataBase.insertPrimaryPlayer(rosters,function(err, rows) {
			        if(err){
			        	res.json(error.jsonError('100210'));
			        }else {
			        	db.getAll(db.table.player, function(err, allPlayers) {
			        		res.json(allPlayers);
			        	});
			        	
			        }
			        //res.json({"code" : 0, "status" : "Success rosters", "rosters" : rosters});
			    });
		    }).catch(function(e) {
		    	res.json(error.jsonError('100207', error.genericConecctionError));
		    });
		}
	    
	} );
    
});

router.get('/insertPicher', function(req, res, next) {
	// Get all Pitcher
	db.getAllByCondition(db.table.player, " position_id=1 ", function(err, pichers) {//and id_team=4"
        if(err){
            error.registerInBD(err, '100211');//TODO agregar error
            res.json(error.jsonError('100211'));//TODO agregar error
        }else {
            
        	console.log("Cantidad picheres en BD: " + pichers.length);
            //res.json({"code" : 0, "status" : "Success pichers", "pichers" : pichers, "total" : pichers.length});
        	
        	var arrPichers = [];
            var idPichers = [];
            
            for (var i = 0; i < pichers.length; ++i) {
            	idPichers.push(pichers[i].id);
			}

            //Parallel calls, for each team id call the api
            async.each(idPichers, function(id, callback) {
                apiQB.getPicher(id, function(error, picher) {
                    //TODO handle error
                	arrPichers.push(picher);
                    callback(); //callback is required in order to let each no this iteration is finished
                })
            }, function(err){ //this function is called when all the previous call are completed
                if( err ) {
                	error.registerInBD(err, '100211');//TODO agregar error
                    res.json(error.jsonError('100211'));//TODO agregar error
                } else {
                	//res.json(arrPichers);
                	dataBase.insertSecondaryPlayer(arrPichers, function(err){ //this function is called when all the previous call are completed
                        if( err ) {
                        	error.registerInBD(err, '100211');//TODO agregar error
                            res.json(error.jsonError('100211'));//TODO agregar error
                        } else {
                        	//res.json(arrPichers);
                        	res.json({"pichers" : arrPichers, "total" : arrPichers.length});
                        }
                    });
                	//res.json({"pichers" : arrPichers, "total" : arrPichers.length});
                }
                
            });
        }
    });
});

router.get('/insertPlayer', function(req, res, next) {
	// Get all Pitcher
	db.getAllByCondition(db.table.player, " position_id<>1 ", function(err, players) {//and id_team=4"
        if(err){
            error.registerInBD(err, '100211');//TODO agregar error
            res.json(error.jsonError('100211'));//TODO agregar error
        }else {
            
        	console.log("Cantidad players en BD: " + players.length);
        	var arrPlayers = [];
            var idPlayers = [];
            
            for (var i = 0; i < players.length; ++i) {
            	idPlayers.push(players[i].id);
			}

            //Parallel calls, for each team id call the api
            async.each(idPlayers, function(id, callback) {
                apiQB.getPlayer(id, function(error, player) {
                    //TODO handle error
                	arrPlayers.push(player);
                    callback(); //callback is required in order to let each no this iteration is finished
                })
            }, function(err){ //this function is called when all the previous call are completed
                if( err ) {
                	error.registerInBD(err, '100211');//TODO agregar error
                    res.json(error.jsonError('100211'));//TODO agregar error
                } else {
                	//res.json(arrPlayers);
                	dataBase.insertSecondaryPlayer(arrPlayers, function(err){ //this function is called when all the previous call are completed
                        if( err ) {
                        	error.registerInBD(err, '100211');//TODO agregar error
                            res.json(error.jsonError('100211'));//TODO agregar error
                        } else {
                        	//res.json(arrPlayers);
                        	res.json({"players" : arrPlayers, "total" : arrPlayers.length});
                        }
                    });
                	//res.json({"pichers" : arrPichers, "total" : arrPichers.length});
                }
                
            });
        }
    });
});


module.exports = router;

