document.addEventListener("DOMContentLoaded", function () {
    const tipoSelect = document.getElementById("tipo-herramienta-select");
    const categoriaSelect = document.getElementById("categoria-select");
    const subcategoriaSelect = document.getElementById("subcategoria-select");

    // Función para obtener los tipos de herramienta
    async function cargarTiposHerramienta() {
        const categoriaId = categoriaSelect.value; // Obtener el ID de la categoría seleccionada
        const subcategoriaId = subcategoriaSelect.value; // Obtener el ID de la subcategoría seleccionada

        // Crear la URL con ambos parámetros
        let url = 'http://127.0.0.1:5000/tipos_herramienta';
        const params = new URLSearchParams();

        if (categoriaId) {
            params.append('categoria_id', categoriaId);
        }
        if (subcategoriaId) {
            params.append('subcategoria_id', subcategoriaId);
        }

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        try {
            const response = await fetch(url);
            if (response.ok) {
                const tipos = await response.json();

                // Limpiar las opciones actuales
                tipoSelect.innerHTML = '<option value="">Seleccionar tipo</option>';

                // Llenar el select con los tipos obtenidos
                tipos.forEach(tipo => {
                    const option = document.createElement("option");
                    option.value = tipo.id;
                    option.textContent = tipo.nombre;
                    tipoSelect.appendChild(option);
                });
            } else {
                console.error("No se pudieron obtener los tipos de herramienta");
                // Limpiar las opciones si hay un error
                tipoSelect.innerHTML = '<option value="">No hay tipos disponibles</option>';
            }
        } catch (error) {
            console.error("Error al cargar los tipos de herramienta:", error);
            // Limpiar las opciones si hay un error
            tipoSelect.innerHTML = '<option value="">Error al cargar tipos</option>';
        }
    }

    // Eventos para cargar tipos al cambiar de categoría o subcategoría
    categoriaSelect.addEventListener('change', cargarTiposHerramienta);
    subcategoriaSelect.addEventListener('change', cargarTiposHerramienta);

    // Llamar a la función para cargar los tipos de herramienta al cargar la página
    cargarTiposHerramienta();
});
