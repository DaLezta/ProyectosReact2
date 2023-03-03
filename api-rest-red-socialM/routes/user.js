const express = require('express');
const router = express.Router();
const userController = require("../controllers/user");
const check = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Configuracion de subida
const storage = multer.diskStorage({
    destination: async(req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../uploads/avatars/'); //Colocamos la ruta de donde se va almacenar
        try {
            //Creamos un metodo asincrono para hacer todas y cada uno de los directorios
            await fs.promises.mkdir(uploadPath, { recursive: true });
        } catch (err) {
            console.log(err);
        }
        cb(null, uploadPath) //Donde vamos a guardar
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});

const uploads = multer({ storage });


//Definir las rutas
router.get("/prueba-user", check.auth, userController.pruebaUser); //Esto contiene un middleware para poder verificar la sesion
//Estas rutas no necesitan autenticacion
router.post("/register", userController.register);
router.post("/login", userController.login);

//Esta ruta si requiere autenticacion, la cual la importamos utilizando el check que tiene como metodo nuestro auth
router.post("/profile/:id", check.auth, userController.profile);

router.get("/list/:page?", check.auth, userController.list); //Ruta que requiere autenticacion

router.put("/update", check.auth, userController.update);

router.post("/upload", [check.auth, uploads.single('file0')], userController.upload);

router.get("/avatar/:file", check.auth, userController.avatar);

module.exports = router
