const mongoose = require("mongoose");

async function connectDB() { // Esta función la marcamos como asyncrona porque conectar una base de datos toma tiempo que es lo que esperamos aquí realmente
    try{
        await mongoose.connect(process.env.MONGO_URI); // Con esto el código se detiene hasta que Mongo confirme si la conexión se hizo o no
        console.log("Conectado a MongoDB correctamente");
    }   catch (error) { // En caso de que la conexión falle esto lo atrapa y me avisa en vez de que el programa se rompa sin ninguna explicación
        console.error("Error al conectar a MongoDB:", error);
    }
}

module.exports = connectDB; // Exportamos con esto esta función para poder darle uso en otro archivo, en este caso en el index
