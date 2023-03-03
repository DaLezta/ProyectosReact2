//Importar dependencias
const jwt = require('jwt-simple');
const moment = require("moment");

//Clave Secreta
const secret = "CLAVE_SECRETA_DEL_proyecto_de_la_red_Social_94384763231";

//Crear una funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nickm,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    }
    //Devolver jwt token codificado
    return jwt.encode(payload, secret); //Le colocamos el objeto que vamos a hacer jwt y la clave secreta para codificarlo
}


module.exports = {
    createToken,
    secret
}
