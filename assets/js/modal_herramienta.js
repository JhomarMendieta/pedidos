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
                <p class="modal-tipo">Tipo de herramienta: ${categoria_nombre}</p>
                <p class="modal-subcategoria">Subcategoría: ${subcategoria_nombre}</p>
                <p class="modal-consumible">${consumible ? "Es consumible" : "No es consumible"}</p>
                <p class="modal-cantidad">Cantidad disponible: ${cantidad}</p>
            </div>
            <div class="modal-cantidad">
                <p class="modal-text">¿Cuantos quiere?</p>
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

    // Insertar el contenido generado en el modal
    modal.innerHTML = modalContent;
    modal.style.display = "block";

    // Obtener los elementos del modal
    const cerrarModal = modal.querySelector('#cerrar-modal');
    const botonAñadir = modal.querySelector('.modal-añadir');
    const botonCancelar = modal.querySelector('.modal-cancelar');
    const cantidadInput = modal.querySelector('#pedir_cantidad');

    // Eventos para cerrar el modal
    cerrarModal.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Agregar funcionalidad al botón "Añadir al pedido"
    botonAñadir.onclick = () => {
        const cantidadSeleccionada = cantidadInput.value;
        // Aquí puedes implementar la lógica para añadir al pedido
        alert(`Añadido ${cantidadSeleccionada} unidades de ${nombre}`);
        modal.style.display = "none"; // Cerrar el modal tras añadir
    };

    // Funcionalidad para el botón "Cancelar"
    botonCancelar.onclick = () => {
        modal.style.display = "none";
    };
}
