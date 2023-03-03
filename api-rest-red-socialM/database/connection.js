//Importamos mongoose
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);//Le indicamos que no necesitamos ninguna configuracion para los querys

//Hacemos la conexion async para poder esperar a que se realice la conexion.
const connection = async() =>{
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/mi_redsocial"); //Realizamos la conexion a la base de datos.

        console.log("Conectado correctamente a bd: mi_redsocial");
    }catch(e){
console.log(e);
throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports={
    connection
}