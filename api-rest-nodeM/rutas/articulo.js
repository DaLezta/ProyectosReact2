const express = require('express');
const router = express.Router();
const multer = require('multer'); //Libreria para subir imagenes
const ArticuloControler = require("../controladores/articulo");

const almacenamiento = multer.diskStorage({ //Indicamos en que carpeta vamos a guardar los archivos
    destination: function(req,file,cb){ //Obtenemos una request, el archivo, y el lugar donde lo vamos a almacenar
        cb(null,'./imagenes/articulos/') //El primer parametro siempre se coloca null y despues la ruta
    },
    filename:function(req,file,cb){ //Configuramos que el nombre del archivo comience con articulo + fecha_actual + nombre_original
        cb(null,"articulo" + Date.now()+file.originalname) //En este metodo configuramos el nombre que va tener el archivo 
    }
})


//Creamos una variable la cual va se la funcion del middleware para utilizar la configuracion de almacenamiento
const subidas = multer({storage:almacenamiento}); //En el storage especificamos como debe almacenarse la imagen y colocamos la confi




// //Rutas de pruebas
// router.get("/ruta-de-prueba", ArticuloControler.prueba) //Cuando se coloque esto en ruta va a ekecutar de ArticuloControler a prueba()
// router.get("/curso", ArticuloControler.curso) 


//Ruta util
router.post("/crear", ArticuloControler.crear);
router.get("/articulos/:ultimos?", ArticuloControler.listar); //Para colocar parametros no obligatorios simplemente colocamos ?
router.get("/articulo/:id", ArticuloControler.uno); //Metodo el cual obtiene un dato con el ID especifico
router.delete("/articulo/:id", ArticuloControler.borrar); //Para esto utilizamos el metodo especifico que es delete
router.put("/articulo/:id", ArticuloControler.editar); //Para esto utilizamos el metodo especifico que es put para poder EDITAR

//Subidas ahora es el middleware creado anteriormente y colocamos el metodo single ya que solo se podra subir de un archivo
//Y lo que tiene dentro es el nombre con el cual nosotros vamos a mandar la peticion en formulario de postman "Key" = file
router.post("/subir-imagen/:id",[subidas.single("file0")], ArticuloControler.subir); //El multer es un middlewer asi que necesitamos colocarlo en ruta 
router.get("/imagen/:fichero",ArticuloControler.imagen);
router.get("/buscar/:busqueda",ArticuloControler.buscador);
module.exports = router;