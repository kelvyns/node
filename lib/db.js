//#db.js
var mysql = require('mysql');
var error = require('../control_error/error');

var pool      =    mysql.createPool({
    connectionLimit : 100, //important
    host     : '127.0.0.1',
	//user     : 'root',
    user     : 'admin',
	//password : '',
    password : '12345',
    database : 'fantasy',
    debug    :  false
});

function query(query, callback) {
    pool.getConnection(function(err, conn){
        if (err) {
            error.sendMail(err, '100101');
            callback(err);
        } else {
            conn.query(query, function(err, rows, fields) {
                conn.release();
                if (err) {
                    callback(err);
                }else {
                    callback(null, rows, fields);
                }
            });
        }
    });
}

function statement(query, params, callback) {
    pool.getConnection(function(err, conn){
        if (err) {
            error.sendMail(err, '100101');
            callback(err);
        } else {
            conn.query(query, params, function(err, rows, fields) {
                conn.release();
                if (err) {
                    callback(err);
                }else {
                    callback(null, rows, fields);
                }
            });
        }
    });
}

function getAll(table, callback) {
    pool.getConnection(function(err, conn){
        if (err) {
            error.sendMail(err, '100101');
            callback(err);
        } else {
            conn.query('SELECT * FROM '+ table, function(err, rows, fields) {
                conn.release();
                if (err) {
                    callback(err);
                }else {
                    callback(null, rows, fields);
                }
            });
        }
    });
}

var db = {}
db.query = query;
db.statement = statement;
db.getAll = getAll;
db.table = {};
db.table.team = 'TEAM';
db.table.player = 'PLAYER';

module.exports = db;
