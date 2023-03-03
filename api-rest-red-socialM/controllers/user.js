//Importar dependencias y modulos
const User = require("../models/user"); //Modelo de usuario
const bcrypt = require("bcrypt");
const mongoosePaginate = require('mongoose-pagination');
const fs = require('fs');
const path = require('path')

//Importar servicios
const jwt = require('../services/jwt');

const pruebaUser = (req, res) => {
    return res.status(200).send({
        status: 'success',
        message: 'Metodo ejecutado con middleware',
        user: req.user
    })
}

const register = (req, res) => {
    //Recojer datos de la peticion
    let params = req.body;

    //Comprobar que me llegan bien 
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(404).json({
            status: "error",
            message: "Datos faltantes, verificalos",
            datos_erroneos: params
        })
    }

    //Control usuarios duplicados
    User.find({
        $or: [ //Es como colocar una condicion la cual de debe cumplir una u otra condicion como el ||
            { email: params.email },//Si una u otra consulta existe entonces quiere decir que esto ya existe, si el email de base es igual al que estoy mandando
            { nick: params.nick } //O si el nick de base es igual al que estoy mandando
        ]
    }).exec(async (error, users) => {
        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta de usuarios" })
        if (users.length >= 1) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            })
        }

        //Cifrar la contrasena
        let pwd = await bcrypt.hash(params.password, 10) //pasamos como parametro lo que vamos a encriptar, cuantas veces y el metodo que retorna el resultado
        params.password = pwd; //Remplazamos la password del params por la password hasheada

        //CREAR OBJETO DE USUARIO
        //Esto nos va rellenar de manera automatica segun nuestro modelo lo que tengamos como default o requerido.
        let user_to_save = new User(params) //Creamos una variable de tipo modelo y le pasamos nuestros params

        //Guardar usuario en la base de datos
        user_to_save.save((error, userStored) => { //Como es un modelo el cual tiene el shema ya sabe el nombre de la coleccion a la que va almacenar
            if (error || !userStored) {
                return res.status(500).send({
                    status: "error",
                    message: "Error al guardar el usuario"
                })
            }
            //Devolver el resultado.
            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStored
            });

        })
    })

}

const login = (req, res) => {
    //Recojer parametros del body
    const params = req.body;
    console.log(params);
    if (!params.email || !params.password) {
        return res.status(404).send({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }


    //Buscar en la base de datos si existe el usuario
    User.findOne({ email: params.email })
        //.select({ "password": 0,"created_at":0}) //Podemos quitar datos para que no se muestren en el resultado como lo es la password
        .exec((error, user) => {
            if (error || !user) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el usuario"
                })
            }

            //Comprobar su contrasena
            let pwd = bcrypt.compareSync(params.password, user.password); //Comparamos la password que estoy mandando con la que esta en base
            //Eso gracias al metodo de bcrypt que hace la comparacion de estos valores. devuelve true o false

            if (!pwd) {
                return res.status(404).send({
                    status: "error",
                    message: "Contraseña incorrecta"
                })
            }

            //Conseguir el token 
            const token = jwt.createToken(user);


            //Devolver datos del usuario
            return res.status(200).send({
                status: "success",
                message: "Usuario Logeado",
                user: {
                    id: user._id,
                    name: user.name,
                    nick: user.nick
                },
                token
            })
        })
}

const profile = (req, res) => {
    //Recibir el parametro del Id del usuario por la URL
    const id = req.params.id;
    //Consulta para sacar los datos del usuario
    User.findById(id)
        .select({ password: 0, role: 0 }) //Quitamos de la respuesta los datos de password y de rol
        .exec((error, userProfile) => { //Ejecutamos toda nuestra consulta y si tenemos un error lo mostramos
            if (error || !userProfile) {
                return res.status(404).send({
                    status: "error",
                    message: "El usuario no existe, o hay un error"
                })
            }

            //Devolver el resultado cuando si exista el usuario en la base de datos
            return res.status(200).send({
                status: 'success',
                user: userProfile
            })
        })
}

const list = (req, res) => {
    //const mongoosePaginate = require('mongoose-pagination');
    //Para esto necesitamos importar la libreria de mongoose pagination

    //Controlar en que pagina estamos
    let page = 1;
    if (req.params.page) { //Si mandamos algo por lo menos en la URL tomamos esa como numero de pagina, de lo contrario usamos 1
        page = req.params.page;
    }
    page = parseInt(page); //Cambiamos la variable page a int

    //Hacer la consulta con mongoose paginate
    let itemsPerPage = 3; //Establecemos la cantidad de los datos que queremos que nos retorne

    User.find() //Buscamos todos los usuarios ordenados por id, pero quitandole los campos de pass y role
        .select({ password: 0, role: 0 })
        .sort({ _id: 1 })
        .paginate(page, itemsPerPage, (error, users, total) => {
            if (error || !users) {
                return res.status(500).send({
                    message: 'Error en la consulta',
                    error,
                    status: 'error'
                })
            }

            //Devolver el resultado (Posteriormente info follow)
            return res.status(200).send({
                users: users,
                total: total,
                page: Math.ceil(total / itemsPerPage), //hacemos un redondeo de lo que nos resulte en la division de nuestras pagina
                itemsPerPage: itemsPerPage,
                status: 'success'
            })
        })


}

const update = (req, res) => {
    //Recojer info del usuario a registrar
    const userIdentity = req.user; //Estos datos son lo que recibimos del token del usuario
    let userToUpdate = req.body;//Estos datos son los que mandamos para actualizar 

    //Eliminar campos sobrantes del objeto userToUpdate
    delete userIdentity.iat;
    delete userIdentity.exp;
    delete userIdentity.role;
    delete userIdentity.image;

    //Comprobar si el usuario ya existe
    User.find({
        $or: [ //Es como colocar una condicion la cual de debe cumplir una u otra condicion como el ||
            { email: userToUpdate.email },//Si una u otra consulta existe entonces quiere decir que esto ya existe, si el email de base es igual al que estoy mandando
            { nick: userToUpdate.nick } //O si el nick de base es igual al que estoy mandando
        ]
    }).exec(async (error, users) => {
        if (error) return res.status(500).json({ status: "error", message: "Error en la consulta de usuarios" })
        let userIsset = false;

        users.forEach(user => {
            if (user && user._id != userIdentity.id) { //Si el id del usuario a modificar no es el mio del token entonces
                userIsset = true;
            }
        })

        if (userIsset) {
            return res.status(200).send({
                status: "success",
                message: "El usuario ya existe"
            })
        }

        //Cifrar la contrasena
        if (userToUpdate.password) { //Si nos llega la contrasena pues la actualizamos y la ciframos
            let pwd = await bcrypt.hash(userToUpdate.password, 10) //pasamos como parametro lo que vamos a encriptar, cuantas veces y el metodo que retorna el resultado
            userToUpdate.password = pwd;
        }


        //Buscar y actualizar
        //Id del usuario que vamos a actualizar, todo el dato que vamos a actualizar, y al final con el new le decimos que nos muestre 
        //El dato final que se actualizo
        try {
            let userUpdated = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });

            if (!userUpdated) {
                return res.status(500).send({
                    message: 'Error al actualizar el usaurio',
                    status: 'error'
                })
            }

            //Devolver una respuesta
            return res.status(200).send({
                message: 'Metodo de actualizar usuario',
                status: 'success',
                user: userUpdated
            })

        } catch (error) {
            return res.status(404).send({
                message: 'Error al actualizar el usaurio',
                status: 'error'
            })
        }

    })
}

const upload = (req, res) => {

    //Recojer el fichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: 'La peticion no incluye la imagen'
        })
    }

    //Conseguir el nombre del archivo
    let image = req.file.originalname;

    //Sacar la extension del archivo
    const imageSplit = image.split(".");
    const extension = imageSplit[1];

    //Comprobar extension
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
        //Si no es correcta, borrar archivo
        const filePath = req.file.path
        const fileDelete = fs.unlinkSync(filePath); //Eliminar un elemento o directorio con la libreria de filesystem
        return res.status(404).send({
            status: "error",
            message: 'La extension no es correcta, eliminando archivo.'
        })
    }


    //Si es correcta, guardar en la base de datos
    User.findOneAndUpdate(req.user.id, { image: req.file.filename }, { new: true }, (error, userUpdated) => {
        if (error || !userUpdated) {
            return res.status(404).send({
                status: "error",
                message: 'No se ha podido almacenar el registro.'
            })
        }

        return res.status(200).send({
            status: "success",
            message: "Imagen cargada con exito",
            userLog: req.user,
            userUpdated: userUpdated
        })
    })


}

const avatar = (req, res) => {
    //Sacar el parametro de la url
    const file = req.params.file;

    //Montar el path real de la imagen
    const filePath = './uploads/avatars/' + file;
    //Comprobar que existe//Comprueba si el archivo existe o no
    console.log(filePath);
    fs.stat(filePath, (error,exists) => {
        if (error || !exists) {
            return res.status(404).send({ status: 'error', message: 'No existe la imagen' });
        }



        //Devolver un file
        //Es como cuando le quita las / a los url que van con muchas
        return res.sendFile(path.resolve(filePath)) //Esto nos devuelve la imagen de un path, y el resolve nos manda una ruta absoluta
    })





}

module.exports = {
    register,
    login,
    pruebaUser,
    profile,
    list,
    update,
    upload,
    avatar
}