const Producto = require("../models/Producto");

async function crearProducto (req,res) {
    try {
        const {nombre,descripcion,precio,categoria,stock} = req.body;
        const nuevoProducto = await Producto.create({nombre, descripcion, precio, categoria, stock});
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({mensaje: error.message});
    }
}

async function obtenerProductos(req,res) {
    try{
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({mensaje:error.menssage});
    }
}

async function actualizarProducto(req,res) {
    try{
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        if (!productoActualizado) {
            return res.status(404).json({mensaje: "Producto no encontrado"});
        }
        res.status(200).json(productoActualizado);

    } catch (error) {
        res.status(500).json({mensaje:error.mensaje});
    }
}

async function eliminarProducto(req,res) {
    try{
        const productoEliminado = await Producto.findByIdAndDelete(req.params.id);
        if (!productoEliminado) {
            return res.status(404).json({mensaje: "Producto no encontado"});
        }
        res.status(200).json({mensaje: "Producto eliminado correctamente"});
    } catch (error) {
        res.status(500).json({mensaje:error.message});
    }
}

module.exports = {crearProducto, obtenerProductos, actualizarProducto, eliminarProducto};