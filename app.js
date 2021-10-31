const fs = require('fs');

let settings = {
    project_s_name: "generateProject",//String
    database_name: "wobleDb",//String
    server_port: 3000,//int
    login: true,//boolean
    collections: //obj
    {
        "cliente": {"tipo": "String", "apellido": "String", "nombre": "String", "ciudad": "String"},
        "item": {"album": "String","año": "String", "cantidad":"String", "precio": "String", "artista": "String"}
    }
};

