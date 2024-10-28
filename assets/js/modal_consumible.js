function mostrarModalConsumible(id, imagen, nombre, categoria_nombre, subcategoria_nombre, cantidad) {
    const modal = document.getElementById("modal");

    // Crear el contenido del modal para consumibles
    const modalContent = `
        <div class="modal-content">
            <input type="text" name="id_herramienta" value="${id}" hidden>
            <span id="cerrar-modal" class="cerrar-button"><i class="fa-solid fa-xmark"></i></span>
            <div class="cont-modal-img">
                <img class="modal-img" src="${imagen || 'ruta_imagen_predeterminada'}" alt="imagen del consumible">
            </div>
            <h2 class="modal-nombre">${nombre}</h2>
            <div class="modal-datos-herramienta">
                <p class="modal-tipo"><b>Tipo de herramienta:</b><br> ${categoria_nombre}</p>
                <p class="modal-subcategoria"><b>Subcategoría:</b><br> ${subcategoria_nombre}</p>
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
            consumible: true
        };

        // Obtener pedidos existentes
        const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

        // Verificar si ya existe un pedido con el mismo id
        const existePedido = pedidos.some(p => p.id === id);

        if (existePedido) {
            alert(`El pedido de ${nombre} ya ha sido añadido.`);
        } else {
            // Añadir el nuevo pedido
            pedidos.push(pedido);
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            alert(`Añadido ${cantidadSeleccionada} unidades de ${nombre}`);
        }
    };

    botonCancelar.onclick = () => {
        modal.style.display = "none";
    };
}
