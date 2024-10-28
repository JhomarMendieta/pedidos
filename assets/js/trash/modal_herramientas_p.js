let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
const contenedorHerramientas = document.getElementById('herramientas-lista');
const modal = document.getElementById('modalModificar');
const closeModal = document.getElementById('closeModal');
const formModificar = document.getElementById('modificarForm');
const inputCantidadNueva = document.getElementById('cantidadNueva');
const inputHerramientaId = document.getElementById('herramientaId');


function renderizarHerramientas() {
    contenedorHerramientas.innerHTML = '';
    pedidos.forEach(herramienta => {
        if (!herramienta.id) {
            herramienta.id = Date.now() + Math.random();
        }
        const herramientaHTML = `
            <div class="herramienta" id="herramienta-${herramienta.id}">
                <div class="img">
                    <img src="${herramienta.imagen || 'assets/img/no-hay-imagen.png'}" alt="${herramienta.nombre}">
                </div>
                <p class="nombre-herramienta">${herramienta.nombre}</p>
                <div class="datos">
                    <p>Tipo: ${herramienta.tipo}</p>
                    <p>Subcategoría: ${herramienta.subcategoria}</p>
                    <p>Consumible: ${herramienta.consumible}</p>
                    <p>Cantidad disponible: ${herramienta.cantidadDisponible}</p>
                </div>
                <p class="cantidad">Cant. pedida: ${herramienta.pedirCantidad} unidades</p>
                <div class="btns">
                    <button onclick="abrirModalModificar('${herramienta.id}')">¿Modificar?</button>
                    <button onclick="eliminarHerramienta('${herramienta.id}')">Eliminar</button>
                </div>
            </div>
        `;
        contenedorHerramientas.innerHTML += herramientaHTML;
    });
}

function abrirModalModificar(id) {
    const herramienta = pedidos.find(h => h.id === id);
    inputHerramientaId.value = id;
    inputCantidadNueva.value = herramienta.pedirCantidad;
    modal.style.display = 'block';
}

closeModal.onclick = () => {
    modal.style.display = 'none';
};

function eliminarHerramienta(id) {
    pedidos = pedidos.filter(h => h.id !== id);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    renderizarHerramientas();
}

formModificar.onsubmit = function (event) {
    event.preventDefault();
    const id = inputHerramientaId.value;
    const nuevaCantidad = inputCantidadNueva.value;

    pedidos = pedidos.map(h => {
        if (h.id === id) {
            h.pedirCantidad = nuevaCantidad;
        }
        return h;
    });

    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    modal.style.display = 'none';
    renderizarHerramientas();
};

renderizarHerramientas();