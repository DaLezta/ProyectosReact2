
//Acciones de prueba
const pruebaPublication = (req,res) =>{
    return res.status(200).send({
        "Mensaje":"Mensaje enviado desde controllers/publication.js"
    })
} 

module.exports= {
    pruebaPublication
}