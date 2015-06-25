var express    = require("express");
var http       = require("http");

var app = express();

var moduleRef = require('./bussines_logic/services');

var mock = require('./test/builder');


app.get("/pool",function(req,res){
	//
	var sql = 'SELECT * FROM user';
	moduleRef.handle_database(req,res, sql);
});

app.get("/insertTeam",function(req,res){


	var total_team = 8;
	var id_equipo;
	for (var i = 0; i < 8; i++) {
		id_equipo = i + 1;
		moduleRef.insertTeam( id_equipo);
	};

	res.json({"code" : 0, "status" : "Success Team"});
	
});

app.get("/insertPlayer",function(req,res){

	moduleRef.insertPlayer();
	res.json({"code" : 0, "status" : "Success Player"});
	
});

app.get("/team",function(req,res){
	//
	var data = moduleRef.getTeams();
	console.log('data lala  ' + data);
	res.json(data);
});

app.get("/api/mock",function(req,res){
	//
	var id_jugador = req.param('id_jugador');
	var token = req.param('token');
	var bioPelotero = '{"success":1,"message":"Registros recuperados","data":{"rows":[{"id_jugador":"2482","nombre":"CESAR","apellido":"SUAREZ","id_equipo":"5","equipo":"TIBURONES","talla":"1,80","peso":"80","edad":"31","fecha_nacimiento":"1983-08-17","mano_campo":"D","mano_bateo":"D","posicion_id":"7","posicion":"LF","numero_franela":"18","lugar_nacimiento":"MARACAIBO","pais_nacimiento":"VZLA"}]},"total":1}';
	var pelotero = JSON.parse(bioPelotero);	
	res.json(data);
});



app.get("/api/mock/equipo/query*",function(req,res){
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


app.get("/api/mock/roster*",function(req,res){
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




app.get("/getEquipos/",function(req,res){
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

app.listen(3000, '10.181.4.89', function(){ console.log('server listening on port 3000') });
