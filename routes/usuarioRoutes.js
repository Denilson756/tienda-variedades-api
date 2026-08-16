const express = require("express");
const router = express.Router();
const {registrar, login, obtenerUsuarios, actualizarUsuario, eliminarUsuario} = require("../controllers/usuarioController");

router.post("/registro", registrar);
router.post("/login", login);
router.get("/", obtenerUsuarios);
router.put("/:id", actualizarUsuario); 
router.delete("/:id", eliminarUsuario);

module.exports = router;