const fs = require('fs');

//edit just this Json :)
const settings = {
    project_s_name: "generateProject",//String
    database_name: "exampleDb",//String
    server_port: 3000,//int
    login: false,//boolean
    socket_io: true,
    collections: //obj
    {
        "client": {"type": "String", "last_name": "String", "name": "String", "town": "String"},
        "item": {"album": "String","year": "String", "amount":"String", "price": "String", "artist": "String"}
    }
};

const vector_collections_names = Object.keys(settings.collections);
const total_number_of_collections = vector_collections_names.length;
const get_the_value_of_the_collection_by_position = (position) => settings.collections[vector_collections_names[position]];

const generate_folder_structure = ()=>{
    try{
        if(settings.socket_io){
            fs.mkdirSync(`./${settings.project_s_name}/src/socket/`,{recursive:true});
        }
        fs.mkdirSync(`./${settings.project_s_name}/src/database/`,{recursive:true});
        fs.mkdirSync(`./${settings.project_s_name}/src/models/`,{recursive:true});
        fs.mkdirSync(`./${settings.project_s_name}/src/public/`,{recursive:true});
        fs.mkdirSync(`./${settings.project_s_name}/src/routes/`,{recursive:true});
    }catch(e){
        console.log('Err in generate_folder_structure | '+e)
    }
}

const create_main_file = ()=>{
    let content = `//requiero mis dependencias de desarrollo
`;
    if(settings.socket_io){
        content += `const socket = require('./socket/socket.js');`
    }
    content += `
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');

//inicializo express y la base de datos
const app = express();
require('./database/database.js');

//configuro el puerto
app.set('port', process.env.PORT || ${settings.server_port});

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
`

    if(settings.socket_io){
        content += `
//montamos el servidor en la variable http
const http = require('http').createServer(app);

//montamos el socket como middleware para que este a la escucha
socket(http);

//ponemos el servidor a la escucha de peticiones
http.listen(app.get('port'), ()=>{
    console.log('El servidor esta a la escucha de peticiones en el puerto', app.get('port'));
});`
    }else{
        content += `
app.listen(app.get('port'), ()=>{
    console.log('el servidor esta a la escucha de peticiones en el puerto', app.get('port'));
})`
    }

    try{
        fs.writeFileSync(`./${settings.project_s_name}/src/server.js`, content)
    }catch(e){
        console.log('Err in create_main_file | '+e)
    }
}

const create_file_with_database_connection = ()=>{
    let content = `const mongoose = require('mongoose');

const _url = 'mongodb://localhost:27017/${settings.database_name}';

mongoose.connect(_url, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(db => console.log('Database is conected :)'))
    .catch(err => console.error(err));`
    try{
        fs.writeFileSync(`./${settings.project_s_name}/src/database/database.js`, content)
    }catch(e){
        console.log('Err in create_file_with_database_connection | '+e)
    }
}

const get_collection_model_in_position = (position)=>{
    return `const mongoose = require('mongoose');
const {Schema} = mongoose;

const ${vector_collections_names[position]} = new Schema(${JSON.stringify(get_the_value_of_the_collection_by_position(position))});

module.exports = mongoose.model('${vector_collections_names[position]}', ${vector_collections_names[position]});`
}
const create_files_with_collection_schemas = ()=>{
    let re = /"/g;
    let content;
    if(settings.login){
        content = `const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const {Schema} = mongoose;

const user = new Schema({name: String,email: String,password: String});

user.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

user.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('user', user);`
        try{
            fs.writeFileSync(`./${settings.project_s_name}/src/models/user.js`, content);
        }catch(e){
            console.log('Err in create_files_with_collection_schemas, user | '+e)
        }
    
    }
    for(let i=0; i<total_number_of_collections; i++){
        content = get_collection_model_in_position(i).replace(re, '');
        try{
            fs.writeFileSync(`./${settings.project_s_name}/src/models/${vector_collections_names[i]}.js`, content)
        }catch(e){
            console.log('Err in create_files_with_collection_schemas, i='+i+' | '+e)
        }
    }
}

const get_template_import_models = ()=>{
    let content;
    if(settings.login){
        content += `
const jwt = require('jsonwebtoken')
const secretToken = 'exampleSecretToken'

const _user = require('../models/user');
`
    }
    for(let i=0; i<total_number_of_collections; i++){
        content += `
const _${vector_collections_names[i]} = require('../models/${vector_collections_names[i]}');
`
    }
    return content;
}
const get_data_validation = (position)=>{
    const vector_with_the_keys_of_the_value_of_the_collection_in_position = Object.keys(get_the_value_of_the_collection_by_position(position));
    let req_body_imports = `const {`;
    let import_conditions = ``;
    for(let i=0; i<vector_with_the_keys_of_the_value_of_the_collection_in_position.length; i++){
        if(i!=0){
            req_body_imports += `, ${vector_with_the_keys_of_the_value_of_the_collection_in_position[i]}`
        }else{
            req_body_imports += `${vector_with_the_keys_of_the_value_of_the_collection_in_position[i]}`
        }
        import_conditions += `
    if(${vector_with_the_keys_of_the_value_of_the_collection_in_position[i]}){
        _${vector_collections_names[position]}Find.${vector_with_the_keys_of_the_value_of_the_collection_in_position[i]} = ${vector_with_the_keys_of_the_value_of_the_collection_in_position[i]};
    }
`
    }
    req_body_imports += `} = req.body;`

    return req_body_imports + import_conditions;
}
const get_method_get_from_collection = (position)=>{
    if(settings.login){
        return `router.get('/api/${vector_collections_names[position]}', async (req, res)=>{
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
    const _${vector_collections_names[position]}Find = await _${vector_collections_names[position]}.find();
    res.json({
        ${vector_collections_names[position]}s: _${vector_collections_names[position]}Find
    });
});`
    }else{
        return `
router.get('/api/${vector_collections_names[position]}', async (req, res)=>{
    const _${vector_collections_names[position]}Find = await _${vector_collections_names[position]}.find();
    res.json({
        ${vector_collections_names[position]}s: _${vector_collections_names[position]}Find
    });
});`
    }
    
}
const get_method_post_from_collection = (position)=>{
    if(settings.login){
        return `router.post('/api/${vector_collections_names[position]}', async (req, res)=>{
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
    const _${vector_collections_names[position]}Save = new _${vector_collections_names[position]}(req.body);
    await _${vector_collections_names[position]}Save.save();
    const _${vector_collections_names[position]}Find = await _${vector_collections_names[position]}.find();
    res.json({
        ${vector_collections_names[position]}s: _${vector_collections_names[position]}Find
    });
});`
    }else{
        return `router.post('/api/${vector_collections_names[position]}', async (req, res)=>{
    const _${vector_collections_names[position]}Save = new _${vector_collections_names[position]}(req.body);
    await _${vector_collections_names[position]}Save.save();
    const _${vector_collections_names[position]}Find = await _${vector_collections_names[position]}.find();
    res.json({
        ${vector_collections_names[position]}s: _${vector_collections_names[position]}Find
    });
});`
    }
    
}
const get_method_put_from_collection = (position)=>{
    if(settings.login){
        return `router.put('/api/${vector_collections_names[position]}/:id', async (req, res)=>{
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
    const _${vector_collections_names[position]}Find = await _${vector_collections_names[position]}.findOne({_id: id});
    ${get_data_validation(position)}
    await _${vector_collections_names[position]}.update({_id: id}, _${vector_collections_names[position]}Find);
    res.json({
        ${vector_collections_names[position]}: _${vector_collections_names[position]}Find
    });
});`
    }else{
        return `router.put('/api/${vector_collections_names[position]}/:id', async (req, res)=>{
    const {id} = req.params;
    const _${vector_collections_names[position]}Find = await _${vector_collections_names[position]}.findOne({_id: id});
    ${get_data_validation(position)}
    await _${vector_collections_names[position]}.update({_id: id}, _${vector_collections_names[position]}Find);
    res.json({
        ${vector_collections_names[position]}: _${vector_collections_names[position]}Find
    });
});`
    }
    
}
const get_method_delete_from_collection = (position)=>{
    if(settings.login){
        return `router.delete('/api/${vector_collections_names[position]}/:id', async (req, res)=>{
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
    await _${vector_collections_names[position]}.remove({_id: id});
    const _${vector_collections_names[position]}Find = await _${vector_collections_names[position]}.find();
    res.json({
        ${vector_collections_names[position]}s: _${vector_collections_names[position]}Find
    });
});`
    }else{
        return `router.delete('/api/${vector_collections_names[position]}/:id', async (req, res)=>{
    const {id} = req.params;
    await _${vector_collections_names[position]}.remove({_id: id});
    const _${vector_collections_names[position]}Find = await _${vector_collections_names[position]}.find();
    res.json({
        ${vector_collections_names[position]}s: _${vector_collections_names[position]}Find
    });
});`
    }
    
}
const obtain_end_points = ()=>{
    let content;
    if(settings.login){
        content += `//const {name, email, password} = req.body;
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
    for(let i=0; i<total_number_of_collections; i++){
        //por cada modelo hacemos sus get;post;put;delete
        content += `
` + get_method_get_from_collection(i) + `

` + get_method_post_from_collection(i) + `

` + get_method_put_from_collection(i) + `

` + get_method_delete_from_collection(i) + ``
    }
    return content;
}
const create_routes_file = ()=>{
    let content = `const express = require('express');
const router = express.Router();
${get_template_import_models()}
${obtain_end_points()}

module.exports = router;`;

    let re = /undefined/g;
    content = content.replace(re, '')

    try{
        fs.writeFileSync(`./${settings.project_s_name}/src/routes/routes.js`, content);
    }catch(e){
        console.log('Err in create_routes_file | '+e)
    }
}

const create_socket_file = ()=>{
    const content = `module.exports = (http)=>{
    
        const io = require('socket.io')(http);
        
        io.on('connection', (socket)=>{
        
            console.log('User Connected');
            
            socket.on('chat-client', (obj)=>{
                io.emit('chat-server', obj);            
            });
            
            socket.on('disconnect', (obj)=>{
                console.log('User Disconnected');
            });
            
        });
        
    }`
    try{
        if(settings.socket_io){
            fs.writeFileSync(`./${settings.project_s_name}/src/socket/socket.js`, content);
        }        
    }catch(e){
        console.log('Err in create_socket_file | '+e)
    }
}

const create_readme_file = ()=>{
    let additional_modules;
    if(settings.login){additional_modules += `bcrypt-nodejs jsonwebtoken`}
    if(settings.socket_io){additional_modules += `socket.io@2.3.0`}

    let content = `Abre una terminar el la carpeta del proyecto y ejecuta paso a paso los siguientes comandos:

1. npm init -y
2. npm install express mongoose morgan cors ${additional_modules}
3. node src/server.js`

    if(settings.socket_io){
        content += `
        
recuerda! para usar el socket debes poner esta linea en tu documento html

"<script src="/socket.io/socket.io.js"></script>"

luego en un js puedes usar los dos metodos "on" y "emit" de la variable "socket"

const socket = io();

Aqui un ejemplo practico:

<button id="test-chat">mandar un hola mundo al socket</button>

<script src="/socket.io/socket.io.js"></script>

<script>
    const socket = io();

    socket.on('chat-server', (obj)=>{
        console.log('esto te envia el servidor: '+JSON.stringify(obj))
    })

    document.querySelector("#test-chat").addEventListener('click', function(){
        socket.emit('chat-client', {message: 'hola mundo'})
    })
    
</script>

`
    }

    let re = /undefined/g;
    content = content.replace(re, '')
    try{
        fs.writeFileSync(`./${settings.project_s_name}/README.md`, content)
    }catch(e){
        console.log('Err in create_readme_file | '+e)
    }
}

generate_folder_structure();
create_main_file();
create_file_with_database_connection();
create_files_with_collection_schemas();
create_routes_file();
create_socket_file();
create_readme_file();