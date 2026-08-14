const bcrypt = require("bcryptjs");
const Usuario = require ("../models/Usuario");

async function registrar(req, res) {
    try {
        const {nombre, correo, contraseña} = req.body;
        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10); // Esto convierte la contraseña en un código encriptado, el valor 10 indica qué tan fuerte es la encriptación
        const nuevoUsuario = await Usuario.create({nombre, correo, contraseña: contraseñaEncriptada});
        res.status(201).json(nuevoUsuario);
    }   catch (error) {
        console.error(error); //linea temporal borrar despues
        res.status(500).json({mensaje: error.message});
    }
}

module.exports = {registrar};