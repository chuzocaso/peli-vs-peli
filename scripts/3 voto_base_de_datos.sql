USE `competencias`;

DROP TABLE IF EXISTS `voto`;

CREATE TABLE `voto` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `competencia_id` int(11) unsigned NOT NULL,
  `pelicula_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `competencia_id` (`competencia_id`),
  KEY `pelicula_competencia_id` (`pelicula_id`),
  CONSTRAINT `competencia_id` FOREIGN KEY (`competencia_id`) REFERENCES `competencia` (`id`),
  CONSTRAINT `pelicula_competencia_id` FOREIGN KEY (`pelicula_id`) REFERENCES `pelicula` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
