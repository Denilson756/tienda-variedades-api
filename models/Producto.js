const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    descripcion: {type: String},
    precio: {type: Number, required: true},
    categoria: {type: String, required: true, default: 0}
});

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;