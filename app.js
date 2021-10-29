const fs = require('fs')

/*  -- CONFIGURACION --  */

//Nombre de la base de datos
let nombreDeLaBaseDeDatos = "Escuela"

//Configurar preferencias
//si agregarLogin==true, no agregues la coleccion del usuario, ya se pone sola
let preferencias = {
    agregarLogin: true
}

//Agregar las colecciones de la base de datos aca
let colecciones = {
    "usuario": {"nombre": "String", "edad": "String", "carrera": "String"},
    "carrera": {"nombre": "String", "pensum":"[]"}
}

/*  -- METODOS UTILES --  */

//Arreglo con los nombres de las colecciones
let tituloDeLasColecciones = Object.keys(colecciones)

//retorna el esquema del objeto de una coleccion
function valorDeLaColeccionNumero(numeroDeLaColeccion){
    return colecciones[ tituloDeLasColecciones[numeroDeLaColeccion] ]
}

function obtenerTemplateDeImportacionDeModelosEnRoutes(){
    let numeroDeModelos = Object.keys(colecciones).length;
    let nombresDeLosModelos = Object.keys(colecciones);
    let contenido;
    if(preferencias.agregarLogin){
        contenido += `
const jwt = require('jsonwebtoken')
const secretToken = 'nekomotsuSecretToken'

const _user = require('../models/user');
        `
    }
    for(let i=0; i<numeroDeModelos; i++){
        contenido += `
const _${nombresDeLosModelos[i]} = require('../models/${nombresDeLosModelos[i]}');
`
    }
    return contenido;
}

function obtenerMetodoGetDeLaColeccion(numeroDeLaColeccion){
    if(preferencias.agregarLogin){
        return `router.get('/api/${tituloDeLasColecciones[numeroDeLaColeccion]}', async (req, res)=>{
    const tokenClient = req.header('x-access-token');
    if(!tokenClient){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    const decoded = jwt.verify(tokenClient, secretToken);
    const user = await _user.findById(decoded.id, {password: 0});
    if(!user){
        return res.json({
            auth: false,
            message: 'No user found'
        })
    }
    //si llega aqui es por que encontro el usuario gracias al token
    const _${tituloDeLasColecciones[numeroDeLaColeccion]}Find = await _${tituloDeLasColecciones[numeroDeLaColeccion]}.find();
    res.json({
        ${tituloDeLasColecciones[numeroDeLaColeccion]}s: _${tituloDeLasColecciones[numeroDeLaColeccion]}Find
    });
});`
    }else{
        return `router.get('/api/${tituloDeLasColecciones[numeroDeLaColeccion]}', async (req, res)=>{
    const _${tituloDeLasColecciones[numeroDeLaColeccion]}Find = await _${tituloDeLasColecciones[numeroDeLaColeccion]}.find();
    res.json({
        ${tituloDeLasColecciones[numeroDeLaColeccion]}s: _${tituloDeLasColecciones[numeroDeLaColeccion]}Find
    });
});`
    }
    
}

function obtenerMetodoPostDeLaColeccion(numeroDeLaColeccion){
    if(preferencias.agregarLogin){
        return `router.post('/api/${tituloDeLasColecciones[numeroDeLaColeccion]}', async (req, res)=>{
    const tokenClient = req.header('x-access-token');
    if(!tokenClient){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    const decoded = jwt.verify(tokenClient, secretToken);
    const user = await _user.findById(decoded.id, {password: 0});
    if(!user){
        return res.json({
            auth: false,
            message: 'No user found'
        })
    }
    //si llega aqui es por que encontro el usuario gracias al token
    const _${tituloDeLasColecciones[numeroDeLaColeccion]}Save = new _${tituloDeLasColecciones[numeroDeLaColeccion]}(req.body);
    await _${tituloDeLasColecciones[numeroDeLaColeccion]}Save.save();
    res.json('Se creo el documento en la coleccion ${tituloDeLasColecciones[numeroDeLaColeccion]}')
});`
    }else{
        return `router.post('/api/${tituloDeLasColecciones[numeroDeLaColeccion]}', async (req, res)=>{
    const _${tituloDeLasColecciones[numeroDeLaColeccion]}Save = new _${tituloDeLasColecciones[numeroDeLaColeccion]}(req.body);
    await _${tituloDeLasColecciones[numeroDeLaColeccion]}Save.save();
    res.json('Se creo el documento en la coleccion ${tituloDeLasColecciones[numeroDeLaColeccion]}')
});`
    }
    
}

function obtenerMetodoPutDeLaColeccion(numeroDeLaColeccion){
    if(preferencias.agregarLogin){
        return `router.put('/api/${tituloDeLasColecciones[numeroDeLaColeccion]}/:id', async (req, res)=>{
    const tokenClient = req.header('x-access-token');
    if(!tokenClient){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    const decoded = jwt.verify(tokenClient, secretToken);
    const user = await _user.findById(decoded.id, {password: 0});
    if(!user){
        return res.json({
            auth: false,
            message: 'No user found'
        })
    }
    //si llega aqui es por que encontro el usuario gracias al token
    const {id} = req.params;
    await _${tituloDeLasColecciones[numeroDeLaColeccion]}.update({_id: id}, req.body);
    res.json('Se actualizo el documento de la coleccion ${tituloDeLasColecciones[numeroDeLaColeccion]} con id: '+id)
});`
    }else{
        return `router.put('/api/${tituloDeLasColecciones[numeroDeLaColeccion]}/:id', async (req, res)=>{
    const {id} = req.params;
    await _${tituloDeLasColecciones[numeroDeLaColeccion]}.update({_id: id}, req.body);
    res.json('Se actualizo el documento de la coleccion ${tituloDeLasColecciones[numeroDeLaColeccion]} con id: '+id)
});`
    }
    
}

function obtenerMetodoDeleteDeLaColeccion(numeroDeLaColeccion){
    if(preferencias.agregarLogin){
        return `router.delete('/api/${tituloDeLasColecciones[numeroDeLaColeccion]}/:id', async (req, res)=>{
    const tokenClient = req.header('x-access-token');
    if(!tokenClient){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    const decoded = jwt.verify(tokenClient, secretToken);
    const user = await _user.findById(decoded.id, {password: 0});
    if(!user){
        return res.json({
            auth: false,
            message: 'No user found'
        })
    }
    //si llega aqui es por que encontro el usuario gracias al token
    const {id} = req.params;
    await _${tituloDeLasColecciones[numeroDeLaColeccion]}.remove({_id: id});
    res.json('Se elimino el documento de la coleccion ${tituloDeLasColecciones[numeroDeLaColeccion]} con id: '+id)
});`
    }else{
        return `router.delete('/api/${tituloDeLasColecciones[numeroDeLaColeccion]}/:id', async (req, res)=>{
    const {id} = req.params;
    await _${tituloDeLasColecciones[numeroDeLaColeccion]}.remove({_id: id});
    res.json('Se elimino el documento de la coleccion ${tituloDeLasColecciones[numeroDeLaColeccion]} con id: '+id)
});`
    }
    
}

function obtenerEndPoints(){
    let numeroDeModelos = Object.keys(colecciones).length;
    let contenido;
    if(preferencias.agregarLogin){
        contenido += `//const {name, email, password} = req.body;
router.post('/api/signup', async (req, res)=>{
    const {name, email, password} = req.body;
    const user = await _user.findOne({email: email});
    if(user){
        return res.json({
            auth: false,
            message: "Parece que tu Doppelgänger ya a creado una cuenta con este correo :( que miedo!   "
        })
    }
    const userSave = new _user({
        name,
        email,
        password
    });
    userSave.password = await userSave.encryptPassword(userSave.password);
    await userSave.save();
    const token = jwt.sign({id: userSave._id}, secretToken, {
        expiresIn: 60 * 60 * 24 * 2
    })
    res.json({
        auth: true,
        token
    })
});

//const {email, password} = req.body;
router.post('/api/signin', async (req, res)=>{
    const {email, password} = req.body;
    const user = await _user.findOne({
        email
    });
    if(!user){
        return res.json({
            auth: false,
            message: "No existe una cuenta Woble con este correo :(   "
        })
    }
    const passwordIsValid = await user.comparePassword(password);
    if(!passwordIsValid){
        return res.json({
            auth: false,
            message: "Esta contraseña no coincide con la cuenta "+email+'   '
        })
    }
    const token = jwt.sign({id: user._id}, secretToken, {
        expiresIn: 60 * 60 * 24 * 2
    })
    res.json({
        auth: true,
        token
    })
});

router.get('/api/user', async (req, res)=>{
    const tokenClient = req.header('x-access-token');
    if(!tokenClient){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    const decoded = jwt.verify(tokenClient, secretToken);
    const user = await _user.findById(decoded.id, {password: 0});
    if(!user){
        return res.json({
            auth: false,
            message: 'No user found'
        })
    }
    res.json({
        auth: true,
        user
    })
});
//const {name, email, changepass, password} = req.body;
router.put('/api/user', async (req, res)=>{
    const tokenClient = req.header('x-access-token');
    if(!tokenClient){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    const decoded = jwt.verify(tokenClient, secretToken);
    const user = await _user.findById(decoded.id);
    if(!user){
        return res.json({
            auth: false,
            message: 'No user found'
        })
    }
    //si llega aqui es por que encontro el usuario gracias al token
    //ahora procedo a editar el usuario
    const {name, email, changepass, password} = req.body;
    user.name = name;
    user.email = email;
    if(changepass == true && password != ''){
        user.password = user.encryptPassword(password);
    }
    await _user.updateOne({_id: user._id}, user);
    res.json({
        auth: true,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
        }
    })
});

router.delete('/api/user', async (req, res)=>{
    const tokenClient = req.header('x-access-token');
    if(!tokenClient){
        return res.status(401).json({
            auth: false,
            message: 'No token provided'
        });
    }
    const decoded = jwt.verify(tokenClient, secretToken);
    const user = await _user.findById(decoded.id);
    if(!user){
        return res.json({
            auth: false,
            message: 'No user found'
        })
    }
    //si llega aqui es por que encontro el usuario gracias al token
    //ahora procedo a eliminar el usuario
    await _user.remove({_id: user._id});
    res.json({
        auth: false,
        message: 'User delete'
    })
});`
    }
    for(let i=0; i<numeroDeModelos; i++){
        //por cada modelo hacemos sus get;post;put;delete
        contenido += `
` + obtenerMetodoGetDeLaColeccion(i) + `

` + obtenerMetodoPostDeLaColeccion(i) + `

` + obtenerMetodoPutDeLaColeccion(i) + `

` + obtenerMetodoDeleteDeLaColeccion(i) + ``
    }
    return contenido;
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
const cors = require('cors');

//inicializo express y la base de datos
const app = express();
require('./database/database.js');

//configuro el puerto
app.set('port', process.env.PORT || 3000);

//defino la carpeta publica que enviara el servidor al cliente
app.use(express.static( path.join( __dirname, 'public' ) ));

//configuro los middlewares
app.use(morgan('dev'));
app.use(cors());
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
    let contenido;
    if(preferencias.agregarLogin){
        contenido = `const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const {Schema} = mongoose;

const user = new Schema({
    name: String,
    email: String,
    password: String
});

user.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

user.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', user);`

fs.writeFileSync(ruta+"user.js", contenido);

    }
    for(let i=0; i<numeroDeModelos; i++){
        try{
            contenido = obtenerModeloDeLaColeccionNumero(i)+'';
            let re = /"/g;
            contenido = contenido.replace(re, '')
            fs.writeFileSync(ruta+nombresDeLosModelos[i]+".js", contenido);
            console.log("Modelo "+nombresDeLosModelos[i]+" listo!")
        }catch(err){
            console.log('Error al crear los modelos :(')
            console.log(err)
        }
    }
}

//este metodo crea el archivo routes.js con los endPoints
function generarRutas(){
    console.log("Creando el archivo de rutas...")
    let cabezaDeRoutes = `const express = require('express');
const router = express.Router();`
    let modelos = obtenerTemplateDeImportacionDeModelosEnRoutes();
    let endPoints = obtenerEndPoints();
    let exportarRoutes = `module.exports = router;`
    
    let contenido = `${cabezaDeRoutes}
${modelos}
${endPoints}

${exportarRoutes}`;

    let ruta = "./src/routes/"

    var re = /undefined/g;
    contenido = contenido.replace(re, '')

    try{
        fs.writeFileSync(ruta+"routes.js", contenido);
        console.log("Archivo de rutas listo!")
    }catch(err){
        console.log('Error al crear el archivo de rutas :(')
        console.log(err)
    }
}

function crearProyecto(){
    console.log("********** Crud Node & MongoDb By Nekomotsu9029 *********")
    generarEstructuraDeCarpetas()
    generarArchivoPrincipal()
    generarConfiguracionDeLaBaseDeDatos()
    generarModelos()
    generarRutas()
    console.log(`
********** Proyecto creado *********

Ejecuta estos comandos secuencialmente

1. npm init -y
2. npm install express mongoose morgan
3. node src/server.js
`)
}

crearProyecto()