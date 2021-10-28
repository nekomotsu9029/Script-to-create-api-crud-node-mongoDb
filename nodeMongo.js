/*  -- CONFIGURACION --  */

//Nombre de la base de datos
let nombreBd = "Escuela"

//agregar las colecciones de la base de datos aca
let colecciones = {
    "usuario": {"nombre": "String", "edad": "String", "carrera": "String"},
    "carrera": {"nombre": "String", "pensum":"[]"}
}

/*  -- FIN CONFIGURACION --  */

//Arreglo con los nombres de las colecciones
let tituloDeLasColecciones = Object.keys(colecciones)

//numero total de colecciones
let numeroDeColecciones = tituloDeLasColecciones.length;

//retorna el esquema del objeto de una coleccion
function valorDeLaColeccionNumero(numeroDeLaColeccion){
    return colecciones[ tituloDeLasColecciones[numeroDeLaColeccion] ]
}

//devuelve un template con el modelo de la coleccion que corresponda al numero solicitado
function obtenerModeloDeLaColeccionNumero(numeroDeLaColeccion){
    return `
const mongoose = require('mongoose');
const {Schema} = mongoose;

const ${tituloDeLasColecciones[numeroDeLaColeccion]} = new Schema(${JSON.stringify(valorDeLaColeccionNumero(numeroDeLaColeccion))});

module.exports = mongoose.model('${tituloDeLasColecciones[numeroDeLaColeccion]}', ${tituloDeLasColecciones[numeroDeLaColeccion]});  
`
}


for(let i=0; i<numeroDeColecciones; i++){
    console.log("------------------------------------------")
    console.log(obtenerModeloDeLaColeccionNumero(i))
    console.log("------------------------------------------")
}