var config = {};

// DATA BASE CONFIGURATION 
config.db_connectionlimit = 100; // important
config.db_host = "127.0.0.1";
config.db_user = "root";
config.db_password = "";
config.db_database = "fantasy";
config.db_debug = false;

// LOCAL IP CONFIG
config.local_ip="10.181.4.89";
config.local_port=3000;
config.local_api_url = "http://"+ config.local_ip +":"+config.local_port+"/api/updater/";

//LEAGUE BASEBALL IP CONFIG
config.remote_api_url = "http://"+ config.local_ip +":"+config.local_port+"/api/";

config.player_sleep = 100;
config.roster_sleep = 100;
config.picher_sleep = 100;

// Node Mailer config
config.mail_smtp_transport_service   = "Gmail";
config.mail_smtp_transport_auth_user = "kelvyns.aguilar@gmail.com";
config.mail_smtp_transport_auth_pass = "xxxxx";
config.mail_error_from               = "kelvyns.aguilar@gmail.com";
config.mail_error_to                 = "kelvyns.aguilar@gmail.com, robert.reimi@gmail.com"; // kelvyns.aguilar1@gmail.com, robert.reimi@gmail.com


config.token = "45eadc85b650776e48bdf666120d0fbc";

module.exports = config;
