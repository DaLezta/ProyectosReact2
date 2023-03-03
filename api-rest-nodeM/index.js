const { conexion } = require('./database/conexion'); // Importamos la conexion que estamos exportando desde el archivo de conexion
const express = require('express');
const cors = require('cors')

//Inicializar App
console.log('App arrancada');


//Conexion a la base de datos
conexion();

//Asignamos el puerto que vamos a abrir
const puerto = 3900;
//Crear servidor de Node
const app = express();
//El app.use sirve para ejecutar middlewares o ejecutar rutas

//Configurar Cors
app.use(cors()); //Ejecutando el cors antes de que se ejecute una ruta.

//Convertir body a objeto JS
app.use(express.json()) //Si le paso diferentes datos por una peticion post, lo que voy a tener es un objeto json es como un parse siempre
app.use(express.urlencoded({extended:true}))//Podemos recibir datos en formato normal y lo parseamos a json


//Cargo todas las rutas que se encuentran dentro de mi archivo de articulo que se encuentra en la carpeta de rutas
const rutas_articulo = require("./rutas/articulo"); 

//Cargo las rutas, añadiendo el prefijo /api y posteriormente coloco las rutas que tengo configuradas
app.use("/api",rutas_articulo) //Aqui le indicamos que todas nuestras rutas siempre comenzaran con /api/ y aqui irian las rutas que improtamos






//RUTAS DE PRUEBA//


app.get('/', (request, response) => {
    return response.status(200).send(`<h1>Creando la ruta principal</h1>`)
})





//Crear servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log('Servidor Corriendo bajo el puerto: ' + puerto);
})