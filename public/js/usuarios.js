// ===== CONFIGURACIÓN =====
const URL_API = "http://localhost:3000/api/usuarios";

const formUsuario = document.getElementById("form-usuario");
const cuerpoTabla = document.getElementById("cuerpo-tabla-usuarios");
const mensaje = document.getElementById("mensaje-usuario");


// ===== FUNCIÓN: CARGAR Y MOSTRAR LOS USUARIOS =====
async function cargarUsuarios() {
  try {
    const respuesta = await fetch(URL_API); // GET /api/usuarios
    const usuarios = await respuesta.json();

    cuerpoTabla.innerHTML = "";

    usuarios.forEach(function (usuario) {
      const fila = document.createElement("tr");

      fila.innerHTML = `
        <td>${usuario.nombre}</td>
        <td>${usuario.correo}</td>
        <td>
          <button onclick="prepararEdicion('${usuario._id}', '${usuario.nombre}', '${usuario.correo}')">Editar</button>
          <button onclick="eliminarUsuario('${usuario._id}')">Eliminar</button>
        </td>
      `;

      cuerpoTabla.appendChild(fila);
    });

  } catch (error) {
    mensaje.textContent = "Error al cargar los usuarios";
    mensaje.style.color = "red";
    console.error(error);
  }
}


// ===== FUNCIÓN: PREPARAR EL FORMULARIO PARA EDITAR =====
function prepararEdicion(id, nombre, correo) {
  document.getElementById("usuarioId").value = id;
  document.getElementById("nombre").value = nombre;
  document.getElementById("correo").value = correo;
}


// ===== FUNCIÓN: ELIMINAR UN USUARIO =====
async function eliminarUsuario(id) {
  const confirmar = confirm("¿Seguro que quieres eliminar este usuario?");
  if (!confirmar) return;

  try {
    const respuesta = await fetch(`${URL_API}/${id}`, {
      method: "DELETE"
    });

    if (respuesta.ok) {
      mensaje.textContent = "Usuario eliminado correctamente";
      mensaje.style.color = "green";
      cargarUsuarios();
    } else {
      mensaje.textContent = "No se pudo eliminar el usuario";
      mensaje.style.color = "red";
    }
  } catch (error) {
    mensaje.textContent = "Error de conexión con el servidor";
    mensaje.style.color = "red";
    console.error(error);
  }
}


// ===== EVENTO: ENVIAR EL FORMULARIO (siempre es edición aquí) =====
formUsuario.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  const id = document.getElementById("usuarioId").value;

  // Si no hay id, significa que el usuario intentó enviar el formulario
  // sin haber dado clic en "Editar" primero. Lo prevenimos aquí mismo.
  if (!id) {
    mensaje.textContent = "Selecciona un usuario de la tabla para editar";
    mensaje.style.color = "red";
    return; // corta la función aquí, no sigue ejecutando el fetch
  }

  const datosUsuario = {
    nombre: document.getElementById("nombre").value,
    correo: document.getElementById("correo").value
  };

  try {
    const respuesta = await fetch(`${URL_API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosUsuario)
    });

    if (respuesta.ok) {
      mensaje.textContent = "Usuario actualizado correctamente";
      mensaje.style.color = "green";

      formUsuario.reset();
      document.getElementById("usuarioId").value = "";

      cargarUsuarios();
    } else {
      const datos = await respuesta.json();
      mensaje.textContent = datos.mensaje || "Error al actualizar el usuario";
      mensaje.style.color = "red";
    }

  } catch (error) {
    mensaje.textContent = "Error de conexión con el servidor";
    mensaje.style.color = "red";
    console.error(error);
  }
});


// ===== AL CARGAR LA PÁGINA =====
cargarUsuarios();