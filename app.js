var express    = require("express");
var http       = require("http");

var app = express();

var moduleRef = require('./bussines_logic/services');


app.get("/pool",function(req,res){
	//
	var sql = 'SELECT * FROM user';
	moduleRef.handle_database(req,res, sql);
});

app.get("/insert",function(req,res){


	var total_team = 8;
	var id_equipo;
	for (var i = 0; i < 8; i++) {
		id_equipo = i + 1;
		moduleRef.insert_team( id_equipo);
	};

	res.json({"code" : 0, "status" : "Success"});
	
});

app.get("/team",function(req,res){
	//
	var data = moduleRef.getTeams();
	console.log('data lala  ' + data);
	res.json(data);
});

app.listen(3000, function(){ console.log('server listening on port 3000') });