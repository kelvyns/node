//Model team
var db = require('../lib/db');
var error = require('../lib/error');
var util = require('../lib/util');
var dateformat = require('dateformat');

var team = {};

team.table = "TEAM";
team.table_columns = "id,name,full_name,nick,city,stadium,stadium_capacity,manager,last_updated";
team.table_updatecolumns = "name,full_name,nick,city,stadium,stadium_capacity,manager,last_updated";

team.getAll =  function(callback) {
	db.getAll(team.table, function(err, teams) {
	    if(err){
	        error.registerInBD(err, '100203');
	        callback(err, null);
	    }else {
	    	callback(null, teams);
	    }
	});
};

team.saveAll = function(teams, callback) {
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
        var sql = util.massiveInsertFormat(team.table, team.table_columns, team.table_updatecolumns,allValues);
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

module.exports = team;
