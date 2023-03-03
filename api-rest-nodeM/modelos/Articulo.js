// Cuando vamos a utilizar un modelo para interactuar con la base es necesario utilizar Schema y model que provienen de mongoose
// Esto para nosotros poder establecer el esquema y exportar el modelo
const {Schema,model} = require('mongoose');

//Estos tipos de datos podemos verlos en la documentacion oficial de mongo
const ArticuloShema = Schema({
    titulo: {
        type:String,
        required:true, //Esto significa que el campo es necesario
        unique: true //Esto verifica que el campo no exista en la base de datos
    },
    contenido:{
        type:String,
        required:true
    },
    fecha:{
        type:Date,
        default: Date.now //Por defecto podemos agregar valores sin colocarlos
    },
    imagen:{
        type:String,
        default:"default.png"
    },
});

//Cuando vamos a exportar necesitamos indicar el nombre del modelo, el esquema y el nombre de la coleccion de la base de datos.
module.exports = model("Articulo",ArticuloShema,"articulos");