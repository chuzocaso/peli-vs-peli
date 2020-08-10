USE `competencias`;

DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE competencia ADD COLUMN genero_id int unsigned null;
ALTER TABLE competencia ADD FOREIGN KEY (genero_id) references genero(id);
ALTER TABLE competencia ADD COLUMN director_id int unsigned null;
ALTER TABLE competencia ADD FOREIGN KEY (director_id) references director(id);
ALTER TABLE competencia ADD COLUMN actor_id int unsigned null;
ALTER TABLE competencia ADD FOREIGN KEY (actor_id) references actor(id);
ALTER TABLE competencia ADD COLUMN inactivo TINYINT DEFAULT 0;

LOCK TABLES `competencia` WRITE;
INSERT INTO `competencia` VALUES 
  (1,'¿Cuál es la mejor película?',null,null,null,0),
  (2,'¿Cuál es la peor película?',null,null,null,0),
  (3,'¿Cuál es la mejor película dirigida por Almodovar?',null,3269,null,0),
  (4,'¿Cuál es la pelicula que mas miedo te dio?',10,null,null,0),
  (5,'¿Cuál es la mejor película en la que actua Al Pacino?',null,null,32,0),
  (6,'¿Cuál es la pelicula que mas miedo te dio?',10,null,null,0),
  (7,'¿Que pelicula de accion en la que actua Bruce Willis te gusta mas?',1,null,254,0),
  (8,'¿Que comedia de Woody Allen donde tambien actue el mismo te parece la mejor?',5,3279,2048,0);
UNLOCK TABLES;

