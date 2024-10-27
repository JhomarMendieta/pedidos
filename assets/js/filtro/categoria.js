document.addEventListener("DOMContentLoaded", function () {
    const categoriaSelect = document.getElementById("categoria-select");
    const herramientasBtn = document.getElementById("opcion-herramientas");
    const consumiblesBtn = document.getElementById("opcion-consumibles");

    // Función para obtener las categorías según la opción activa
    async function cargarCategorias() {
        // Determina el endpoint en función de la opción activa
        const url = herramientasBtn.classList.contains('active')
            ? 'http://127.0.0.1:5000/categoria_herramientas'
            : 'http://127.0.0.1:5000/categoria_consumibles';

        try {
            const response = await fetch(url);
            if (response.ok) {
                const categorias = await response.json();

                // Limpiar las opciones actuales
                categoriaSelect.innerHTML = '<option value="">Seleccionar categoría</option>';

                // Llenar el select con las categorías obtenidas
                categorias.forEach(categoria => {
                    const option = document.createElement("option");
                    option.value = categoria.id;
                    option.textContent = categoria.nombre;
                    categoriaSelect.appendChild(option);
                });
            } else {
                console.error("No se pudieron obtener las categorías");
            }
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
        }
    }

    // Función para cambiar a la vista de herramientas
    function cargarHerramientas() {
        herramientasBtn.classList.add('active');
        consumiblesBtn.classList.remove('active');
        document.getElementById('buscar-herramieta').style.display = 'block';
        document.getElementById('buscar-consumible').style.display = 'none';
        cargarCategorias(); // Cargar categorías de herramientas
    }

    // Función para cambiar a la vista de consumibles
    function cargarConsumibles() {
        consumiblesBtn.classList.add('active');
        herramientasBtn.classList.remove('active');
        document.getElementById('buscar-consumible').style.display = 'block';
        document.getElementById('buscar-herramieta').style.display = 'none';
        cargarCategorias(); // Cargar categorías de consumibles
    }

    // Eventos para cambiar de vista y cargar las categorías correspondientes
    herramientasBtn.addEventListener('click', cargarHerramientas);
    consumiblesBtn.addEventListener('click', cargarConsumibles);

    // Llamar a la función para cargar las categorías al cargar la página en vista de herramientas por defecto
    cargarHerramientas();
});
