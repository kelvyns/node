//#db.js
var error = require('../lib/error');
var config = require('../lib/config');
var mysql = require('mysql');

var pool      =    mysql.createPool({
    connectionLimit : config.db_connectionlimit, //important
    host     		: config.db_host,
    user     		: config.db_user,
    password 		: config.db_password,
    database 		: config.db_database,
    debug    		: config.db_debug
});

var db = {};

db.query = function (query, callback) {
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
};

db.statement = function (query, params, callback) {
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
};

db.getAll = function (table, callback) {
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
};

db.getAllByCondition = function (table, condition, callback) {
    pool.getConnection(function(err, conn){
        if (err) {
            error.sendMail(err, '100101');
            callback(err);
        } else {
            conn.query('SELECT * FROM '+ table + " WHERE " + condition, function(err, rows, fields) {
                conn.release();
                if (err) {
                    callback(err);
                }else {
                    callback(null, rows, fields);
                }
            });
        }
    });
};

module.exports = db;
