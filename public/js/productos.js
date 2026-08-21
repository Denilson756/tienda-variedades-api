// ===== CONFIGURACIÓN =====
// URL base de tu API de productos. La ponemos en una constante para no
// repetir el texto completo en cada fetch, y si un día cambia el puerto
// o el dominio, solo la editamos aquí.
const URL_API = "http://localhost:3000/api/productos";

// Referencias a los elementos del HTML que vamos a usar varias veces
const formProducto = document.getElementById("form-producto");
const cuerpoTabla = document.getElementById("cuerpo-tabla-productos");
const mensaje = document.getElementById("mensaje-producto");
const btnGuardar = document.getElementById("btn-guardar");


// ===== FUNCIÓN: CARGAR Y MOSTRAR LOS PRODUCTOS =====
// async porque adentro usamos "await" para esperar la respuesta del fetch
async function cargarProductos() {
  try {
    const respuesta = await fetch(URL_API); // GET por defecto, no hace falta indicar method
    const productos = await respuesta.json(); // convierte la respuesta a un array de objetos

    // Limpiamos la tabla antes de volver a dibujarla, para no duplicar filas
    // cada vez que se llama esta función
    cuerpoTabla.innerHTML = "";

    // .forEach recorre cada producto del array y ejecuta el código de adentro
    // una vez por cada uno
    productos.forEach(function (producto) {

      // Creamos una fila <tr> nueva por cada producto
      const fila = document.createElement("tr");

      // innerHTML nos permite inyectar HTML directamente como texto.
      // Usamos template literals (los backticks ` `) para poder mezclar
      // texto fijo con variables usando ${...}
      fila.innerHTML = `
        <td>${producto.nombre}</td>
        <td>${producto.descripcion || ""}</td>
        <td>${producto.precio}</td>
        <td>${producto.categoria}</td>
        <td>
          <button onclick="prepararEdicion('${producto._id}', '${producto.nombre}', '${producto.descripcion || ""}', ${producto.precio}, '${producto.categoria}')">Editar</button>
          <button onclick="eliminarProducto('${producto._id}')">Eliminar</button>
        </td>
      `;
      // Nota: usamos onclick="..." directo en el HTML (en vez de addEventListener)
      // porque estas filas se crean dinámicamente después de que la página ya cargó,
      // y es la forma más simple de conectar el botón con su función cuando
      // el elemento no existía al principio.

      // Agregamos la fila ya armada dentro del <tbody>
      cuerpoTabla.appendChild(fila);
    });

  } catch (error) {
    mensaje.textContent = "Error al cargar los productos";
    mensaje.style.color = "red";
    console.error(error);
  }
}


// ===== FUNCIÓN: PREPARAR EL FORMULARIO PARA EDITAR =====
// Recibe los datos del producto sobre el que se hizo clic en "Editar"
// y los coloca en el formulario de arriba
function prepararEdicion(id, nombre, descripcion, precio, categoria) {
  document.getElementById("productoId").value = id; // guardamos el id en el campo oculto
  document.getElementById("nombre").value = nombre;
  document.getElementById("descripcion").value = descripcion;
  document.getElementById("precio").value = precio;
  document.getElementById("categoria").value = categoria;

  btnGuardar.textContent = "Guardar cambios"; // cambiamos el texto del botón para que sea claro
}


// ===== FUNCIÓN: ELIMINAR UN PRODUCTO =====
async function eliminarProducto(id) {
  // confirm() muestra una ventana emergente del navegador con Aceptar/Cancelar.
  // Si el usuario da "Cancelar", confirm devuelve false y detenemos la función aquí.
  const confirmar = confirm("¿Seguro que quieres eliminar este producto?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${URL_API}/${id}`, {
      method: "DELETE"
    });

    if (respuesta.ok) {
      mensaje.textContent = "Producto eliminado correctamente";
      mensaje.style.color = "green";
      cargarProductos(); // recargamos la tabla para que ya no aparezca
    } else {
      mensaje.textContent = "No se pudo eliminar el producto";
      mensaje.style.color = "red";
    }
  } catch (error) {
    mensaje.textContent = "Error de conexión con el servidor";
    mensaje.style.color = "red";
    console.error(error);
  }
}


// ===== EVENTO: ENVIAR EL FORMULARIO (crear O editar, según el caso) =====
formProducto.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  // Leemos el id oculto: si tiene contenido, estamos editando; si está vacío, creando
  const id = document.getElementById("productoId").value;

  // Armamos el objeto con los nombres EXACTOS que espera tu backend
  // (nombre, descripcion, precio, categoria - repasamos esto en el mensaje anterior)
  const datosProducto = {
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    precio: Number(document.getElementById("precio").value),
    // Number(...) convierte el texto del input a número, porque los inputs
    // siempre entregan texto (string), aunque sean type="number"
    categoria: document.getElementById("categoria").value
  };

  try {
    let respuesta;

    if (id) {
      // Si hay id, es una EDICIÓN -> PUT a /api/productos/ID
      respuesta = await fetch(`${URL_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosProducto)
      });
    } else {
      // Si no hay id, es una CREACIÓN -> POST a /api/productos
      respuesta = await fetch(URL_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosProducto)
      });
    }

    if (respuesta.ok) {
      mensaje.textContent = id ? "Producto actualizado" : "Producto creado";
      mensaje.style.color = "green";

      formProducto.reset(); // limpia todos los campos del formulario
      document.getElementById("productoId").value = ""; // limpiamos el id oculto también
      btnGuardar.textContent = "Crear producto"; // devolvemos el botón a su texto original

      cargarProductos(); // recargamos la tabla para ver el cambio reflejado
    } else {
      const datos = await respuesta.json();
      mensaje.textContent = datos.mensaje || "Error al guardar el producto";
      mensaje.style.color = "red";
    }

  } catch (error) {
    mensaje.textContent = "Error de conexión con el servidor";
    mensaje.style.color = "red";
    console.error(error);
  }
});


// ===== AL CARGAR LA PÁGINA =====
// Llamamos la función una vez apenas se abre productos.html, para que
// la tabla no empiece vacía sino que muestre los productos que ya existen
cargarProductos();