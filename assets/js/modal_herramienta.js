function mostrarModal(id, imagen, nombre, categoria_nombre, subcategoria_nombre, consumible, cantidad) {
    const modal = document.getElementById("modal");

    // Crear el contenido del modal
    const modalContent = `
        <div class="modal-content">
            <span id="cerrar-modal" class="cerrar-button"><i class="fa-solid fa-xmark"></i></span>
            <div class="cont-modal-img">
                <img class="modal-img" src="${imagen || 'ruta_imagen_predeterminada'}" alt="imagen de la herramienta">
            </div>
            <h2 class="modal-nombre">${nombre}</h2>
            <div class="modal-datos-herramienta">
                <p class="modal-tipo"><b>Tipo de herramienta:</b><br> ${categoria_nombre}</p>
                <p class="modal-subcategoria"><b>Subcategoría:</b><br> ${subcategoria_nombre}</p>
                <p class="modal-consumible"><b>${consumible ? "Es consumible" : "No es consumible"}</b></p>
                <p class="modal-cantidad-data"><b>Cantidad disponible:</b><br> ${cantidad} unidades</p>
            </div>
            <div class="modal-cantidad">
                <p class="modal-text">¿Cuántos quiere?</p>
                <div class="cont">
                    <input type="number" name="pedir_cantidad" id="pedir_cantidad" min="1" max="${cantidad}" value="1">
                </div>
            </div>
            <div class="modal-botones">
                <button class="modal-añadir">Añadir al pedido</button>
                <button class="modal-cancelar">Cancelar</button>
            </div>
        </div>
    `;

    modal.innerHTML = modalContent;
    modal.style.display = "block";

    const cerrarModal = modal.querySelector('#cerrar-modal');
    const botonAñadir = modal.querySelector('.modal-añadir');
    const botonCancelar = modal.querySelector('.modal-cancelar');
    const cantidadInput = modal.querySelector('#pedir_cantidad');

    cerrarModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    botonAñadir.onclick = () => {
        const cantidadSeleccionada = cantidadInput.value;
        const pedido = {
            id: id,
            nombre: nombre,
            cantidad: cantidadSeleccionada,
            imagen: imagen,
            categoria: categoria_nombre,
            subcategoria: subcategoria_nombre,
            consumible: consumible
        };

        // Obtener pedidos existentes
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

        // Verificar si ya existe un pedido con el mismo id
        const existePedido = pedidos.some(p => p.id === id);

        if (!existePedido) {
            // Realizar la llamada al endpoint para actualizar la cantidad en la base de datos
            const tabla = 'tipos_herramienta';
            fetch('http://127.0.0.1:5000/actualizar_cantidad', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: parseInt(id, 10),
                    cantidad: parseInt(cantidadSeleccionada, 10),
                    tabla: tabla
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        // Si la actualización fue exitosa, añadir el pedido a localStorage
                        pedidos.push(pedido);
                        localStorage.setItem('pedidos', JSON.stringify(pedidos));
                        alert(`Añadido ${cantidadSeleccionada} unidades de ${nombre}`);
                    } else {
                        alert('Error al actualizar la cantidad en la base de datos.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Hubo un problema al procesar la solicitud.');
                });
        } else {
            alert(`El pedido de ${nombre} ya ha sido añadido.`);
        }

        modal.style.display = "none";
    };

    botonCancelar.onclick = () => {
        modal.style.display = "none";
    };
}
