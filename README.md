# Como usar?

Copia el script "app.js" y pegalo en la carpeta donde tendras el proyecto, luego en una consola abierta dentro de la carpeta debes configurar el script definiendo el nombre y haciendo un objeto que contenga todas las colecciones que tendra nuestra base de datos MongoDB.

*Ejemplo de configuracion:*

//Nombre de la base de datos

let nombreDeLaBaseDeDatos = "Escuela"

//Agregar las colecciones de la base de datos aca, siguiendo la logica de dupla, clave y tipo de dato

let colecciones = {
    "usuario": {"nombre": "String", "edad": "String", "carrera": "String"},
    "carrera": {"nombre": "String", "pensum":"[]"}
}

*fin del ejemplo*

luego en la carpeta se debe abrir en la terminal o cmd, y ejecutar los siguientes comandos:

1. node app.js
2. npm init -y
3. npm install express mongoose morgan
4. node src/server.js

## Esto esta probado para las versiones

"express": "^4.17.1",
"mongoose": "^6.0.12",
"morgan": "^1.10.0"

## Reglas

Si una coleccion se llama "usuario" sera tageada en rutas como "_usuario"

## Cosas que debo hacer

1. Que todo responda un json
2. Que post, put, delete regresen los datos por el response
3. Agregar login y que se maneje por token