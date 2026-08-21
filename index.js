require("dotenv") .config(); // Activa dotenv para que lea el archivo .env y meta esas variables dentro de process.env
const connectDB = require("./config/db");

const express = require("express"); // Con esto definimos la variable express y con require llamamos a express para almacenarlo en esa variable.
const app = express(); // App es un objeto en el que voy a construir todo, y hace llamado a la variable express que enrealidad es una función
connectDB();

//app.get("/",(req, res) => { 
//    res.send("Servidor funcionando correctamente"); // Con esto estamos definiendo una ruta
//});

app.use(express.static("public")); 

const PORT = 3000; // Almacenamos con esto el número de puerto en una variable para no repetirlo a cada rato

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); // Esto hace que el servidor escuche peticiones, cualquiera que llegue del puerto 3000 y que no se apague
});

const usuarioRoutes = require("./routes/usuarioRoutes");
app.use(express.json()); 
app.use("/api/usuarios", usuarioRoutes);

const productoRoutes = require("./routes/productoRoutes");
app.use("/api/productos", productoRoutes);