var express = require('express');
var request = require('request');
var async = require('async');
var Promise = require('bluebird');
// My own libraries
var db = require('../lib/db');
var teamModel = require('../models/team');

var router = express.Router();

var apiQB = {};

apiQB.urls = [];
apiQB.urls['base'] = 'http://api.qualitysports.com.ve/api/';
//apiQB.urls['base'] = 'http://10.181.4.89:3000/api/mock/';
apiQB.urls['teams'] = 'equipo' ;
apiQB.accessToken = '45eadc85b650776e48bdf666120d0fbc';

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
    request(url, function(error, response, body) {
        //console.log(response.statusCode);
        //TODO handle 500, 401, 403 etc
        if (response.statusCode != 200) {
            //console.log(body);
            //TODO return error
            callback('error', null);
        } else {
            var teamData = JSON.parse(body);
            if (!teamData.data){
                throw new Error('no data for team');
            } else {
                callback(null, teamData.data.rows);
            }
        }
    });
};

apiQB.insertTeam = function(teams, callback) {

    var allValues = [];
    var data = null;
    if(teams!=null && teams.length == 8) {
        for (var i = 0; i < teams.length; ++i) {
            data =  teams[i];
            allValues.push(
                "(" +
                data.id_equipo + "," +
                data.nombre_equipo  + "," +
                data.nick_equipo + "," +
                data.ciudad + "," +
                data.sede + "," +
                data.sede_capacidad.replace(".","") + "," +
                data.manager + "," +
                new Date() +
                ")"
            );
        }
        var table = "team";
        var columns = "id,name,full_name,nick,city,stadium,stadium_capacity,manager,last_updated";
        var columnsUpdate = "name,full_name,nick,city,stadium,stadium_capacity,manager,last_updated";
        var sql = util.massiveInsertFormat(table,columns,columnsUpdate,allValues);
        callback(null, sql);


    }else {
        //console.log(body);
        //TODO return error
        callback('error', null);
    }



};


router.get('/init', function(req, res, next) {
    var teams = [];
    for (var i = 1; i < 9; ++i) {
        teams.push(apiQB.getTeamAsync(i));
    }

    //Se pasa... xD
    Promise.all(teams).then(function(teams) {
        apiQB.insertTeam(teams,callback);
        res.json({"code" : 0, "status" : "Success Team"});
        // res.send(result);
    });
});


module.exports = router;
