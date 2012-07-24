# ************************************************************
# Sequel Pro SQL dump
# Version 3408
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 127.0.0.1 (MySQL 5.5.17)
# Database: isitopen
# Generation Time: 2012-07-24 01:06:51 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table city
# ------------------------------------------------------------

DROP TABLE IF EXISTS `city`;

CREATE TABLE `city` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL DEFAULT '',
  `title` varchar(64) NOT NULL DEFAULT '',
  `lat` int(11) NOT NULL,
  `lon` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table geocode
# ------------------------------------------------------------

DROP TABLE IF EXISTS `geocode`;

CREATE TABLE `geocode` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `city` varchar(96) NOT NULL DEFAULT '',
  `postcode` mediumint(8) unsigned NOT NULL,
  `street` varchar(128) NOT NULL DEFAULT '',
  `lat` int(11) DEFAULT NULL,
  `lon` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `city` (`city`,`postcode`,`street`),
  UNIQUE KEY `lat` (`lat`,`lon`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table hours
# ------------------------------------------------------------

DROP TABLE IF EXISTS `hours`;

CREATE TABLE `hours` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `venue_id` int(11) unsigned NOT NULL,
  `weekday` set('mon','tue','wed','thu','fri','sat','sun') NOT NULL DEFAULT '',
  `open` time NOT NULL,
  `close` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `venue_id` (`venue_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;



# Dump of table venue
# ------------------------------------------------------------

DROP TABLE IF EXISTS `venue`;

CREATE TABLE `venue` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `city_id` int(10) unsigned NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '',
  `title` varchar(128) NOT NULL DEFAULT '',
  `type` enum('restaurant','convenience','cafe','clothing','pharmacy','retail','bank','supermarket','fastfood') NOT NULL DEFAULT 'restaurant',
  `lat` int(11) NOT NULL,
  `lon` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
