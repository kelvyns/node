var express = require('express');
var Promise = require('bluebird');
var mock = require('../test/builder');
var db = require('../lib/db');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	Promise.delay(1000).then(function() {
		console.log("500 ms passed");
		return "Hello world";
	}).delay(1000).then(function(helloWorldString) {
		console.log(helloWorldString);
		console.log("another 500 ms passed") ;
		res.send('hi');
	});
	
});

/* GET home page. */
router.get('/selectPlayer', function(req, res, next) {
	
	 db.getAll("PLAYER", function(err, players) {
         if(err){
        	 res.json({"code" : 400, "status" : "error al consultar la tabla player"});
         }else {
             res.json({"code" : 200, "status" : "Success", "total players" : players.length, "players" : players});
         }
     });
});

/* GET home page. */
router.get('/selectTeam', function(req, res, next) {
	
	 db.getAll("TEAM", function(err, teams) {
         if(err){
        	 res.json({"code" : 400, "status" : "error al consultar la tabla teams"});
         }else {
             res.json({"code" : 200, "status" : "Success", "total teams" : teams.length, "teams" : teams});
         }
     });
});



router.get("/api/",function(req,res){
	//
	var id_jugador = req.param('id_jugador');
	var token = req.param('token');
	var bioPelotero = '{"success":1,"message":"Registros recuperados","data":{"rows":[{"id_jugador":"2482","nombre":"CESAR","apellido":"SUAREZ","id_equipo":"5","equipo":"TIBURONES","talla":"1,80","peso":"80","edad":"31","fecha_nacimiento":"1983-08-17","mano_campo":"D","mano_bateo":"D","posicion_id":"7","posicion":"LF","numero_franela":"18","lugar_nacimiento":"MARACAIBO","pais_nacimiento":"VZLA"}]},"total":1}';
	var pelotero = JSON.parse(bioPelotero);	
	res.json(data);
});



router.get("/api/equipo*",function(req,res){
	//
	var id_equipo = req.query.id_equipo;
	var access_token = req.query.access_token;
	var resString = '';
	var data = '';
	if( access_token == '45eadc85b650776e48bdf666120d0fbc') {
		data = mock.team(parseInt(id_equipo));
	}else {
		resString = '{"success":1,"message":"Registros recuperados","data":{"rows":{"httpcode":"403","error":"Forbidden","info":"No tiene los permisos necesarios para acceder a este recurso"}},"total":3}';
		data = JSON.parse(resString);	
	}
	
	res.json(data);
	
});

router.get("/api/biopelotero*",function(req,res){
	//
	var id_jugador = req.query.id_jugador;
	var access_token = req.query.access_token;
	var resString = '';
	var data = '';
	if( access_token == '45eadc85b650776e48bdf666120d0fbc') {
		data = mock.biopelotero(parseInt(id_jugador), 5);
	}else {
		resString = '{"success":1,"message":"Registros recuperados","data":{"rows":{"httpcode":"403","error":"Forbidden","info":"No tiene los permisos necesarios para acceder a este recurso"}},"total":3}';
		data = JSON.parse(resString);	
	}
	res.json(data);
});

router.get("/api/biolanzador*",function(req,res){
	//
	var id_jugador = req.query.id_jugador;
	var access_token = req.query.access_token;
	var resString = '';
	var data = '';
	if( access_token == '45eadc85b650776e48bdf666120d0fbc') {
		data = mock.biolanzador(parseInt(id_jugador), 4);
	}else {
		resString = '{"success":1,"message":"Registros recuperados","data":{"rows":{"httpcode":"403","error":"Forbidden","info":"No tiene los permisos necesarios para acceder a este recurso"}},"total":3}';
		data = JSON.parse(resString);	
	}
	res.json(data);
});


router.get("/api/roster*",function(req,res){
	//
	var id_equipo = req.query.id_equipo;
	var access_token = req.query.access_token;
	var resString = '';
	var data = '';
	if( access_token == '45eadc85b650776e48bdf666120d0fbc') {
		data = mock.roster(parseInt(id_equipo));
	}else {
		resString = '{"success":2,"message":"Registros recuperados","data":{"rows":{"httpcode":"403","error":"Forbidden","info":"No tiene los permisos necesarios para acceder a este recurso"}},"total":3}';
		data = JSON.parse(resString);	
	}
	
	res.json(data);
	
});




router.get("/getEquipos/",function(req,res){
	//
	var url1 = "http://10.181.4.89:3000/api/mock/equipo/?id_equipo=1&access_token=45eadc85b650776e48bdf666120d0fbc";
	var url2 = "http://10.181.4.89:3000/api/mock/equipo/?id_equipo=2&access_token=45eadc85b650776e48bdf666120d0fbc";
	var url3 = "http://10.181.4.89:3000/api/mock/equipo/?id_equipo=3&access_token=45eadc85b650776e48bdf666120d0fbc";

	var request = http.get(url1, function (response) {
		var buffer = "";
		var data1 = ""; 
		var data2 = ""; 
		var data3 = ""; 

   		response.on("data", function (chunk) {
      	  	buffer += chunk;
    	}); 

    	response.on("end", function (err) {
			var value = JSON.parse(buffer);
	        data1 = value.data.rows;
			data1 = JSON.stringify(data1);
				var request = http.get(url2, function (response) {
					var buffer = "";

					response.on("data", function (chunk) {
						buffer += chunk;
					}); 

					response.on("end", function (err) {
						var value = JSON.parse(buffer);
						data2 = value.data.rows;
						data2 = JSON.stringify(data2);
							var request = http.get(url3, function (response) {
							var buffer = "";

							response.on("data", function (chunk) {
								buffer += chunk;
							}); 

							response.on("end", function (err) {
								var value = JSON.parse(buffer);
								data3 = value.data.rows;
								data3 = JSON.stringify(data3);
								
								var todas = "[" + data1 + "," + data2 + "," + data3 + "]";
								
								var result = JSON.parse(todas);	
								res.json(result);	
							}); 
						});
					}); 
				});
			
		}); 
	});
});


module.exports = router;
