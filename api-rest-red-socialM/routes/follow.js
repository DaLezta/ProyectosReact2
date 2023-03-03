const express = require('express');
const router = express.Router();
const followController = require("../controllers/follow");

//Definir las rutas
router.get("/prueba-follow",followController.pruebaFollow);

module.exports=  router
