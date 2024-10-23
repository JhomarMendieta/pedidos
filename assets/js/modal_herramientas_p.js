const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

const contenedorHerramientas = document.getElementById('contenedor-herramientas-pedidas');

const modal = document.getElementById('modal');
const modalNombre = modal.querySelector('.modal-nombre');
const modalTipo = modal.querySelector('.modal-tipo');
const modalSubcategoria = modal.querySelector('.modal-subcategoria');
const modalConsumible = modal.querySelector('.modal-consumible');
const modalCantidadDisponible = modal.querySelector('.modal-cantidad');
const modalCantidadInput = modal.querySelector('#pedir_cantidad');
const modalCerrar = document.getElementById('cerrar-modal');
const modalAñadirBtn = modal.querySelector('.modal-añadir');

contenedorHerramientas.addEventListener('click', (e) => {
    if (e.target.classList.contains('modificar-btn')) {
        const index = e.target.getAttribute('data-index');
        const pedido = pedidos[index];

        modalNombre.textContent = pedido.nombre;
        modalTipo.textContent = `Tipo: ${pedido.tipo}`;
        modalSubcategoria.textContent = `Subcategoría: ${pedido.subcategoria}`;
        modalConsumible.textContent = `¿Consumible?: ${pedido.consumible}`;
        modalCantidadDisponible.textContent = `Cantidad disponible: ${pedido.cantidadDisponible}`;
        modalCantidadInput.value = pedido.pedirCantidad;

        modal.style.display = 'flex';

        modalAñadirBtn.setAttribute('data-index', index);
    }
});

modalCerrar.addEventListener('click', () => {
    modal.style.display = 'none';
});

modal.querySelector('.modal-cancelar').addEventListener('click', () => {
    modal.style.display = 'none';
});

modalAñadirBtn.addEventListener('click', (e) => {
    const index = e.target.getAttribute('data-index');
    const nuevaCantidad = modalCantidadInput.value;

    pedidos[index].pedirCantidad = nuevaCantidad;

    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    renderPedidos();

    modal.style.display = 'none';
});
