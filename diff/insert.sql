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