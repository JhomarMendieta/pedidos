document.addEventListener('DOMContentLoaded', function () {
    obtenerPedidosUsuario();
});

function obtenerPedidosUsuario() {
    fetch('http://127.0.0.1:5000/obtener_pedidos_usuario?usuario_id=2')
        .then(response => response.json())
        .then(data => mostrarPedidos(data))
        .catch(error => console.error('Error al obtener los pedidos:', error));
}

function mostrarPedidos(pedidos) {
    const contenedor = document.getElementById('contenedor-tu-pedido');
    contenedor.innerHTML = '';

    pedidos.forEach(pedido => {
        const pedidoHTML = `
        <div class="contenedor-tu-pedido">
            <div class="estado">
                <p>Estado</p>
                <div class="img">
                    <i class="fa-solid fa-image"></i>
                    <p>${pedido.estado}</p>
                </div>
            </div>
            <div class="datos">
                <p class="hp">Herramientas pedidas:</p>
                <div class="herramientas">
                    ${pedido.herramientas.map(herramienta => `
                        <p class="herramienta">${herramienta.nombre} - x${herramienta.cantidad}</p>
                    `).join('')}
                </div>
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
