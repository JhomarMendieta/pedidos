document.addEventListener('DOMContentLoaded', function () {
    obtenerTodosLosPedidos();
});

let estadosGlobales = []; 

function obtenerTodosLosPedidos() {
    fetch('http://127.0.0.1:5000/obtener_pedidos')
        .then(response => response.json())
        .then(data =>{
            estadosGlobales = data.estados; 
            mostrarPedidos(data.pedidos)})
        .catch(error => console.error('Error al obtener los pedidos:', error));
}


function mostrarPedidos(pedidos) {
    const contenedor = document.getElementById('contenedor-tu-pedido');
    contenedor.innerHTML = '';

    pedidos.forEach(pedido => {
        console.log(pedido)
        const pedidoHTML = `
        <div class="contenedor-tu-pedido">
            <div class="estado">
                <p>Estado</p>
                <div class="img">
                    <i class="fa-solid fa-image"></i>
                </div>
                <div class="contenedor_estados">
                    ${pedido.estado === "Cancelado" ? 
                        '<button style="background-color:red;"><p>Pedido Cancelado</p></button>' 
                        : pedido.estado === "Devuelto" ? 
                        '<button style="background-color:red;"> <p>Pedido Devuelto</p></button>' 
                        : `
                        <select id="cambiar_estado_${pedido.id_pedido}">
                            ${estadosGlobales.map(estado => `
                                <option value="${estado.id}" ${estado.estado === pedido.estado ? 'selected' : ''}>${estado.estado}</option>
                            `).join('')}
                        </select>
                        <button onclick="cambiarEstado(${pedido.id_pedido})">
                            <p>Cambiar</p>
                        </button>
                    `}
                </div>
            </div>
            <div class="datos">
                <p class="hp">Herramientas pedidas:</p>
                <div class="herramientas">
                    ${pedido.herramientas.map(herramienta => `
                        <p class="herramienta">${herramienta.nombre} - x${herramienta.cantidad}</p>
                    `).join('')}
                </div>
                <p class="usuario">Usuario: ${pedido.nombre_usuario}</p>
                <p class="nPedido">N° pedido: ${pedido.id_pedido}</p>
                <p class="fecha">Fecha: ${pedido.fecha}</p>
                <p class="hora">Hora: ${pedido.hora}</p>
            </div>
        </div>
    `;
    

        const pedidoContenedor = document.createElement('div');
        pedidoContenedor.classList.add('pedido');
        pedidoContenedor.innerHTML = pedidoHTML;
        contenedor.appendChild(pedidoContenedor);
    });
}

function cambiarEstado(pedidoId) {
    const selectEstado = document.getElementById(`cambiar_estado_${pedidoId}`);
    const nuevoEstadoId = selectEstado.value;

    fetch(`http://127.0.0.1:5000/cambiar_estado_pedido`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pedido_id: pedidoId,
            estado_id: nuevoEstadoId
        })
    })
        .then(response => response.json())
        .then(data => {
            alert('Estado cambiado correctamente');
            obtenerTodosLosPedidos()
        })
        .catch(error => console.error('Error al cambiar el estado:', error));
}
