//se importa una referencia a la conexión.
var con = require('../lib/conexionbd');

function obtenerCompetencias(req, res) {
    //se obtienen todas las competencias
    var sql = "select * from competencia where inactivo=0";
    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        
        //si no hubo error, se envía el resultado
        res.send(JSON.stringify(resultado));
    });
}

function votar(req, res) {
    var idCompetencia = req.params.idCompetencia;
    var idPelicula = req.body.idPelicula;

    //verificamos que exista la competencia
    con.query("select * from competencia where inactivo=0 and id="+idCompetencia, function(error, resultado, fields) {
        if (resultado.length == 0) {
            return res.status(404).json("no existe la competencia con el id enviado");
        }
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
    });    
    //se suma el voto
    var sql = "INSERT INTO voto (competencia_id,pelicula_id) VALUES (?,?)";
    //se ejecuta la consulta
    con.query(sql,[idCompetencia, idPelicula], function(error, resultado, fields) {

        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        //si no hubo error, se envía el resultado
        res.send(JSON.stringify(resultado));
    });
}

function mostrarResultados(req, res) {
    //se obtienen los path param
    var idCompetencia = req.params.idCompetencia;

    //obtengo el nombre de la competencia
    var nombreCompetencia;
    var sql = "select nombre from competencia where inactivo=0 and id = " + idCompetencia;
    con.query(sql, function(error, resultado, fields) {
        //verificamos que exista la competencia
        if (resultado.length == 0) {
            return res.status(404).json("no existe la competencia con el id enviado");
        }
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        //guardo el nombre de la competencia en una variable
        nombreCompetencia = resultado.nombre;
    });

    //se crea la consulta
    var sql = "select pelicula_id, count(pelicula_id) as votos,poster,titulo from voto join pelicula on pelicula_id=pelicula.id where competencia_id=? group by pelicula_id order by 2 desc limit 3";

    //se ejecuta la consulta
    con.query(sql,[idCompetencia], function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        
        //si no hubo error, se crea el objeto respuesta con el nombre de la competencia y los resultados obtenidos
        var respuesta = {
            'competencia': nombreCompetencia,
            'resultados': resultado,
        };
        //se envía la respuesta
        res.send(JSON.stringify(respuesta));
    });
}


function buscarCompetencia(req, res) {
    //se obtiene el path param id
    var idCompetencia = req.params.idCompetencia;
    //se declaran las variables que se van a utilizar
    var competencia;
    var genero_id;
    var genero_nombre=null;
    var director_id;
    var director_nombre=null;
    var actor_id;
    var actor_nombre=null;
    //se crea la consulta que obtiene el nombre de la competencia con id
    var sql = "select nombre,genero_id,director_id,actor_id from competencia where inactivo=0 and id="+idCompetencia;
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        //si no se encontró ningún resultado, se envía un mensaje con el error
        if (resultado.length == 0) {
            console.log("No se encontro ninguna competencia con ese id");
            return res.status(404).send("No se encontro ninguna competencia con ese id");
        } else {
            //se guarda el nombre de la competencia y sus parametros
            competencia = resultado[0].nombre;
            genero_id = resultado[0].genero_id;
            director_id = resultado[0].director_id;
            actor_id = resultado[0].actor_id;
            var sqlGenero = "select nombre from genero where id="+genero_id;
            con.query(sqlGenero, function(error, resultadoGenero, fields) {
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(500).send("Hubo un error en la consulta");
                }
                //si no hubo error, se guarda el nombre del genero
                if (resultadoGenero.length>0) {
                    genero_nombre = resultadoGenero[0].nombre;
                }
                var sqlDirector = "select nombre from director where id="+director_id;
                con.query(sqlDirector, function(error, resultadoDirector, fields) {
                    //si hubo un error, se informa y se envía un mensaje de error
                    if (error) {
                        console.log("Hubo un error en la consulta", error.message);
                        return res.status(500).send("Hubo un error en la consulta");
                    }
                    //si no hubo error, se guarda el nombre del director
                    if (resultadoDirector.length>0) {
                        director_nombre = resultadoDirector[0].nombre;
                    }
                    // verificamos si tenemos un actor asociado a la competencia y obtenemos el nombre si lo hay
                    var sqlActor = "select nombre from actor where id="+actor_id;
                    con.query(sqlActor, function(error, resultadoActor, fields) {
                        //si hubo un error, se informa y se envía un mensaje de error
                        if (error) {
                            console.log("Hubo un error en la consulta", error.message);
                            return res.status(500).send("Hubo un error en la consulta");
                        }
                        //si no hubo error, se guarda el nombre del actor
                        if (resultadoActor.length>0) {
                           actor_nombre = resultadoActor[0].nombre;
                        }
                        var respuesta = {
                            //se crea el objeto respuesta con los datos solicitados
                            'genero_nombre': genero_nombre,
                            'director_nombre': director_nombre,
                            'actor_nombre': actor_nombre,
                            'nombre': competencia
                        };
                        //se envía la respuesta
                        res.send(JSON.stringify(respuesta)); 
                    });
                    
                });
                
            });
            
        }
    });
}

function cargarPeliculas(req, res) {
    //se obtiene el path param id
    var idCompetencia = req.params.idCompetencia;
    //se crea la consulta que obtiene el nombre de la competencia con id
    var sqlCompetencia = "select * from competencia where inactivo=0 and id="+idCompetencia;
    var competencia;
    var genero_id;
    var director_id;
    var actor_id;
    con.query(sqlCompetencia, function(error, resultadoCompetencia, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        //si no se encontró ningún resultado, se envía un mensaje con el error
        if (resultadoCompetencia.length == 0) {
            console.log("No se encontro ninguna competencia con ese id");
            return res.status(404).send("No se encontro ninguna competencia con ese id");
        } else {
            //se guarda el nombre de la competencia y sus filtros
            competencia = resultadoCompetencia[0].nombre;
            genero_id = resultadoCompetencia[0].genero_id;
            director_id = resultadoCompetencia[0].director_id;
            actor_id = resultadoCompetencia[0].actor_id;
        }
        var sql = comprobarPeliculas(genero_id,director_id,actor_id)
       //se ejecuta la consulta
        con.query(sql, function(error, resultado, fields) {
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }
            //si no se encontró ningún resultado, se envía un mensaje con el error
            var respuesta = {
                //se crea el objeto respuesta con las peliculas obtenidas aleatoriamente y el nombre de la competencia
                'peliculas': resultado,
                'competencia': competencia
            };
            //se envía la respuesta
            res.send(JSON.stringify(respuesta));
        });
    });
}

function agregarCompetencia(req, res) {
    var nombreCompetencia = req.body.nombre;
    //se almacena en una variable el valor del genero, director, actor y si es igual a cero (no pasan el parametro) asignamos null
    var genero_id = req.body.genero==0 ? null : parseInt(req.body.genero);
    var director_id = req.body.director==0 ? null : parseInt(req.body.director);
    var actor_id = req.body.actor==0 ? null : parseInt(req.body.actor);

    //verificamos que no exista la competencia
    con.query("select * from competencia where inactivo=0 and nombre like '%" + nombreCompetencia + "%'", function(error, resultado, fields) {
        if (nombreCompetencia.length<4) {
            console.log("Se debe ingresar al menos 4 caracteres");
            return res.status(422).json("Se debe ingresar al menos 4 caracteres");
        }
        if (resultado.length > 0) {
            console.log("Esa competencia ya existe");
            return res.status(422).json("Esa competencia ya existe");
        }
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        //verificamos que la competencia arroje como minimo 2 peliculas
        con.query(comprobarPeliculas(genero_id,director_id,actor_id), function (error, resultadoPeliculas, fields) {
            if (resultadoPeliculas.length<2) {
                console.log("No se obtienen el minimo de 2 peliculas con los parametros seleccionados")
                return res.status(422).send("No se obtienen el minimo de 2 peliculas con los parametros seleccionados")
            }
            //si hubo un error, se informa y se envía un mensaje de error
            if (error) {
                console.log("Hubo un error en la consulta", error.message);
                return res.status(500).send("Hubo un error en la consulta");
            }
            //si no hay error se agrega la competencia
            var sqlAgregar = "INSERT INTO competencia (nombre,genero_id,director_id,actor_id) VALUES (?,?,?,?)";
            //se ejecuta la consulta
            con.query(sqlAgregar,[nombreCompetencia,genero_id,director_id,actor_id], function(error, resultadoAgregar, fields) {
                
                //si hubo un error, se informa y se envía un mensaje de error
                if (error) {
                    console.log("Hubo un error en la consulta", error.message);
                    return res.status(500).send("Hubo un error en la consulta");
                }
                //si no hubo error, se envía el resultado
                res.send(JSON.stringify(resultadoAgregar));
            });
        });
    });

}

function reiniciarCompetencia(req, res) {
    var idCompetencia = req.params.idCompetencia;

    //verificamos que exista la competencia
    con.query("select * from competencia where inactivo=0 and id="+idCompetencia, function(error, resultado, fields) {
        if (resultado.length == 0) {
            return res.status(404).json("no existe la competencia con el id enviado");
        }
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
    });    
    //se eliminan los votos de la competencia
    var sql = "DELETE from voto WHERE competencia_id="+idCompetencia;
    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {

        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        //si no hubo error, se envía el resultado
        res.send(JSON.stringify(resultado));
    });
}

function obtenerGeneros(req, res) {
    //se obtienen todos los generos
    var sql = "select id,nombre from genero";
    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        
        //si no hubo error, se envía el resultado
        res.send(JSON.stringify(resultado));
    });
}

function obtenerDirectores(req, res) {
    //se obtienen todos los directores
    var sql = "select id,nombre from director";
    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        
        //si no hubo error, se envía el resultado
        res.send(JSON.stringify(resultado));
    });
}

function obtenerActores(req, res) {
    //se obtienen todos los actores
    var sql = "select id,nombre from actor";
    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        
        //si no hubo error, se envía el resultado
        res.send(JSON.stringify(resultado));
    });
}

function editarCompetencia(req, res) {
    var idCompetencia = req.params.idCompetencia;
    var nombreCompetencia = req.body.nombre;
    console.log(nombreCompetencia)
    //verificamos que exista la competencia
    con.query("select * from competencia where inactivo=0 and id="+idCompetencia, function(error, resultado, fields) {
        if (resultado.length == 0) {
            return res.status(404).json("no existe la competencia con el id enviado");
        }
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
    });    
    //se edita la competencia
    var sql = "UPDATE competencia SET nombre='"+nombreCompetencia+"' where id="+idCompetencia;
    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {

        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        //si no hubo error, se envía el resultado
        res.send(JSON.stringify(resultado));
    });
}

function eliminarCompetencia(req, res) {
    var idCompetencia = req.params.idCompetencia;

    //verificamos que exista la competencia
    con.query("select * from competencia where inactivo=0 and id="+idCompetencia, function(error, resultado, fields) {
        if (resultado.length == 0) {
            return res.status(404).json("no existe la competencia con el id enviado");
        }
        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
    });    
    //se elimina la competencia
    var sql = "UPDATE competencia SET inactivo=1 where id= "+idCompetencia;
    //se ejecuta la consulta
    con.query(sql, function(error, resultado, fields) {

        //si hubo un error, se informa y se envía un mensaje de error
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(500).send("Hubo un error en la consulta");
        }
        //si no hubo error, se envía el resultado
        res.send(JSON.stringify(resultado));
    });
}

function comprobarPeliculas(genero_id,director_id,actor_id) {
    if (genero_id) {
        var sql = "select id,poster,titulo from pelicula where genero_id=" + genero_id + " order by RAND() limit 2";
        if (director_id) {
            sql = "select p.id,poster,titulo from pelicula p join director_pelicula dp on p.id=dp.pelicula_id join director d on dp.director_id=d.id where d.id=" + director_id + " and genero_id=" + genero_id +" order by RAND() limit 2";
            if (actor_id) {
                sql = "select p.id,poster,titulo from pelicula p join actor_pelicula ap on p.id=ap.pelicula_id join actor a on ap.actor_id=a.id join director_pelicula dp on p.id=dp.pelicula_id join director d on dp.director_id=d.id where d.id="+director_id+" and a.id="+ actor_id + " and genero_id=" + genero_id +" order by RAND() limit 2";
            }
        } else if (actor_id) {
            sql = "select p.id,poster,titulo from pelicula p join actor_pelicula ap on p.id=ap.pelicula_id join actor a on ap.actor_id=a.id where a.id=" + actor_id + " and genero_id=" + genero_id +" order by RAND() limit 2";
        }
    } else if (director_id) {
        var sql = "select p.id,poster,titulo from pelicula p join director_pelicula dp on p.id=dp.pelicula_id join director d on dp.director_id=d.id where d.id=" + director_id + " order by RAND() limit 2";
        if (actor_id) {
            sql = "select p.id,poster,titulo from pelicula p join actor_pelicula ap on p.id=ap.pelicula_id join actor a on ap.actor_id=a.id join director_pelicula dp on p.id=dp.pelicula_id join director d on dp.director_id=d.id where d.id="+director_id+" and a.id="+ actor_id + " order by RAND() limit 2";
        }
    } else if (actor_id){
        var sql = "select p.id,poster,titulo from pelicula p join actor_pelicula ap on p.id=ap.pelicula_id join actor a on ap.actor_id=a.id where a.id=" + actor_id + " order by RAND() limit 2";
    } else {
        //si no fue enviado ningún parametro, se asigna la consulta que obtiene todas las peliculas
        var sql = "select id,poster,titulo from pelicula order by RAND() limit 2";
    }
    return sql;
}

//se exportan las funciones creadas
module.exports = {
    obtenerCompetencias: obtenerCompetencias,
    buscarCompetencia: buscarCompetencia,
    votar: votar,
    mostrarResultados: mostrarResultados,
    agregarCompetencia: agregarCompetencia,
    reiniciarCompetencia: reiniciarCompetencia,
    obtenerGeneros: obtenerGeneros,
    obtenerDirectores: obtenerDirectores,
    obtenerActores: obtenerActores,
    cargarPeliculas: cargarPeliculas,
    editarCompetencia: editarCompetencia,
    eliminarCompetencia: eliminarCompetencia
};