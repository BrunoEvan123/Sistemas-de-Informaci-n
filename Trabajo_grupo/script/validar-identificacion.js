document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formulario-personalizacion");
    const boton = formulario.querySelector('button[type="button"]');

    function validarCampo(id, mensaje) {
        const campo = document.getElementById(id);
        let error = document.getElementById(`error-${id}`);

        // Crear el mensaje de error si aún no existe.
        if (error === null) {
            error = document.createElement("p");
            error.id = `error-${id}`;
            error.setAttribute("role", "alert");
            error.style.color = "crimson";
            campo.insertAdjacentElement("afterend", error);
        }

        // Obtener y comprobar el texto ingresado.
        const textoIngresado = campo.value;
        const textoSinEspaciosExternos = textoIngresado.trim();
        const valido = textoSinEspaciosExternos !== "";

        // Elimina el mensaje de error si el campo contiene texto, sino muestra el mensaje de error.
        if (valido === true) {
            error.textContent = "";
            campo.setAttribute("aria-invalid", "false");
        } else {
            error.textContent = mensaje;
            campo.setAttribute("aria-invalid", "true");
        }
        return valido;
    }

    // Validar los dos campos cuando el user pulse el botón.
    boton.addEventListener("click", function () {
        validarCampo("nombre-idea", "Escribe un nombre para tu idea.");
        validarCampo("nombre-cliente", "Ingresa tu nombre.");
    });
});
