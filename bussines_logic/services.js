var pool = require('../config/database');

var http       = require("http");
var url_api = "http://api.qualitysports.com.ve/api/";
var access_token = "access_token=45eadc85b650776e48bdf666120d0fbc";

exports.handle_database = function(req,res, sql) { 
    
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query(sql,function(err,rows){
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}

exports.insert_team = function(id_equipo) { 


	var url = url_api + "/equipo/?" + access_token + "&id_equipo=" + id_equipo;
	// get is a simple wrapper for request()
	// which sets the http method to GET
	var request = http.get(url, function (response) {
	    // data is streamed in chunks from the server
	    // so we have to handle the "data" event    
	    var buffer = "";

   		response.on("data", function (chunk) {
      	  	buffer += chunk;
    	}); 

    	response.on("end", function (err) {
       	 	// finished transferring data
       		// dump the raw data
       
	        var value = JSON.parse(buffer);

	        var data = value.data.rows;
	        var team = {
				id 					:  parseInt(data.id_equipo),
				name 				:  data.nombre_equipo,
				full_name 			:  data.nombre_completo,
				nick 				:  data.nick_equipo,
				city 				:  data.ciudad,
				stadium 			:  data.sede,
				stadium_capacity	:  parseInt(data.sede_capacidad.replace(".","")),
				manager				:  data.manager,
				last_updated		: new Date()
	        };

	     	pool.getConnection(function(err,connection){
		        if (err) {
		          connection.release();
		          //res.json({"code" : 100, "status" : "Error in connection database"});
		          return;
		        }   

		        console.log('connected as id ' + connection.threadId);
		        
		        connection.query("INSERT INTO team set ? ",team, function(err, rows){
		  
		          if (err) {
		          		console.log("Error inserting : %s ",err );
		          		//res.json({"code" : 100, "status" : "Error in connection database"});
		          } else {
		          		console.log("Insert Ok");
		          		//res.json(rows);
		          }
		              
		          
		        });
	  		});

        	
    	}); 
	});
	

     
}

exports.getTeams = function() { 
	url = "http://api.qualitysports.com.ve/api/equipo/?access_token=45eadc85b650776e48bdf666120d0fbc&id_equipo=8";
// get is a simple wrapper for request()
// which sets the http method to GET
var request = http.get(url, function (response) {
	    // data is streamed in chunks from the server
	    // so we have to handle the "data" event    
	    var buffer = "", 
	        data,
	        route;

   		 response.on("data", function (chunk) {
      	  	buffer += chunk;
    	}); 

    	response.on("end", function (err) {
       	 	// finished transferring data
       		// dump the raw data
        	console.log(buffer);
        	console.log("\n");
        	data = JSON.parse(buffer);
        	return data;

        	
    	}); 
	});
}
