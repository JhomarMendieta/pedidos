// subcategorias.js

document.addEventListener("DOMContentLoaded", function () {
    const categoriaSelect = document.getElementById("categoria-select");
    const subcategoriaSelect = document.getElementById("subcategoria-select");
    const herramientasBtn = document.getElementById("opcion-herramientas");
    const consumiblesBtn = document.getElementById("opcion-consumibles");

    // Función para cargar subcategorías en función de la categoría seleccionada
    async function cargarSubcategorias() {
        const url = herramientasBtn.classList.contains('active')
            ? 'http://127.0.0.1:5000/subcategorias_herramientas'
            : 'http://127.0.0.1:5000/subcategorias_consumibles';

        try {
            const response = await fetch(url);
            if (response.ok) {
                const subcategorias = await response.json();
                subcategoriaSelect.innerHTML = '<option value="">Seleccionar subcategoría</option>';
                if (subcategorias.length === 0) {
                    subcategoriaSelect.innerHTML = '<option value="">No hay subcategorías disponibles</option>';
                } else {
                    subcategorias.forEach(subcategoria => {
                        const option = document.createElement("option");
                        option.value = subcategoria.id;
                        option.textContent = subcategoria.nombre;
                        subcategoriaSelect.appendChild(option);
                    });
                }
            } else {
                console.error("No se pudieron obtener las subcategorías");
            }
        } catch (error) {
            console.error("Error al cargar las subcategorías:", error);
        }
    }

    // Evento para cargar subcategorías cuando se selecciona una categoría
    categoriaSelect.addEventListener('change', cargarSubcategorias);
});
