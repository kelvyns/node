CREATE DATABASE `fantasy` /*!40100 DEFAULT CHARACTER SET utf8 */;

CREATE TABLE `PLAYER` (
  `id` int(11) NOT NULL,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `id_team` int(11) DEFAULT NULL,
  `position` varchar(2) DEFAULT NULL,
  `position_id` int(11) DEFAULT NULL,
  `throwing_hand` varchar(1) DEFAULT NULL,
  `batting_hand` varchar(1) DEFAULT NULL,
  `number` int(11) DEFAULT NULL COMMENT 'Numero de franela',
  `birth_place` varchar(45) DEFAULT NULL,
  `birth_country` varchar(45) DEFAULT NULL,
  `status` enum('active','injured') DEFAULT NULL,
  `status_date` varchar(45) DEFAULT NULL,
  `price` varchar(45) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `TEAM` (
  `id` int(11) NOT NULL,
  `name` varchar(25) DEFAULT NULL,
  `full_name` varchar(45) DEFAULT NULL,
  `nick` varchar(4) DEFAULT NULL,
  `city` varchar(30) DEFAULT NULL,
  `stadium` varchar(45) DEFAULT NULL,
  `stadium_capacity` int(11) DEFAULT NULL,
  `manager` varchar(45) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `ENTRY` (
  `id` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `credits` varchar(45) DEFAULT NULL,
  `points` varchar(45) DEFAULT NULL,
  `game_mode` enum('Daily','Weekly') DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `ENTRY_ROSTER` (
  `id` int(11) NOT NULL,
  `id_player` int(11) DEFAULT NULL,
  `id_entry` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `player_price` int(11) DEFAULT NULL,
  `status_entry` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ENTRY_SUMMARY` (
  `id` int(11) NOT NULL,
  `id_entry` int(11) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `week` varchar(45) DEFAULT NULL,
  `points` varchar(45) DEFAULT NULL,
  `credits` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `GAME` (
	`id_game` varchar(25) NOT NULL,
	`game_date` varchar(10) DEFAULT NULL,
	`start_time` varchar(5) DEFAULT NULL,
	`end_time` varchar(5) DEFAULT NULL,
	`duration` varchar(5) DEFAULT NULL,
	`city` varchar(45) DEFAULT NULL,
	`name_v` varchar(45) DEFAULT NULL,
	`name_h` varchar(45) DEFAULT NULL,
	`umpire10` varchar(45) DEFAULT NULL,
	`umpire20` varchar(45) DEFAULT NULL,
	`umpire30` varchar(45) DEFAULT NULL,
	`umpire40` varchar(45) DEFAULT NULL,
	`umpire50` varchar(45) DEFAULT NULL,
	`umpire60` varchar(45) DEFAULT NULL,
	`c_v` varchar(4) DEFAULT NULL,
	`h_v` varchar(4) DEFAULT NULL,
	`e_v` varchar(4) DEFAULT NULL,
	`c_h` varchar(4) DEFAULT NULL,
	`h_h` varchar(4) DEFAULT NULL,
	`e_h` varchar(4) DEFAULT NULL,
	`id_stadium` varchar(4) DEFAULT NULL,
	`inning` varchar(4) DEFAULT NULL,
	`inning_period` varchar(4) DEFAULT NULL,
	`first_base` varchar(4) DEFAULT NULL,
	`second_base` varchar(4) DEFAULT NULL,
	`third_base` varchar(4) DEFAULT NULL,
	`n_out` varchar(4) DEFAULT NULL,
	`anotator` varchar(10) DEFAULT NULL,
	`status` varchar(25) DEFAULT NULL,
	`season` varchar(10) DEFAULT NULL,
	`period` varchar(4) DEFAULT NULL,
	`last_updated` timestamp NULL DEFAULT NULL,
 	 PRIMARY KEY (`id_game`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `GAME_BATTING_BOXSCORE` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `GAME_PITCHING_BOXSCORE` (
  `id` int(11) NOT NULL,
  `id_game` int(11) DEFAULT NULL,
  `id_team` int(11) DEFAULT NULL,
  `id_player` int(11) DEFAULT NULL,
  `tercios_thrown` int(11) DEFAULT NULL,
  `hits` int(11) DEFAULT NULL,
  `h2` int(11) DEFAULT NULL,
  `h3` int(11) DEFAULT NULL,
  `hr` int(11) DEFAULT NULL,
  `cp` int(11) DEFAULT NULL,
  `cl` int(11) DEFAULT NULL,
  `bb` int(11) DEFAULT NULL,
  `so` int(11) DEFAULT NULL,
  `ip` float DEFAULT NULL,
  `era` float DEFAULT NULL,
  `date` date DEFAULT NULL,
  `win` int(11) DEFAULT NULL,
  `loss` int(11) DEFAULT NULL,
  `save` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `PITCHING_STATS` (
  `id` int(11) NOT NULL COMMENT '	',
  `id_player` int(11) DEFAULT NULL,
  `id_team` int(11) DEFAULT NULL COMMENT 'Runs (Carreras anotadas)',
  `date` date DEFAULT NULL,
  `outs` int(11) DEFAULT NULL COMMENT 'Outs (outs)',
  `ec` int(11) DEFAULT NULL COMMENT 'Entradas completas (Completed Innings)',
  `cp` int(11) DEFAULT NULL COMMENT 'Carreras permitidas (Earned runs)',
  `hp` int(11) DEFAULT NULL COMMENT 'Hits permitidos (Hits)',
  `bb` int(11) DEFAULT NULL COMMENT 'Base por bolas (Walks)',
  `p` int(11) DEFAULT NULL COMMENT 'Victorias (Wins)',
  `v` int(11) DEFAULT NULL,
  `total` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `PLAYER_BATTING_SEASON_STATS` (
  `id` int(11) NOT NULL,
  `id_player` int(11) DEFAULT NULL,
  `id_team` int(11) DEFAULT NULL,
  `jj` int(11) DEFAULT NULL COMMENT 'Juegos jugados',
  `vb` int(11) DEFAULT NULL COMMENT 'Veces al bate',
  `hits` int(11) DEFAULT NULL,
  `h2` int(11) DEFAULT NULL,
  `h3` int(11) DEFAULT NULL,
  `hr` int(11) DEFAULT NULL,
  `ca` int(11) DEFAULT NULL COMMENT 'Carreras anotadas',
  `ci` int(11) DEFAULT NULL COMMENT 'Carreras impulsadas',
  `br` int(11) DEFAULT NULL COMMENT 'Bases robadas',
  `bb` int(11) DEFAULT NULL COMMENT 'Base por bolas',
  `bbi` int(11) DEFAULT NULL COMMENT 'Bases por bolas intencionales',
  `so` int(11) DEFAULT NULL COMMENT 'Ponches',
  `sh` int(11) DEFAULT NULL COMMENT 'Sacrificio',
  `sf` int(11) DEFAULT NULL COMMENT 'Fly de sacrificio',
  `db` int(11) DEFAULT NULL COMMENT 'golpeado',
  `out_robo` int(11) DEFAULT NULL COMMENT 'outs_robando',
  `deb` int(11) DEFAULT NULL COMMENT 'Dejados en base',
  `ave` varchar(5) DEFAULT NULL COMMENT 'Average',
  `slg` varchar(5) DEFAULT NULL COMMENT 'Slugging',
  `oba` varchar(5) DEFAULT NULL COMMENT 'On base average',
  `ops` varchar(5) DEFAULT NULL COMMENT 'On base plus slugging',
  `periodo` enum('TR','RR','F') DEFAULT NULL,
  `temporada` varchar(9) DEFAULT NULL COMMENT 'Formato 2002-2003',
  `year` int(11) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT NULL COMMENT 'Last time record was updated',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `PLAYER_PITCHING_SEASON_STATS` (
  `id` int(11) NOT NULL,
  `id_team` int(11) DEFAULT NULL,
  `id_player` int(11) DEFAULT NULL,
  `tercios_thrown` int(11) DEFAULT NULL,
  `inn` int(11) DEFAULT NULL COMMENT 'Inning lanzados',
  `hits` int(11) DEFAULT NULL,
  `h2` int(11) DEFAULT NULL,
  `h3` int(11) DEFAULT NULL,
  `hr` int(11) DEFAULT NULL,
  `cl` int(11) DEFAULT NULL,
  `cp` int(11) DEFAULT NULL,
  `so` int(11) DEFAULT NULL,
  `bb` int(11) DEFAULT NULL,
  `bf` int(11) DEFAULT NULL COMMENT 'Bateadores enfrentados',
  `balk` int(11) DEFAULT NULL,
  `wp` int(11) DEFAULT NULL COMMENT 'Wild pitch',
  `bat_izq` int(11) DEFAULT NULL COMMENT 'Bateadores zurdos enfrentados',
  `bat_der` int(11) DEFAULT NULL COMMENT 'Bateadores derechos enfrentados',
  `hit_izq` int(11) DEFAULT NULL COMMENT 'hit permitidos zurdos',
  `hit_der` int(11) DEFAULT NULL COMMENT 'Hit permitidos derechos',
  `avg_izq` int(11) DEFAULT NULL COMMENT 'Avg bateadores zurdos',
  `avg_der` int(11) DEFAULT NULL COMMENT 'Average bateadores derechos',
  `g` int(11) DEFAULT NULL COMMENT 'juegos ganados',
  `p` int(11) DEFAULT NULL COMMENT 'juegos perdidos',
  `s` int(11) DEFAULT NULL COMMENT 'juegos salvados',
  `h` int(11) DEFAULT NULL COMMENT 'juegos sin decision',
  `b` int(11) DEFAULT NULL COMMENT 'blow saves',
  `era` float DEFAULT NULL,
  `whip` float DEFAULT NULL,
  `periodo` enum('TR','RR','F') DEFAULT NULL,
  `temporada` varchar(9) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `PLAYER_PRICE_HISTORY` (
  `id` int(11) NOT NULL,
  `id_player` varchar(45) DEFAULT NULL,
  `price` varchar(45) DEFAULT NULL,
  `date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
  `username` varchar(16) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(32) NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `ENTRY_SUMMARY` (
  `id` int(11) NOT NULL,
  `id_entry` int(11) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `week` varchar(45) DEFAULT NULL,
  `points` varchar(45) DEFAULT NULL,
  `credits` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `ERROR` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(10) DEFAULT NULL,
  `err` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `last_updated` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

