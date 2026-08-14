const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({ // Esto define la forma que va a tener cada usuario registrado
    nombre: {type: String, required: true}, // El required: true, hace que sea obligatorio el campo, sin esto daría error para el usuario
    correo: {type: String, required: true, unique: true}, // Unique no permite dos usuarios con el mismo correo
    contraseña: {type: String, required: true},
});

const Usuario = mongoose.model("Usuario", usuarioSchema); // lo convierte en un modelo usable

module.exports = Usuario; // Bueno para exportar el archivo y usarlo en otro, en este caso el index