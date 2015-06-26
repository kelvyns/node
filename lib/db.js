//#db.js
var mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : '127.0.0.1',
	user     : 'root',
	password : '', 
	database : 'fantasy',
    debug    :  false
});

function query(query, callback) {
    pool.getConnection(function(err, conn){
        if (err) {
            conn.release();
            callback(err);
        } else {
            conn.query(query, function(err, rows, fields) {
                conn.release();
                if (err) throw err;
                callback(err, rows, fields);
            });
        }
    });
}

function statement(query, params, callback) {
    pool.getConnection(function(err, conn){
        if (err) {
            conn.release();
            callback(err);
        } else {
            conn.query(query, params, function(err, rows, fields) {
                conn.release();
                if (err) throw err;
                callback(err, rows, fields);
            });
        }
    });
}

var db = {}
db.query = query;
db.statement = statement;

module.exports = db;
