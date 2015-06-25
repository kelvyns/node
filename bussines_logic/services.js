var pool = require('../config/database');

var http       = require("http");
var url_api = "http://api.qualitysports.com.ve/api";
var url_api = "http://http://10.181.4.89/api/mock";
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

exports.insertTeam = function(id_equipo) { 


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


exports.insertPlayer = function() { 
	
var rosterEquipoDia = '{"success":1,"message":"Registros recuperados","data":{"rows":{"pitchers":[{"id_jugador":"2268","numero_franela":"64","nombre":"EDGAR A.","apellido":"ALFONZO","manos":"Z/Z","talla":"1,77","peso":"77","lugar_nacimiento":"CARACAS","fecha_nacimiento":"1984-12-14","edad":"30"},{"id_jugador":"3080","numero_franela":"59","nombre":"ANGEL","apellido":"CALERO","manos":"Z/Z","talla":"1,88","peso":"75","lugar_nacimiento":"VALENCIA","fecha_nacimiento":"1986-09-25","edad":"28"},{"id_jugador":"3809","numero_franela":"57","nombre":"YOIMER","apellido":"CAMACHO","manos":"A/D","talla":"1,85","peso":"78","lugar_nacimiento":"SANTA TERESA","fecha_nacimiento":"1990-02-24","edad":"25"},{"id_jugador":"9390","numero_franela":"36","nombre":"ANTHONY","apellido":"CASTRO","manos":"D/D","talla":"1,88","peso":"73","lugar_nacimiento":"CARACAS","fecha_nacimiento":"1995-04-13","edad":"20"},{"id_jugador":"8645","numero_franela":"77","nombre":"TIAGO","apellido":"DA SILVA","manos":"D/D","talla":"1,75","peso":"75","lugar_nacimiento":"SAO PAULO","fecha_nacimiento":"1985-03-28","edad":"30"},{"id_jugador":"3470","numero_franela":"61","nombre":"JARRETT","apellido":"GRUBE","manos":"D/D","talla":"1,94","peso":"100","lugar_nacimiento":"CORUNNA,IN","fecha_nacimiento":"1981-11-05","edad":"33"},{"id_jugador":"3539","numero_franela":"63","nombre":"VICTOR","apellido":"LAREZ","manos":"D/D","talla":"1,91","peso":"74","lugar_nacimiento":"CUMANA","fecha_nacimiento":"1987-05-28","edad":"28"},{"id_jugador":"3932","numero_franela":"45","nombre":"YOANNER","apellido":"NEGRIN","manos":"D/D","talla":"1,80","peso":"85","lugar_nacimiento":"LA HABANA","fecha_nacimiento":"1984-04-29","edad":"31"},{"id_jugador":"8737","numero_franela":"29","nombre":"KYLER","apellido":"NEWBY","manos":"D/D","talla":"1,91","peso":"101","lugar_nacimiento":"LAS VEGAS,NV","fecha_nacimiento":"1985-02-22","edad":"30"},{"id_jugador":"3948","numero_franela":"34","nombre":"LOIGER","apellido":"PADRON","manos":"D/D","talla":"1,83","peso":"82","lugar_nacimiento":"PUERTO ORDAZ","fecha_nacimiento":"1991-01-31","edad":"24"},{"id_jugador":"3546","numero_franela":"65","nombre":"JESUS","apellido":"PIRELA","manos":"D/D","talla":"1,83","peso":"74","lugar_nacimiento":"MARACAIBO","fecha_nacimiento":"1989-03-13","edad":"26"},{"id_jugador":"3299","numero_franela":"73","nombre":"LUIS","apellido":"SANZ","manos":"D/D","talla":"1,88","peso":"77","lugar_nacimiento":"GUATIRE","fecha_nacimiento":"1987-11-19","edad":"27"},{"id_jugador":"3650","numero_franela":"71","nombre":"ALBERT","apellido":"SUAREZ","manos":"D/D","talla":"1,88","peso":"105","lugar_nacimiento":"SAN FELIX","fecha_nacimiento":"1989-10-08","edad":"25"},{"id_jugador":"3580","numero_franela":"66","nombre":"JHONATHAN","apellido":"TORRES","manos":"Z/Z","talla":"1,80","peso":"77","lugar_nacimiento":"CARACAS","fecha_nacimiento":"1990-03-20","edad":"25"},{"id_jugador":"2839","numero_franela":"39","nombre":"RONALD","apellido":"UVIEDO","manos":"D/D","talla":"1,88","peso":"72","lugar_nacimiento":"CALABOZO","fecha_nacimiento":"1986-10-07","edad":"28"},{"id_jugador":"9389","numero_franela":"44","nombre":"LUIS","apellido":"VILLALBA","manos":"Z/Z","talla":"1,90","peso":"86","lugar_nacimiento":"CARUPANO","fecha_nacimiento":"1992-10-28","edad":"22"},{"id_jugador":"9352","numero_franela":"81","nombre":"BOONE","apellido":"WHITING","manos":"D/D","talla":"1,85","peso":"79","lugar_nacimiento":"OAKDALE,CA","fecha_nacimiento":"1989-08-20","edad":"25"}],"catchers":[{"id_jugador":"3565","numero_franela":"38","nombre":"RAMON","apellido":"CABRERA","manos":"A/D","talla":"1,75","peso":"90","lugar_nacimiento":"EL TIGRITO","fecha_nacimiento":"1989-11-05","edad":"25"}],"infielders":[{"id_jugador":"6781","numero_franela":"0","nombre":"CARLOS","apellido":"PEREZ","manos":"D/D","talla":"1,84","peso":"80","lugar_nacimiento":"BARCELONA","fecha_nacimiento":"0000-00-00","edad":"2015"},{"id_jugador":"6802","numero_franela":"47","nombre":"ALEJANDRO","apellido":"SEGOVIA","manos":"D/D","talla":"1,79","peso":"80","lugar_nacimiento":"SAN FELIPE","fecha_nacimiento":"1990-04-27","edad":"25"},{"id_jugador":"9385","numero_franela":"10","nombre":"YHOXIAN","apellido":"MEDINA","manos":"D/D","talla":"1,78","peso":"75","lugar_nacimiento":"CARACAS","fecha_nacimiento":"1990-05-11","edad":"25"},{"id_jugador":"2997","numero_franela":"57","nombre":"DANIEL","apellido":"MAYORA","manos":"D/D","talla":"1,80","peso":"70","lugar_nacimiento":"LA GUAIRA","fecha_nacimiento":"1985-07-27","edad":"29"},{"id_jugador":"9384","numero_franela":"72","nombre":"CLEULUIS","apellido":"RONDON","manos":"A/D","talla":"1,83","peso":"75","lugar_nacimiento":"MARACAY","fecha_nacimiento":"1994-04-13","edad":"21"}],"outfielders":[{"id_jugador":"9387","numero_franela":"80","nombre":"DIEGO","apellido":"CEDEÑO","manos":"Z/Z","talla":"1,80","peso":"74","lugar_nacimiento":"MARACAY","fecha_nacimiento":"1992-05-19","edad":"23"},{"id_jugador":"6987","numero_franela":"0","nombre":"LUIS","apellido":"RODRIGUEZ","manos":"D/D","talla":"1,88","peso":"82","lugar_nacimiento":"TURMERO","fecha_nacimiento":"1939-03-06","edad":"76"},{"id_jugador":"9386","numero_franela":"7","nombre":"DANRY","apellido":"VASQUEZ","manos":"Z/D","talla":"1,88","peso":"77","lugar_nacimiento":"OCUMARE DEL TUY","fecha_nacimiento":"1994-01-08","edad":"21"},{"id_jugador":"9351","numero_franela":"3","nombre":"THOMAS","apellido":"PHAM","manos":"D/D","talla":"1,85","peso":"79","lugar_nacimiento":"LAS VEGAS,NV","fecha_nacimiento":"1988-03-08","edad":"27"},{"id_jugador":"3537","numero_franela":"33","nombre":"RONALD","apellido":"BERMUDEZ","manos":"D/D","talla":"1,83","peso":"75","lugar_nacimiento":"MARACAIBO","fecha_nacimiento":"1988-06-06","edad":"27"},{"id_jugador":"3967","numero_franela":"18","nombre":"FELIX","apellido":"PEREZ","manos":"Z/Z","talla":"1,88","peso":"85","lugar_nacimiento":"LA HABANA","fecha_nacimiento":"1984-11-14","edad":"30"}]}},"total":4}';
var roster = JSON.parse(rosterEquipoDia);
var bioLanzador = '{"id_jugador":"3282","nombre":"MIGUEL","apellido":"SOCOLOVICH","id_equipo":"4","posicion":"P","mano_campo":"D","mano_bateo":"D","numero_franela":"55","fecha_nacimiento":"1986-07-24","pais":"VZLA","equipo":"LEONES","talla":"1,83","peso":"72","edad":"28","lugar":"CARACAS"}';
var lanzador = JSON.parse(bioLanzador);
var bioPelotero = '{"success":1,"message":"Registros recuperados","data":{"rows":[{"id_jugador":"2482","nombre":"CESAR","apellido":"SUAREZ","id_equipo":"5","equipo":"TIBURONES","talla":"1,80","peso":"80","edad":"31","fecha_nacimiento":"1983-08-17","mano_campo":"D","mano_bateo":"D","posicion_id":"7","posicion":"LF","numero_franela":"18","lugar_nacimiento":"MARACAIBO","pais_nacimiento":"VZLA"}]},"total":1}';
var pelotero = JSON.parse(bioPelotero);	
var data = pelotero.data.rows[0];
	var player = {
		id 					:  parseInt(data.id_jugador),  		// `id` int(11) NOT NULL,
		first_name 			:  data.nombre,						// `first_name` varchar(45) DEFAULT NULL,
		last_name 			:  data.apellido,					// `last_name` varchar(45) DEFAULT NULL,
		id_team 			:  parseInt(data.id_equipo),		// `id_team` int(11) DEFAULT NULL,
		position 			:  data.posicion,					// `position` varchar(2) DEFAULT NULL,
		positon_id 			:  parseInt(data.posicion_id),		// `positon_id` int(11) DEFAULT NULL,
		throwing_hand 		:  data.mano_campo,					// `throwing_hand` varchar(1) DEFAULT NULL,
		batting_hand		:  data.mano_bateo,					// `batting_hand` varchar(1) DEFAULT NULL,
		number				:  parseInt(data.numero_franela),	// `number` int(11) DEFAULT NULL COMMENT 'Numero de franela',
		birth_place			:  data.fecha_nacimiento,			// `birth_place` varchar(45) DEFAULT NULL,
		birth_country		:  data.pais,						// `birth_country` varchar(45) DEFAULT NULL,
		status				:  "active",						// `status` enum('active','injured') DEFAULT NULL,
		status_date			:  "TODO calFEcha",					// `status_date` varchar(45) DEFAULT NULL,
		price				:  "TODO calPrecio"					// `price` varchar(45) DEFAULT NULL,
	};
	var log = JSON.stringify(player);
	console.log('player: ' + log);
	pool.getConnection(function(err,connection){
		if (err) {
		  connection.release();
		  //res.json({"code" : 100, "status" : "Error in connection database"});
		  return;
		}   

		console.log('connected as id ' + connection.threadId);
		
		connection.query("INSERT INTO player set ? ", player, function(err, rows){
  
		  if (err) {
				console.log("Error inserting : %s ",err );
				//res.json({"code" : 100, "status" : "Error in connection database"});
		  } else {
				console.log("Insert Ok");
				//res.json(rows);
		  }
			  
		  
		});
	});
     
}
