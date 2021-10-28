const fs = require('fs')

/*
if(fs.existsSync(archivo)){
    console.log("El archivo existe")
}else{
    console.log("El archivo no existe")
}*/

/* Creando carpeta
try{
    fs.mkdirSync("carpetaPrueba")
}catch(err){
    console.log('Error: '+err)
}*/

let filePath = "./carpetaPrueba/prueba.txt";
let fileContent = 
`chupala

chupala x2`

try{
    fs.writeFileSync(filePath, fileContent);
}catch(err){
    console.log('Error: '+err)
}
