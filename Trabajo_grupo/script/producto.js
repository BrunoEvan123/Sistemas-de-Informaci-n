// Funciones de la página de producto

const cantidad = document.getElementById("cantidad-producto");
const botonesCantidad = document.querySelectorAll(".btn-cantidad");
const botonCompra = document.querySelector(".btn-compra");

const precioProducto = 59;

botonesCantidad[0].addEventListener("click", function() {
    let valor = parseInt(cantidad.value);

    if (valor > 1) {
        cantidad.value = valor - 1;
        actualizarPrecio();
    }
});

botonesCantidad[1].addEventListener("click", function() {
    let valor = parseInt(cantidad.value);

    if (valor < 99) {
        cantidad.value = valor + 1;
        actualizarPrecio();
    }
});

function actualizarPrecio() {
    let total = precioProducto * parseInt(cantidad.value);
    botonCompra.textContent = "Compra ahora - S/ " + total.toFixed(2);
}

const dedicatoria = document.getElementById("dedicatoria");

dedicatoria.addEventListener("input", function() {
    console.log("Dedicatoria:", dedicatoria.value);
});
