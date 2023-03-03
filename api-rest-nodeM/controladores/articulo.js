const Articulo = require('../modelos/Articulo');
const path = require("path") //Permite tomar un archivo y poder enviarlo
const { validarArticulo } = require('../helpers/validar');
const fs = require('fs'); //Libreria de node que nos permite eliminar un archivo

const crear = async (req, res) => {
    //Recojer parametros por post a guardar
    let parametros = req.body; //Obtenemos todos los valores y datos mandados por post, esto ya en formato json

    //Validar los datos
    try {
        validarArticulo(parametros);
    } catch (err) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    //Crear el objeto a guardar 
    //Aqui hacemos uso del modelo que creamos anteriormente
    //Le estamos pasando parametros para que el automaticamente asocie el objeto que esta recibiendo con el objeto del modelo y lo coloque
    const articulo = new Articulo(parametros);//Cuando no cumplamos algo del modelo mmarcara error al intentar subirlo

    //Guardar el articulo en la base de datos
    //En la funcion de call back siempre recibiremos el posible error o el dato guardado
    articulo.save((error, articuloGuardado) => {//Metodo para guardar en la base de datos
        //Cave mensionar que las validaciones del modelo funcionan y si no se cumplen se va a error
        if (error || !articuloGuardado) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha guardado el articulo"
            })
        }


        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo guardado correctamente!"
        })
    });
}

const listar = (req, res) => {
    let consulta = Articulo.find({});

    if (req.params.ultimos) { //Si envian algo por la url como parametro automaticamente activamos el filtro de limite
        consulta.limit(2)
    }

    consulta.sort({ fecha: -1 }) //Esta condicion nos permite ordenarlo y en las fechas si ponemos 1 los ordena porlos
    //mas viejos y si colocamos -1 los mas nuevos


    //Con el .exec ejecutamos la consulta que tenemos con todos los filtros que se le colocaron
    consulta.exec((error, articulos) => { //Cuando en el find no encontramos nada significa que son todos los datos
        if (error || !articulos) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se han encontrado articulos"
            });
        }

        return res.status(200).send({
            status: "success",
            // parametro: req.params.ultimos, //Recogemos los parametros de la URL
            contador: articulos.length,
            articulos: articulos
        })
    })
}

const uno = (req, res) => { //Metodo para poder obtener un valor por el id de la base de datos
    //Recoger un id por la url
    let id = req.params.id;

    //Buscar el articulo (select *from where id =)
    Articulo.findById(id, (error, articulo) => { //Buscamos directamente el articulo con el id, para esto utilizamos especificamente el metodo findById
        // Si no existe devolver errro
        if (error || !articulo) {
            return res.status(400).json({
                status: "error",
                mensaje: "No existe ningun articulo con ese id"
            });
        }
        //Devolver el resultado
        return res.status(200).send({
            status: "success",
            articulo: articulo
        })
    })
}


const borrar = (req, res) => {
    let id = req.params.id;
    Articulo.findByIdAndDelete({ _id: id }, (error, articuloBorrado) => {
        if (error || !articuloBorrado) {
            return res.status(400).json({
                status: "error",
                mensaje: "No se ha podido eliminar el articulo"
            });
        }
        return res.status(200).json({
            status: "success",
            mensaje: "Articulo eliminado con exito!",
            articulo_eliminado: articuloBorrado
        })
    })
}



const editar = (req, res) => {
    let articuloId = req.params.id;

    //Recoger datos del body
    let parametros = req.body //Esto nos sirve para poder obtener todos los datos que bienen dentro del url o en la request
    //Validar datos
    //Esto se coloco de esta manera por que no puedo mandar como parametro el res, y hacer un return desde esa funcion
    //Asi que colocamos la funcion si falla entonces ahora si mostramos el error
    try {
        validarArticulo(parametros);
    } catch (err) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    //Buscar y actualizar articulo
    Articulo.findByIdAndUpdate({ //Primero seleccionamos el filtro where _id = id, despues los datos que vamos a modificar y luego el call back normal
        _id: articuloId
    },
        parametros, //Nuevos datos que se van a asignar
        { new: true }, // Nos muestre a la salida el articulo actualizado
        (error, articuloActualizado) => { //Con esta condicion dentro de los parametros puedo decirle si quiero que me retorne el articulo actualizado o el anterior
            if (error || !articuloActualizado) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "No se ha podido actualizar el dato"
                })
            }
            return res.status(200).json({
                status: "success",
                mensaje: "Articulo actualizado con exito!",
                articulo_actualizado: articuloActualizado
            })
        })
}


const subir = (req, res) => {
    //Configurar multer - esta configuracion se realiza dentro del ruteo ya que el multer es un middleware

    //Recoger el fichero de la imagen subida
    console.log(req.file);
    if (!req.file) {
        return res.status(400).json({
            status: "Error",
            mensaje: "Peticion sin ningun archivo"
        });
    }

    //Nombre del archivo
    let nombreArchivo = req.file.originalname;

    //Extension del archivo
    let archivoSplit = nombreArchivo.split('.');
    let archivoExtension = archivoSplit[1];

    //Comprobar la extension correcta
    if (archivoExtension != "png" && archivoExtension != "jpg" && archivoExtension != "jpeg" && archivoExtension != "gif") {
        //Borrar archivo y dar respuesta (utilizamos la libreria de node FS la cual nos permite elimiar un archivo)
        fs.unlink(req.file.path, (error) => {//Borramos el archivo que se subio, en este caso dentro del file viene la ruta.
            return res.status(400).json({
                status: "Error",
                mensaje: "Imagen Invalida"
            });
        })
    } else {
        //Recoger el id del articulo a editar

        let articuloId = req.params.id;

        

        //Buscar y actualizar articulo
        Articulo.findByIdAndUpdate({ //Primero seleccionamos el filtro where _id = id, despues los datos que vamos a modificar y luego el call back normal
            _id: articuloId
        },
            {imagen:req.file.filename}, //Nuevos datos que se van a asignar
            { new: true }, // Nos muestre a la salida el articulo actualizado
            (error, articuloActualizado) => { //Con esta condicion dentro de los parametros puedo decirle si quiero que me retorne el articulo actualizado o el anterior
                if (error || !articuloActualizado) {
                    return res.status(400).json({
                        status: "error",
                        mensaje: "No se ha podido actualizar el dato"
                    })
                }
                return res.status(200).json({
                    status: "success",
                    mensaje: "Imagen subida actualizado con exito!",
                    articulo_actualizado: articuloActualizado
                })
            })
    }
}

//Permite pasarle el nombre de cualquier fichero y que devuelva la imagen
const imagen = (req,res) =>{
    let fichero = req.params.fichero;
    let ruta_fisica = "./imagenes/articulos/"+fichero;

    fs.stat(ruta_fisica,(error,existe)=>{//Comprueba si existe el fichero
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica)) //Asi podemos obtener el archivo que tenemos en esa ruta fisica
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                fichero: fichero,
                ruta_fisica : ruta_fisica
            })
        }
    }) 
}

const buscador =(req,res) =>{
     //Sacr el string de busqueda 
     const busqueda = req.params.busqueda;

     //Find OR

     Articulo.find({ //Esto es como hacer un or en una condicion
        "$or" : [{titulo:{"$regex":busqueda,"$options":"i"}},//El regex sirve para indicar que se esta buscando una coincidencia 
        //Con una expresion regular, y las opciones indica que se realice la busqueda de forma insensible a mayusculas y minusculas
        
        {contenido:{"$regex":busqueda,"$options":"i"}} //Si el contenido incluye la busqueda
    ] 
    })
    .sort({fecha:-1})
    .exec((error, articulosEncontrados)=>{
        if(error || !articulosEncontrados || articulosEncontrados.length <=0){
            return res.status(404).json({
                status:"Error",
                mensaje: "No se han encontrado articulos."
            })
        }else{
            return res.status(200).json({
                status:"success",
                articulos: articulosEncontrados
            })
        }
    })

     //Orden

     //Ejecutar consulta

     //Devolver el resultado
}


module.exports = {
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}