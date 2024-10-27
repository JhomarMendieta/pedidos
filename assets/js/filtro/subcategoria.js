document.addEventListener("DOMContentLoaded", function () {
    const subcategoriaSelect = document.getElementById("subcategoria-select");
    const herramientasBtn = document.getElementById("opcion-herramientas");
    const consumiblesBtn = document.getElementById("opcion-consumibles");

    // Función para obtener las subcategorías según la opción activa
    async function cargarSubcategorias() {
        // Determina el endpoint en función de la opción activa
        const url = herramientasBtn.classList.contains('active')
            ? 'http://127.0.0.1:5000/subcategorias_herramientas'
            : 'http://127.0.0.1:5000/subcategorias_consumibles';

        try {
            const response = await fetch(url);
            if (response.ok) {
                const subcategorias = await response.json();

                // Limpiar las opciones actuales
                subcategoriaSelect.innerHTML = '<option value="">Seleccionar subcategoría</option>';

                // Llenar el select con las subcategorías obtenidas
                subcategorias.forEach(subcategoria => {
                    const option = document.createElement("option");
                    option.value = subcategoria.id;
                    option.textContent = subcategoria.nombre;
                    subcategoriaSelect.appendChild(option);
                });
            } else {
                console.error("No se pudieron obtener las subcategorías");
            }
        } catch (error) {
            console.error("Error al cargar las subcategorías:", error);
        }
    }

    // Función para cambiar a la vista de herramientas
    function cargarHerramientas() {
        herramientasBtn.classList.add('active');
        consumiblesBtn.classList.remove('active');
        document.getElementById('buscar-herramieta').style.display = 'block';
        document.getElementById('buscar-consumible').style.display = 'none';
        cargarSubcategorias(); // Cargar subcategorías de herramientas
    }

    // Función para cambiar a la vista de consumibles
    function cargarConsumibles() {
        consumiblesBtn.classList.add('active');
        herramientasBtn.classList.remove('active');
        document.getElementById('buscar-consumible').style.display = 'block';
        document.getElementById('buscar-herramieta').style.display = 'none';
        cargarSubcategorias(); // Cargar subcategorías de consumibles
    }

    // Eventos para cambiar de vista y cargar las categorías y subcategorías correspondientes
    herramientasBtn.addEventListener('click', cargarHerramientas);
    consumiblesBtn.addEventListener('click', cargarConsumibles);

    // Llamar a la función para cargar las categorías y subcategorías al cargar la página en vista de herramientas por defecto
    cargarHerramientas();
});
