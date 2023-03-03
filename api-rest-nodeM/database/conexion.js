const mongoose = require('mongoose'); //lo que hace esto es ir a las dependencias del package y tomar esa dependencia

mongoose.set('strictQuery', false);//Le indicamos que no necesitamos ninguna configuracion para los querys

const conexion = async () => { //es async por si es que tarda un poco la conexion a la base, por eso se coloca await a connect
    try {

        // Conectamos a la base de datos de mongo dependiendo de su URL o puerto
        await mongoose.connect('mongodb://127.0.0.1:27017/mi_blog'); //Aqui solo se coloca la URL de la conexion de la base de datos seguido del nombre 
        //de la base de datos despues del /.

        console.log('Conexion con la base de datos exitosa!');
    } catch (e) {
        console.log(e);
        throw new Error('No se ha podido conectar a la base de datos');
    }
}

// Con esto exportamos la conexion para que se pueda visualizar en otros documentos cuando se llame
module.exports = {
    conexion
}