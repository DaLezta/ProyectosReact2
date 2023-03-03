const express = require('express');
const router = express.Router();
const publicationController = require("../controllers/publication");

//Definir las rutas
router.get("/prueba-publication",publicationController.pruebaPublication);

module.exports= router
