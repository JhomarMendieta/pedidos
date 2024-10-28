function mostrarHerramientasPedidas() {
    const contenedor = document.getElementById('herramientas-lista');
    contenedor.innerHTML = '';

    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    console.log("Pedidos almacenados:", pedidos);

    if (pedidos.length === 0) {
        contenedor.innerHTML = '<p>No hay herramientas en el pedido.</p>';
        return;
    }

    pedidos.forEach(pedido => {
        console.log("Mostrando pedido:", pedido); 

        const pedidoElemento = document.createElement('div');
        pedidoElemento.classList.add('pedido-item');

        pedidoElemento.innerHTML = `
            <div class="herramienta pedido">
                <p class="nombre_herramienta">${pedido.nombre}</p>
                <p class="cantidad_herramienta_pedida">Cant. a pedir: ${pedido.cantidad}</p>
                <button class="ver_herramienta" onclick="mostrarModalCambiarCantidad('${pedido.nombre}', '${pedido.cantidad}')">Ver</button>
            </div>
        `;

        contenedor.appendChild(pedidoElemento);
    });

    const botonesEliminar = document.querySelectorAll('.eliminar-pedido');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            eliminarPedido(id);
        });
    });
}

function eliminarPedido(id) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos = pedidos.filter(pedido => pedido.id !== id);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    mostrarHerramientasPedidas(); 
}



function mostrarModalCambiarCantidad(nombre, cantidadActual) {
    const modal = document.createElement('div');
    modal.classList.add('modal');

    modal.innerHTML = `
        <div class="modal-content">
            <span class="cerrar-button" onclick="cerrarModal()">×</span>
            <h2>Cambiar Cantidad</h2>
            <p>${nombre}</p>
            <label for="nueva_cantidad">Cantidad:</label>
            <input type="number" id="nueva_cantidad" min="1" value="${cantidadActual}">
            <button onclick="actualizarCantidad('${nombre}')">Actualizar</button>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function cerrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }
}

function actualizarCantidad(nombre) {
    const nuevaCantidad = document.getElementById('nueva_cantidad').value;
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    pedidos = pedidos.map(pedido => {
        if (pedido.nombre === nombre) {
            pedido.cantidad = nuevaCantidad;
        }
        return pedido;
    });

    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    cerrarModal();
    mostrarHerramientasPedidas();
}



window.onload = mostrarHerramientasPedidas();