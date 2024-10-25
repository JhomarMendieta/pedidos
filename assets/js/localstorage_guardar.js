let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

function mostrarModal(id, imagen, nombre, categoria_nombre, subcategoria_nombre, consumible, cantidad) {
    console.log(imagen, nombre, categoria_nombre, subcategoria_nombre, consumible, cantidad);

    const modal = document.getElementById("modal");
    const imgHerramienta = document.querySelector(".modal-img");
    const nombreHerramienta = document.querySelector(".modal-nombre");
    const tipoHerramienta = document.querySelector(".modal-tipo");
    const subcategoriaHerramienta = document.querySelector(".modal-subcategoria");
    const consumibleHerramienta = document.querySelector(".modal-consumible");
    const cantidadHerramienta = document.querySelector(".modal-cantidad");
    const cantidadInput = document.querySelector('#pedir_cantidad');

    imgHerramienta.src = imagen || 'ruta_imagen_predeterminada';
    nombreHerramienta.textContent = nombre;
    nombreHerramienta.setAttribute('data-id', id);
    tipoHerramienta.textContent = `Tipo de herramienta: ${categoria_nombre}`;
    subcategoriaHerramienta.textContent = `Subcategoría: ${subcategoria_nombre}`;
    consumibleHerramienta.textContent = consumible ? "Es consumible" : "No es consumible";
    cantidadHerramienta.textContent = `Cantidad disponible: ${cantidad}`;

    cantidadInput.value = 1;

    modal.style.display = "block";
}

function cerrarModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

document.getElementById("cerrar-modal").addEventListener("click", cerrarModal);

window.addEventListener("click", function (event) {
    const modal = document.getElementById("modal");
    if (event.target === modal) {
        cerrarModal();
    }
});

function añadirAlPedido(herramienta) {
    const existeHerramienta = pedidos.some(pedido => pedido.id === herramienta.id);

    if (!existeHerramienta) {
        pedidos.push(herramienta);

        localStorage.setItem('pedidos', JSON.stringify(pedidos));

        alert('Herramienta añadida al pedido');
    } else {
        alert('Esta herramienta ya está en el pedido');
    }
}

document.querySelector('.modal-añadir').addEventListener('click', function () {
    const nuevaHerramienta = {
        id: document.querySelector('.modal-nombre').getAttribute('data-id'),
        nombre: document.querySelector('.modal-nombre').textContent,
        tipo: document.querySelector('.modal-tipo').textContent,
        subcategoria: document.querySelector('.modal-subcategoria').textContent,
        consumible: document.querySelector('.modal-consumible').textContent,
        cantidadDisponible: parseInt(document.querySelector('.modal-cantidad').textContent.split(': ')[1]),
        pedirCantidad: parseInt(document.getElementById('pedir_cantidad').value),
    };

    añadirAlPedido(nuevaHerramienta);
    cerrarModal();
});
