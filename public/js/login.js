// Esperamos a que el formulario exista en la página antes de "engancharnos" a él.
// document.getElementById busca en el HTML el elemento con ese id exacto.
const formLogin = document.getElementById("form-login");

// addEventListener "escucha" un evento específico sobre ese elemento.
// "submit" se dispara cuando alguien hace clic en el botón type="submit"
// o presiona Enter dentro del formulario.
formLogin.addEventListener("submit", async function (evento) {

  // Por defecto, un formulario HTML intenta recargar la página al enviarse.
  // preventDefault() cancela ese comportamiento, porque nosotros queremos
  // controlar manualmente qué pasa (mandar los datos con fetch, no recargar).
  evento.preventDefault();

  // Leemos lo que el usuario escribió en cada campo, usando su id.
  // ".value" es la propiedad que contiene el texto actual dentro del input.
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Referencia al <p id="mensaje"> para poder escribirle texto después.
  const mensaje = document.getElementById("mensaje");

  try {
    // fetch envía una petición HTTP, igual que hacías en Postman, pero desde el navegador.
    const respuesta = await fetch("http://localhost:3000/api/usuarios/login", {
      method: "POST", // mismo método que usabas en Postman
      headers: {
        "Content-Type": "application/json"
        // Le decimos al servidor que el body que mandamos viene en formato JSON
      },
      body: JSON.stringify({ correo: email, contraseña: password })
      // JSON.stringify convierte el objeto JavaScript { email, password }
      // en un texto JSON, porque fetch solo puede mandar texto, no objetos directos.
      // { email, password } es una forma corta de escribir { email: email, password: password }
    });

    // La respuesta llega en partes; .json() la convierte en un objeto JavaScript usable.
    const datos = await respuesta.json();

    if (respuesta.ok) {
      // respuesta.ok es true si el código de estado fue 200-299 (éxito)

      // Guardamos el token JWT en localStorage: un espacio de almacenamiento
      // del navegador que persiste aunque cierres o recargues la página.
      // Lo vamos a necesitar después para las peticiones a productos/usuarios.
      localStorage.setItem("token", datos.token);

      mensaje.textContent = "Login exitoso, redirigiendo...";
      mensaje.style.color = "green";

      // Redirige a la página de productos después de medio segundo
      setTimeout(function () {
        window.location.href = "productos.html";
      }, 500);

    } else {
      // Si el servidor respondió con error (401, 404, etc.)
      mensaje.textContent = datos.mensaje || "Credenciales incorrectas";
      mensaje.style.color = "red";
    }

  } catch (error) {
    // Este catch atrapa errores de RED (ej: el servidor está apagado),
    // no errores de credenciales incorrectas (esos ya los maneja el "else" de arriba)
    mensaje.textContent = "Error de conexión con el servidor";
    mensaje.style.color = "red";
    console.error(error);
  }
});