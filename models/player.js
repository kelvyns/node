//Model team
var db = require('../lib/db');
var error = require('./error');
var util = require('../lib/util');
var dateformat = require('dateformat');

var player = {};

player.table = "PLAYER";

player.getAll =  function(callback) {
	db.getAll(player.table, function(err, players) {
	    if(err){
	        error.registerInBD(err, '100203');
	        callback(err, null);
	    }else {
	    	callback(null, players);
	    }
	});
};

player.saveByRoster = function(rosters, callback) {
	
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
        var table = player.table;
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

player.saveAll = function(players, isPicher, callback) {
	
	if(players!=null && players != undefined) {
		
		var allValues = [];
	    var data = null;
	    var date = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");

	    console.log("cantidad de jugadores a insertar:" + players.length);
        for (var i = 0; i < players.length; ++i) {
            data =  players[i];
            var position_id = 0;
            if(isPicher) {
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
        var table = player.table;
        var columns = "id,first_name,last_name,id_team,position, position_id, throwing_hand, batting_hand,number,birth_place, birth_country,last_updated";
        var columnsUpdate = "id_team,position, position_id, throwing_hand, batting_hand,number,birth_country,last_updated";
        var sql = util.massiveInsertFormat(table,columns,columnsUpdate,allValues);
       // console.log("sql:" + sql);
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

player.getAllPicher = function (callback){
	db.getAllByCondition(player.table, " position_id=1 ", function(err, pichers) {//and id_team=4"
        if(err){
            error.registerInBD(err, '100211');//TODO agregar error
            callback(err, null);
        }else {
        	console.log("Cantidad pichers en BD: " + pichers.length);
        	callback(null, pichers);
        }
	});
};

player.getAllWithoutPicher = function (callback){
	db.getAllByCondition(player.table, " position_id<>1 ", function(err, players) {//and id_team=4"
        if(err){
            error.registerInBD(err, '100211');//TODO agregar error
            callback(err, null);
        }else {
        	console.log("Cantidad pichers en BD: " + players.length);
        	callback(null, players);
        }
	});
};

module.exports = player;
