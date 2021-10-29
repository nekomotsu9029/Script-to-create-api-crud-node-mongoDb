# Como usar?
Primero se debe configurar definiendo el nombre y haciendo un objeto que contenga todas las colecciones que tendra nuestra base de datos MongoDB.

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

1. npm init -y
2. npm install express mongoose morgan
3. node src/server.js

## Esto esta probado para las versiones

"express": "^4.17.1",
"mongoose": "^5.12.11",
"morgan": "^1.10.0"

## Reglas
Si una coleccion se llama "usuario" sera tageada en rutas como "_usuario"