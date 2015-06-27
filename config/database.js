var mysql      = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : '127.0.0.1',
	user     : 'admin',
	password : '12345',
	database : 'fantasy',
    debug    :  false
});

module.exports = pool;