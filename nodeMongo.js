const fs = require('fs')

/*  -- CONFIGURACION --  */

//Nombre de la base de datos
let nombreDeLaBaseDeDatos = "Escuela"

//agregar las colecciones de la base de datos aca
let colecciones = {
    "usuario": {"nombre": "String", "edad": "String", "carrera": "String"},
    "carrera": {"nombre": "String", "pensum":"[]"}
}

/*  -- FIN CONFIGURACION --  */

//Arreglo con los nombres de las colecciones
let tituloDeLasColecciones = Object.keys(colecciones)

//retorna el esquema del objeto de una coleccion
function valorDeLaColeccionNumero(numeroDeLaColeccion){
    return colecciones[ tituloDeLasColecciones[numeroDeLaColeccion] ]
}

//devuelve un template con el modelo de la coleccion que corresponda al numero solicitado
function obtenerModeloDeLaColeccionNumero(numeroDeLaColeccion){
    return `const mongoose = require('mongoose');
const {Schema} = mongoose;

const ${tituloDeLasColecciones[numeroDeLaColeccion]} = new Schema(${JSON.stringify(valorDeLaColeccionNumero(numeroDeLaColeccion))});

module.exports = mongoose.model('${tituloDeLasColecciones[numeroDeLaColeccion]}', ${tituloDeLasColecciones[numeroDeLaColeccion]});`
}

/*  -- METODOS PARA CREAR LAS CARPETAS Y ARCHIVOS --  */

//este metodo crea las carpetas del proyecto
function generarEstructuraDeCarpetas(){
    console.log("generando estructura de las carpetas...")
    try{
        fs.mkdirSync('./src/database/',{recursive:true});
        fs.mkdirSync('./src/models/',{recursive:true});
        fs.mkdirSync('./src/public/',{recursive:true});
        fs.mkdirSync('./src/routes/',{recursive:true});
        console.log("Estructura de las carpetas creada! :)")
    }catch(err){
        console.log('Error al crear las carpetas :(')
        console.log(err)
    }
}

//este metodo crea el archivos server.js con la configuracion de express
function generarArchivoPrincipal(){
    console.log("Generando el archivo principal...")
    let ruta = "./src/"
    try{
        let contenido = `//requiero mis dependencias de desarrollo
const express = require('express');
const morgan = require('morgan');
const path = require('path');

//inicializo express y la base de datos
const app = express();
require('./database/database.js');

//configuro el puerto
app.set('port', process.env.PORT || 3000);

//defino la carpeta publica que enviara el servidor al cliente
app.use(express.static( path.join( __dirname, 'public' ) ));

//configuro los middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

app.use(require('./routes/routes.js'));

app.listen(app.get('port'), ()=>{
    console.log('el servidor esta a la escucha de peticiones en el puerto', app.get('port'));
})`
        fs.writeFileSync(ruta+"server.js", contenido);
        console.log("Archivo principal listos! :)")
    }catch(err){
        console.log('Error al crear el archivo principal :(')
        console.log(err)
    }
}

//este metodo crea el archivo database.js con la configuracion de la conexion de la base de datos
function generarConfiguracionDeLaBaseDeDatos(){
    console.log("Generando la configuracion de la base de datos...")
    let ruta = "./src/database/"
    try{
        let contenido = `const mongoose = require('mongoose');

const _url = 'mongodb://localhost:27017/${nombreDeLaBaseDeDatos}';

mongoose.connect(_url, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(db => console.log('Database is conected :)'))
    .catch(err => console.error(err));`
        fs.writeFileSync(ruta+"database.js", contenido);
        console.log("Archivo de la base de datos listos! :)")
    }catch(err){
        console.log('Error al crear el archivo de la base de datos :(')
        console.log(err)
    }
}

//este metodo crea los archivos de la carpeta "models"
function generarModelos(){
    console.log("Generando los modelos...")
    let numeroDeModelos = Object.keys(colecciones).length;
    let nombresDeLosModelos = Object.keys(colecciones);
    let ruta = "./src/models/"
    for(let i=0; i<numeroDeModelos; i++){
        try{
            let contenido = obtenerModeloDeLaColeccionNumero(i)+'';
            contenido = contenido.replace(/[ '"]+/g, ' ')
            fs.writeFileSync(ruta+nombresDeLosModelos[i]+".js", contenido);
            console.log("Modelo "+nombresDeLosModelos[i]+" listo!")
        }catch(err){
            console.log('Error al crear los modelos :(')
            console.log(err)
        }
    }
}

function generarRutas(){
    
}

generarEstructuraDeCarpetas()
generarArchivoPrincipal()
generarConfiguracionDeLaBaseDeDatos()
generarModelos()

