var config = {};

// DATA BASE CONFIGURATION 
config.db_connectionlimit = 100; // important
config.db_host = "127.0.0.1";
config.db_user = "admin";
config.db_database = "fantasy";
config.db_password = "12345";
config.db_debug = false;

//LOCAL IP CONFIG
config.local_ip="127.0.0.1";
config.local_port=3000;
config.local_api_url = "http://"+ config.local_ip +":"+config.local_port+"/api/updater/";

//LEAGUE BASEBALL IP CONFIG
config.remote_api_url = "http://api.qualitysports.com.veX/api/";

config.player_sleep = 100;
config.roster_sleep = 100;
config.picher_sleep = 100;

config.token = "45eadc85b650776e48bdf666120d0fbc";

module.exports = config;
