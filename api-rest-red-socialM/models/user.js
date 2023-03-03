const { Schema, model } = require('mongoose');

const userShema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    bio:String,
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        default:"role_user"
    },
    image:{
        type:String,
        default: "default.png"
    },
    created_at:{
        type: Date,
        default: Date.now
    }
});

//El nombre de la coleccion que escribamos al final es el nombre que va crear en la base o en el caso de existir a esa tabla caerian
module.exports = model("User",userShema,"users"); //Colocamos el nombre del modelo, el esquema y el nombre de la coleccion de datos en mongo