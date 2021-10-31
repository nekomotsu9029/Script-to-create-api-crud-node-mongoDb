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

* project_s_name: Es el nombre de la carpeta que almacenara tu proyecto.
* database_name: Es el nombre de la base de datos mongoDb que crearas.
* server_port: Es el puerto donde quieres que corra el servidor.
* login: Es un booleano, si esta en "true", se creara una coleccion adicional llamada "user" y se agregaran los endPoints de logeo y gestion, ademas que las rutas se protegeran usando token.
* graphql: El servidor por defecto se construye como un servidor REST, pero si este campo Es "true" se montara como una api de graphql.
* collections: En este objeto se deben agregar las colecciones que tendra nuestra base de datos.

## Reglas

Si una coleccion se llama "tarea" sera tageada en rutas como "_tarea".

## Cosas que debo hacer

1. agregar la funcionalidad de crear servidor graphql.
2. post debe regresar solo el objeto creado al igual que put
3. agregar comentarios al codigo generado.
4. poder configurar si una coleccion se deben filtrar respuestas en funcion de un campo que haga referencia al id del usuario logeado.
5. soportar mas bases de datos