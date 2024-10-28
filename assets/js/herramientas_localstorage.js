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
                <button class="eliminar_herramienta" data-id="${pedido.id}"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        contenedor.appendChild(pedidoElemento);
    });

    const botonesEliminar = document.querySelectorAll('.eliminar_herramienta');
    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.closest('.eliminar_herramienta').dataset.id;
            eliminarPedido(id);
        });
    });
}

function eliminarPedido(id) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedidoAEliminar = pedidos.find(pedido => pedido.id === id);

    // Elimina el pedido de la lista
    pedidos = pedidos.filter(pedido => pedido.id !== id);
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    // Actualiza la cantidad en la base de datos si se encuentra el pedido
    if (pedidoAEliminar) {
        fetch('http://127.0.0.1:5000/actualizar_cantidad_sumar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: pedidoAEliminar.id,
                cantidad: pedidoAEliminar.cantidad,
                tabla: pedidoAEliminar.tabla // Asegúrate de que cada pedido tenga este valor
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    console.log("Cantidad actualizada en la base de datos");
                } else {
                    console.error("Error al actualizar la cantidad en la base de datos");
                }
            })
            .catch(error => console.error("Error en la solicitud:", error));
    }

    // Refresca la lista en la interfaz
    mostrarHerramientasPedidas();
}

function cerrarModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.removeChild(modal);
    }
}



window.onload = mostrarHerramientasPedidas();