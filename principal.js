//opciones para el yargs
const opciones = {
  id: {
    demand: true,
    alias: "i"
  },
  nombre: {
    demand: true,
    alias: "n"
  },
  cedula: {
    demand: true,
    alias: "x"
  }
}

//importaciones
const argv = require('yargs')
  .command('inscribir', 'Inscribir un curso', opciones)
  .argv;
var { cursos } = require('./datos')
const fs = require('fs')

//función para mostrar un curso en la consola y esperar los 2 segundos
function mostarCurso(cursos, posicion, callback) {
  const curso = cursos[posicion];
  setTimeout(function () {
    var { id, nombre, duracion, valor } = curso;
    console.log('El curso con id: ' + id + ' se llama ' + nombre + ' tiene una duración de ' + duracion + ' horas y tiene un valor de $' + valor + ' pesos')
    callback(posicion)
  }, 2000);
}
//funcion para iterar y leer todos los cursos
var contador = 0
function cargarCursos() {
  mostarCurso(cursos, contador, posicion => {
    if (posicion < cursos.length - 1) {
      contador = posicion + 1;
      cargarCursos();
    }
  })
}
//función para crear el archivo con los datos de la inscripción
function crearArchivo(cedula, nombreEstudiante, curso) {
  var { id, nombre: nombreCurso, duracion, valor } = curso;
  var texto = `El estudiante ${nombreEstudiante} con cedula ${cedula} \nse ha matrículado al curso con id ${id} llamado ${nombreCurso} \nel cual tiene una duración de ${duracion} horas y tiene un costo de $${valor} pesos`;
  fs.writeFile("matricula.txt", texto, (err) => {
    if (err) {
      console.log("Ha ocurrido un error creando el archivo")
    } else {
      console.log("Se ha creado el archivo y generado la inscripción")
    }
  });
}
//función que valida los datos para inscribir un curso
function inscribirCurso(id, nombre, cedula) {
  let curso = cursos.find(function (curso) {
    return curso.id == id
  })
  if (curso == undefined) {
    console.log("No se encuentra el ID del curso");
  } else {
    crearArchivo(cedula, nombre, curso);
  }
}
//comprobación de que se quiere realizar
if (argv._[0] == "inscribir") {
  var { i, n, x } = argv;
  inscribirCurso(i, n, x)
} else {
  cargarCursos();
}