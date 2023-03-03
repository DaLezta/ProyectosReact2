//Importar modulos
const jwt = require('jwt-simple');
const moment = require("moment");

//Importar clave secreta
const libjwt = require('../services/jwt');

//Middleware de autenticacion
const auth = (req, res, next) => {

//Los headers contienen toda la informacion que mandamos como parametros en los headers

    //Comprobar si me llega la cabecera de autenticacion
    if (!req.headers.authorization) {
        return res.status(404).send({
            status: 'error',
            message: 'La peticion no tiene la cabecera de autenticacion'
        })
    }


    //Limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g, ''); //Quitamos todas las comillas o comillas dobles que vienen dentro del token

    //Decodificar el token
    try {
        let payload = jwt.decode(token, libjwt.secret); //Decodificamos el token con la palabra secreta

        //Comprobar expiracion del token
        if (payload.exp <= moment().unix()) {
            return res.status(404).send({
                status: 'error',
                message: 'Token Expirado'
            })
        }

        //Agregar datos de usuario a la request
        req.user = payload; //Cuardamos en la req los datos del usuario que sacamos del token
    } catch (error) {
        return res.status(404).send({
            status: 'error',
            message: 'Token Invalido',
            error:error
        })
    }

    //Pasar a la siguiente accion de la ruta ya que esto es un middleware
    next();

}


module.exports = {
    auth
}
