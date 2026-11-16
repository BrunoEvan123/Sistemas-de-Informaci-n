
document.addEventListener("DOMContentLoaded", function () {
    // Obtenemos los elementos del HTML que usaremos para registrar y mostrar solicitudes.
    const formulario = document.getElementById("formulario-personalizacion");
    const botonEnviar = formulario.querySelector('button[type="button"]');
    const lista = document.getElementById("lista-solicitudes");
    const contador = document.getElementById("contador-solicitudes");
    const buscar = document.getElementById("buscar-solicitudes");

    // Conservamos las solicitudes en memoria y asignamos un identificador a cada una.
    let solicitudes = [];
    let siguienteId = 1;

    // Comprobamos que un campo contenga texto y mostramos un error cuando esté vacío.
    function validarTexto(id, mensaje) {
        const campo = document.getElementById(id);
        let error = document.getElementById(`error-${id}`);

        // Creamos el elemento del mensaje sólo si aún no existe.
        if (error === null) {
            error = document.createElement("p");
            error.id = `error-${id}`;
            error.setAttribute("role", "alert");
            campo.insertAdjacentElement("afterend", error);
        }

        // Eliminamos espacios externos antes de comprobar el contenido.
        const texto = campo.value.trim();
        if (texto === "") {
            error.textContent = mensaje;
            campo.setAttribute("aria-invalid", "true");
            return false;
        } else {
            error.textContent = "";
            campo.setAttribute("aria-invalid", "false");
            return true;
        }
    }

    // Actualizamos la lista visible a partir de los registros del arreglo.
    function mostrarSolicitudes() {
        // Limpiamoss la lista anterior para evitar que se dupliquen elementos.
        lista.replaceChildren();

        // Mostramos el total registrado, independientemente de la búsqueda.
        contador.textContent = String(solicitudes.length);

        // Buscamos coincidencias por nombre del cliente u nombre de la idea.
        const consulta = buscar.value.trim().toLowerCase();
        const visibles = solicitudes.filter(function (solicitud) {
            return solicitud.nombreCliente.toLowerCase().includes(consulta) ||
                   solicitud.nombreIdea.toLowerCase().includes(consulta);
        });

        // Mostramos un aviso si no existen registros o coincidencias.
        if (visibles.length === 0) {
            const mensaje = document.createElement("li");
            if (solicitudes.length === 0) {
                mensaje.textContent = "No hay solicitudes registradas.";
            } else {
                mensaje.textContent = "No hay coincidencias.";
            }
            lista.append(mensaje);
            return;
        }

        // Recorremos las solicitudes visibles y creamos un elemento HTML por cada una.
        visibles.forEach(function (solicitud) {
            const fila = document.createElement("li");
            const titulo = document.createElement("strong");
            const detalle = document.createElement("p");
            const botonEstado = document.createElement("button");

            titulo.textContent = `#${solicitud.id}: ${solicitud.nombreIdea}`;
            detalle.textContent = `${solicitud.nombreCliente} | ${solicitud.fechaEntrega} | ${solicitud.estado}`;
            botonEstado.type = "button";

            // El texto del botón depende del estado actual de la solicitud.
            if (solicitud.estado === "Pendiente") {
                botonEstado.textContent = "Marcar como atendida";
            } else {
                botonEstado.textContent = "Reabrir";
            }

            // Primero cambiamos el estado del objeto y luego actualizamos su respectiva lista.
            botonEstado.addEventListener("click", function () {
                if (solicitud.estado === "Pendiente") {
                    solicitud.estado = "Atendida";
                } else {
                    solicitud.estado = "Pendiente";
                }
                mostrarSolicitudes();
            });
            fila.append(titulo, detalle, botonEstado);
            lista.append(fila);
        });
    }

    // Al pulsar el botón, se validan los datos antes de registrar la solicitud.
    botonEnviar.addEventListener("click", function () {
        const ideaValida = validarTexto("nombre-idea", "Escribe un nombre para tu idea.");
        const nombreValido = validarTexto("nombre-cliente", "Ingresa tu nombre.");
        const descripcionValida = validarTexto("descripcion-idea", "¡Describe tu idea para el regalo!");

        // Comprobamos las restricciones HTML como required y el formato del correo.
        const otrosCamposValidos = formulario.reportValidity();

        // Si alguna validación falla, detenemos la función sin crear un registro!
        if (ideaValida === false || nombreValido === false || descripcionValida === false || otrosCamposValidos === false) {
            return;
        }

        // Creamos un objeto con los datos válidos del formulario.
        const solicitud = {
            id: siguienteId,
            nombreIdea: document.getElementById("nombre-idea").value.trim(),
            nombreCliente: document.getElementById("nombre-cliente").value.trim(),
            correoCliente: document.getElementById("correo-cliente").value.trim(),
            descripcionIdea: document.getElementById("descripcion-idea").value.trim(),
            fechaEntrega: document.getElementById("fecha-entrega").value,
            estado: "Pendiente"
        };

        // Guardamos la solicitud, preparamos el siguiente ID y se actualiza la pantalla.
        solicitudes.push(solicitud);
        siguienteId = siguienteId + 1;
        formulario.reset();
        buscar.value = "";
        mostrarSolicitudes();
    });

    // Se actualizan los resultados de la lista al escribir en el buscador.
    buscar.addEventListener("input", mostrarSolicitudes);

    // Ejecuta la función por primera vez para no dejar la interfaz en blanco, cargando así el estado inicial de la lista y el contador al abrir la página.
    mostrarSolicitudes();
});
