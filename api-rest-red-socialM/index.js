//Importar dependencias
const {connection} = require("./database/connection");
const express = require('express');
const cors = require('cors');

//Mensaje de bienvenida
console.log('Api node para red social arrancada');

//Conexion a la base de datos
connection();

//Crear servidor de node
const app = express(); //Nos da el inicio para la creacion del servidor
const puerto = 3900;


//Configurar cors
//Middleware es algo que se ejecuta antes de las rutas o end points
app.use(cors()); //En cada una de las rutas el cors va quedar configurado


//Convertir los datos del body a objetos js
app.use(express.json()) //Vamos a tener un middleware que nos va decodificar los datos del body y los va convertir en json
app.use(express.urlencoded({extended:true})) // Cualquier dato que me llegue con el formato form - url enconde lo convierte a json


//Cargar confg rutas
const userRoutes = require("./routes/user");
const publicationRoutes = require("./routes/publication");
const followRoutes = require("./routes/follow");

app.use("/api/user",userRoutes)

app.use("/api/publication",publicationRoutes);

app.use("/api/follow",followRoutes);



app.get('/ruta-prueba',(req,res)=>{
    return res.status(200).json({
        "id": 1,
        "Nombre": "Daniel",
        "Web":"Daniel.com"
    })
})

//Poner servidor a escuchar
app.listen(puerto, ()=>{
    console.log("Servidor de node corriendo en el puerto: "+puerto);
})