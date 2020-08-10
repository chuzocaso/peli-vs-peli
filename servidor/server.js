//paquetes necesarios para el proyecto
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var competenciasControlador = require('./controladores/competenciasControlador');


var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//cuando se llama a la ruta /competencias, se ejecuta la acción obtenerCompetencias.
app.get('/competencias', competenciasControlador.obtenerCompetencias);
//cuando se llama a la ruta /competencias, se ejecuta la acción agregarCompetencia.
app.post('/competencias', competenciasControlador.agregarCompetencia);
//cuando se llama a la ruta /competencias/:id/peliculas, se ejecuta la acción cargarPeliculas.
app.get('/competencias/:idCompetencia/peliculas', competenciasControlador.cargarPeliculas);
//cuando se llama a la ruta /competencias/:idCompetencia/resultados, se ejecuta la acción mostrarResultados.
app.get('/competencias/:idCompetencia/resultados', competenciasControlador.mostrarResultados);
//cuando se llama a la ruta /competencias/:idCompetencia/votos, se ejecuta la acción borrarCompetencia.
app.delete('/competencias/:idCompetencia/votos', competenciasControlador.reiniciarCompetencia);
//cuando se llama a la ruta /competencias/:idCompetencia/voto, se ejecuta la acción votar.
app.post('/competencias/:idCompetencia/voto', competenciasControlador.votar);
//cuando se llama a la ruta /generos, se ejecuta la acción obtenerGeneros.
app.get('/generos', competenciasControlador.obtenerGeneros);
//cuando se llama a la ruta /directores, se ejecuta la acción obtenerDirectores.
app.get('/directores', competenciasControlador.obtenerDirectores);
//cuando se llama a la ruta /actores, se ejecuta la acción obtenerActores.
app.get('/actores', competenciasControlador.obtenerActores);
//cuando se llama a la ruta /competencias/:id, se ejecuta la acción buscarCompetencia.
app.get('/competencias/:idCompetencia', competenciasControlador.buscarCompetencia);
//cuando se llama a la ruta /competencias/:id con verbo put se ejecuta la acción eliminarCompetencia.
app.put('/competencias/:idCompetencia', competenciasControlador.editarCompetencia);
//cuando se llama a la ruta /competencias/:id con verbo delete se ejecuta la acción eliminarCompetencia.
app.delete('/competencias/:idCompetencia', competenciasControlador.eliminarCompetencia);

//seteamos el puerto en el cual va a escuchar los pedidos la aplicación
var puerto = '8080';

app.listen(puerto, function () {
  console.log( "Escuchando en el puerto " + puerto );
});