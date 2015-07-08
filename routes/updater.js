var express = require('express');
var request = require('request');

var async = require('async'); // estudiar para sacarla
var Promise = require('bluebird');
// My own libraries

var error = require('../models/error');
var apiQB = require('../lib/apiQB');
var apiLocal = require('../lib/apiLocal');

var teamModel = require('../models/team');
var playerModel = require('../models/player');
var gameModel = require('../models/game');

var router = express.Router();

Promise.promisifyAll(apiQB);

Promise.promisifyAll(apiLocal);

router.get('/registerGame', function(req, res, next) {
	
	var season = req.query.season; // 2014
    var period = req.query.period; // (Periodo : TR, RR , F)
    var date = req.query.date; // fecha=2014-10-09
	apiQB.getCalendar(season, period, date, function(err, games) {
		if(err){
        	res.json(error.jsonError('100400'));
        }else {
        	//res.json({"code" : 200, "status" : "Success Game", "Games" : games});
        	
        	gameModel.saveAll( games , function(err, rows) {
                if(err){
                	res.json(error.jsonError('100400'));
                }else {
                	gameModel.getAll(date, function(err, allGames) {
                        if(err){// TODO add error
                            res.json(error.jsonError('100401'));
                        }else {
                            res.json({"code" : 200, "status" : "Success Game", "Games" : allGames});
                        }
                    });

                };
        	});
        }
		
	});
   
});

router.get('/registerTeam', function(req, res, next) {
    var teams = [];
    for (var i = 1; i < 9; ++i) {
        teams.push(apiQB.getTeamAsync(i));
    }
    Promise.all(teams).then(function(teams) {
    	teamModel.saveAll( teams ,function(err, rows) {
            if(err){
            	res.json(error.jsonError('100202'));
            }else {
            	teamModel.getAll(function(err, teams) {
                    if(err){
                        res.json(error.jsonError('100203'));
                    }else {
                        res.json({"code" : 200, "status" : "Success Team", "teams" : teams});
                    }
                });

            };
        });
    }).catch(function(e) {
    	res.json(error.jsonError('100201', error.genericConecctionError));
    });
});

router.get('/registerInitialRoster', function(req, res, next) {
	
	var rosters = [];
    var season = req.query.season; // 2014
    var period = req.query.period; //  (Periodo : TR, RR , F)
	apiLocal.getTeams(function (err, teams) {
		if(err) {
			error.registerInBD(err, '100302');
            res.json(error.jsonError('100302'));
		}else {

			for (var i = 0; i < teams.length; ++i) {
				rosters.push(apiQB.getRosterAsync(teams[i].id, season, period, i));
			}
			Promise.all(rosters).then(function(rosters) {
				playerModel.saveByRoster(rosters,function(err, rows) {
			        if(err){
			        	res.json(error.jsonError('100210'));
			        }else {
			        	playerModel.getAll( function(err, allPlayers) {
			        		res.json(allPlayers);
			        	});
			        }
			        //res.json({"code" : 200, "status" : "Success rosters", "rosters" : rosters});
			    });
		    }).catch(function(e) {
		    	res.json(error.jsonError('100207', error.genericConecctionError));
		    });
		}
	    
	} );
    
});

router.get('/updatePicher', function(req, res, next) {
	// Get all Picher
	playerModel.getAllPicher(function(err, pichers) {//and id_team=4"
        if(err){
           res.json(error.jsonError('100211'));//TODO agregar error
        }else {
            var arrPichers = [];
            
            for (var i = 0; i < pichers.length; ++i) {
            	arrPichers.push(apiQB.getPicherAsync(pichers[i].id, i));
			}
			Promise.all(arrPichers).then(function(arrPichers) {
				//res.json(arrPichers);
				playerModel.saveAll(arrPichers, true, function(err){ 
                    if( err ) {
                    	res.json(error.jsonError('100211'));//TODO agregar error
                    } else {
                    	//res.json(arrPlayers);
                    	res.json({"Pichers" : arrPichers, "total" : arrPichers.length});
                    }
                });
				
		    }).catch(function(e) {
		    	res.json(error.jsonError('100207', error.genericConecctionError));//TODO controlar error
		    });

        }
    });
});

router.get('/updatePlayer', function(req, res, next) {
	// Get all Player
	playerModel.getAllWithoutPicher( function(err, players) {//and id_team=4"
        if(err){
            error.registerInBD(err, '100211');//TODO agregar error
            res.json(error.jsonError('100211'));//TODO agregar error
        }else {
            
        	console.log("Cantidad players en BD: " + players.length);
        	var arrPlayers = [];
            
            for (var i = 0; i < players.length; ++i) {
            	arrPlayers.push(apiQB.getPlayerAsync(players[i].id, i));
			}
            
			Promise.all(arrPlayers).then(function(arrPlayers) {
				playerModel.saveAll(arrPlayers, false, function(err , rows){ //
                    if( err ) {
                    	res.json(error.jsonError('100211'));//TODO agregar error
                    } else {
                    	res.json({"players" : arrPlayers, "total" : arrPlayers.length});
                    }
                });
                
		    }).catch(function(e) {
		    	res.json(error.jsonError('100207', error.genericConecctionError));//TODO controlar error
		    });

        }
    });
});

var request = request.defaults({
    baseUrl: apiLocal.urls['base'],
    method: 'GET'
});
/* GET teams listing. (simplified callback hell) */
router.get('/init', function(req, res, next) {

	var season = req.query.season; // 2014
	var period = req.query.period; //  (Periodo : TR, RR , F)
	request(apiLocal.getUrl('registerInitialRoster',  { 'season': season, 'period': period }), function(err, response, rosters) {
        //console.log(response.statusCode);
        //TODO handle 500, 401, 403 etc
        if (err || response.statusCode != 200) {
            //TODO return error
            // error code, moreDescription, data
            error.registerInBD(err, '100200', 'Error,dasasdasdasdasd ');
            callback(err, null);
        } else {
        	//res.json({"code" : 200, "status" : "Success rosters", "rosters" : rosters});
        	request(apiLocal.getUrl('updatePicher'), function(err, response, pichers) {
                //console.log(response.statusCode);
                //TODO handle 500, 401, 403 etc
                if (err || response.statusCode != 200) {
                    //TODO return error
                    // error code, moreDescription, data
                	 error.registerInBD(err, '100200', 'Error,dasasdasdasdasd ');
                    callback(err, null);
                } else {
                	request(apiLocal.getUrl('updatePlayer'), function(err, response, players) {
                        //console.log(response.statusCode);
                        //TODO handle 500, 401, 403 etc
                        if (err || response.statusCode != 200) {
                        	 error.registerInBD(err, '100200', 'Error,dasasdasdasdasd ');
                            callback(err, null);
                        } else {
                        	rosters = JSON.parse(rosters);
                        	pichers = JSON.parse(pichers);
                        	players = JSON.parse(players);
                        	res.json({"code" : response.statusCode,
                        			  "status" : "Success",
                        			  "total rosters" : rosters.length,
                        			  "total pichers" : pichers.length,
                        			  "total players" : players.length,
                        		      "rosters" : rosters, 
                        		      "pichers" : pichers,
                        		      "players" : players});
                        }
                    });
                }
            });
            
        }
    });
});

module.exports = router;
