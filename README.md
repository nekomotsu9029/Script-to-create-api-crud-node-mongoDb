# Como usar?

Copia el script "app.js" y pegalo en la carpeta donde tendras el proyecto,  luego configura el script, y por ultimo ejecuta el script desde la consola "node app.js".

## Configuracion del script

const settings = {

    project_s_name: "generateProject",//String

    database_name: "exampleDb",//String

    server_port: 3000,//int

    login: true,//boolean

    graphql: false,//boolean

    collections: //obj

    {

        "client": {"type": "String", "last_name": "String", "name": "String", "town": "String"},

        "item": {"album": "String","year": "String", "amount":"String", "price": "String", "artist": "String"}

    }
    
};

* project_s_name: es el nombre de la carpeta que almacenara tu proyecto
* database_name: es el nombre de la base de datos mongoDb que crearas
* server_port: es el puerto donde quieres que corra el servidor
* login: es un booleano, si esta en "true", se creara una coleccion adicional llamada "user" y se agregaran los endPoints de logeo y gestion, ademas que las rutas se protegeran usando token
* graphql: el servidor por defecto se construye como un servidor REST, pero si este campo es "true" se montara como una api de graphql
* collections: en este objeto se deben agregar las colecciones que tendra nuestra base de datos

## Reglas

Si una coleccion se llama "tarea" sera tageada en rutas como "_tarea"

## Cosas que debo hacer

1. agregar la funcionalidad de crear servidor graphql
2. hacer mas usable el endPoint de put, validando cada campo recibido, con el fin de solo enviar los datos a cambiar, y si no se envian permanezcan igual