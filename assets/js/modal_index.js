function mostrarModal(id, imagen, nombre, categoria_nombre, subcategoria_nombre, consumible, cantidad) {

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

    // Configuración del valor inicial, min y max
    cantidadInput.value = 1;
    cantidadInput.setAttribute('max', cantidad);

    modal.style.display = "block";
}
