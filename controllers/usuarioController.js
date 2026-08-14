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

const jwt = require("jsonwebtoken"); // Importa el paquete instalado

async function login(req, res) {
    try {
        const {correo, contraseña} = req.body;
        
        const usuario = await Usuario.findOne({correo}); // Busca en mongoDB un usuario cuyo correo coincida con el que enviaron 
        if (!usuario) {
            return res.status(404).json({mensaje: "Usuario no encontrado"}); // Corta la ejecución si no encontró a nadie, así el código de abajo no se ejecuta, con un usuario que no existe
        }

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({mensaje: "Contraseña incorrecta"});
        }

        const token = jwt.sign(
            {id: usuario._id,correo: usuario.correo},process.env.JWT_SECRET, {expiresIn: "2h"} // Para que el token deje de funcionar a las 2 horas
        );

        res.status(200).json({mensaje: "Inicio de sesión exitoso", token});

    }   catch (error) {
        res.status(500).json({mensaje: error.message});
    }

}

module.exports = {registrar, login};