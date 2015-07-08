//Model game
var db = require('../lib/db');
var error = require('./error');
var util = require('../lib/util');
var dateformat = require('dateformat');

var game = {};

game.table = "GAME";
game.table_columns = "id_game,game_date,start_time,end_time,duration,city,name_v,name_h,umpire10,umpire20,umpire30,umpire40,umpire50,umpire60,c_v,h_v,e_v,c_h,h_h,e_h,id_stadium,inning,inning_period,first_base,second_base,third_base,n_out,anotator,status,season,period,last_updated";
game.table_updatecolumns = "id_game,game_date,start_time,end_time,duration,city,name_v,name_h,umpire10,umpire20,umpire30,umpire40,umpire50,umpire60,c_v,h_v,e_v,c_h,h_h,e_h,id_stadium,inning,inning_period,first_base,second_base,third_base,n_out,anotator,status,season,period,last_updated";

game.getAll =  function(date, callback) {
	var sql = "select * from "+ game.table;
	if( date ) {
		sql = sql +" where game_date='" + date+ "'";
	}
	db.query(sql, function(err, games) {
	    if(err){
	        error.registerInBD(err, '100218');
	        callback(err, null);
	    }else {
	    	callback(null, games);
	    }
	});
};

game.saveAll = function(games, callback) {
	var allValues = [];
    var data = null;
    var date = dateformat(new Date(), "yyyy-mm-dd h:MM:ss");
    if(games!=null && games != undefined) {
        for (var i = 0; i < games.length; ++i) {
            data =  games[i];
            allValues.push(
             "(" +
             "'" + data.id_juego.trim()+ "'" + "," + //"14 5 7 01",
             "'" + data.fecha_juego+ "'" + "," + //"2014-10-09",
             "'" + data.hora_ini+ "'" + "," + //"19:38",
             "'" + data.hora_fin+ "'" + "," + //"22:48",
             "'" + data.duracion+ "'" + "," + //"03:10",
             "'" + data.ciudad+ "'" + "," + //"PUERTO LA CRUZ",
             "'" + data.nombre_v+ "'" + "," + //"TIBURONES",
             "'" + data.nombre_h+ "'" + "," + //"CARIBES",
             "'" + data.arbitro10+ "'" + "," + //null,
             "'" + data.arbitro20+ "'" + "," + //null,
             "'" + data.arbitro30+ "'" + "," + //null,
             "'" + data.arbitro40+ "'" + "," + //null,
             "'" + data.arbitro50+ "'" + "," + //null,
             "'" + data.arbitro60+ "'" + "," + //null,
             "'" + data.c_v+ "'" + "," + //"2",
             "'" + data.h_v+ "'" + "," + //"7",
             "'" + data.e_v+ "'" + "," + //"1",
             "'" + data.c_h+ "'" + "," + //"3",
             "'" + data.h_h+ "'" + "," + //"5",
             "'" + data.e_h+ "'" + "," + //"0",
             "'" + data.id_estadio+ "'" + "," + //"5",
             "'" + data.inning+ "'" + "," + //"0",
             "'" + data.inning_periodo+ "'" + "," + //null,
             "'" + data.primera+ "'" + "," + //"",
             "'" + data.segunda+ "'" + "," + //"",
             "'" + data.tercera+ "'" + "," + //"",
             "'" + data.out+ "'" + "," + //null,
             "'" + data.anotador+ "'" + "," + //"0",
             "'" + data.estatus+ "'" + "," + //"FINALIZADO",
             "'" + data.temporada+ "'" + "," + //"2014-2015",
             "'" + data.periodo+ "'" + "," + //"TR"
             "'" + date + "'" + 
            ")");
        }
        
        var sql = util.massiveInsertFormat(game.table, game.table_columns, game.table_updatecolumns,allValues);
        //console.log(sql);
        db.query(sql, function(err, rows){
           if(err){
        	   console.log(err);
               error.registerInBD(err, '100219');
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

module.exports = game;
