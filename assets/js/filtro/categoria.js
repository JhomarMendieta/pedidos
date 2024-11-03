document.addEventListener("DOMContentLoaded", function () {
    const tipoSelect = document.getElementById("tipo-herramienta-select");
    const categoriaSelect = document.getElementById("categoria-select");
    const subcategoriaSelect = document.getElementById("subcategoria-select");
    const herramientasBtn = document.getElementById("opcion-herramientas");
    const consumiblesBtn = document.getElementById("opcion-consumibles");

    // Función para cargar categorías
    async function cargarCategorias() {
        const url = herramientasBtn.classList.contains('active')
            ? 'http://127.0.0.1:5000/categoria_herramientas'
            : 'http://127.0.0.1:5000/categoria_consumibles';

        try {
            const response = await fetch(url);
            if (response.ok) {
                const categorias = await response.json();
                categoriaSelect.innerHTML = '<option value="">Seleccionar categoría</option>';
                categorias.forEach(categoria => {
                    const option = document.createElement("option");
                    option.value = categoria.id;
                    option.textContent = categoria.nombre;
                    categoriaSelect.appendChild(option);
                });

                // Cargar subcategorías y tipos inmediatamente después de cargar categorías
                cargarSubcategorias(); // Cargar todas las subcategorías
                cargarTiposHerramienta(); // Cargar todos los tipos
            } else {
                console.error("No se pudieron obtener las categorías");
            }
        } catch (error) {
            console.error("Error al cargar las categorías:", error);
        }
    }

    // Función para cargar subcategorías en función de la categoría seleccionada
    async function cargarSubcategorias() {
        const categoriaId = categoriaSelect.value; // Obtener el ID de la categoría seleccionada

        let url;
        if (!categoriaId) {
            url = herramientasBtn.classList.contains('active')
                ? 'http://127.0.0.1:5000/subcategorias_herramientas'
                : 'http://127.0.0.1:5000/subcategorias_consumibles';
        } else {
            url = herramientasBtn.classList.contains('active')
                ? `http://127.0.0.1:5000/subcategorias_herramientas?categoria_id=${categoriaId}`
                : `http://127.0.0.1:5000/subcategorias_consumibles?categoria_id=${categoriaId}`;
        }

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

        // Después de cargar subcategorías, cargar tipos de herramienta
        cargarTiposHerramienta();
    }

    // Función para cargar tipos de herramienta
    async function cargarTiposHerramienta() {
        const categoriaId = categoriaSelect.value; // Obtener el ID de la categoría seleccionada
        const subcategoriaId = subcategoriaSelect.value; // Obtener el ID de la subcategoría seleccionada

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
                tipoSelect.innerHTML = '<option value="">Seleccionar tipo</option>';

                // Llenar el select con los tipos obtenidos
                if (tipos.length > 0) {
                    tipos.forEach(tipo => {
                        const option = document.createElement("option");
                        option.value = tipo.id;
                        option.textContent = tipo.nombre;
                        tipoSelect.appendChild(option);
                    });
                } else {
                    tipoSelect.innerHTML = '<option value="">No hay tipos disponibles</option>';
                }
            } else {
                console.error("Error en la respuesta al cargar tipos de herramienta:", response.statusText);
                tipoSelect.innerHTML = '<option value="">Error al cargar tipos</option>';
            }
        } catch (error) {
            console.error("Error al cargar los tipos de herramienta:", error);
            tipoSelect.innerHTML = '<option value="">Error al cargar tipos</option>';
        }
    }

    // Eventos para manejar los cambios
    categoriaSelect.addEventListener('change', () => {
        cargarSubcategorias();
        cargarTiposHerramienta(); // Cargar tipos cuando cambie la categoría
    });

    subcategoriaSelect.addEventListener('change', cargarTiposHerramienta);

    // Función para cambiar a la vista de herramientas y cargar categorías
    function cargarHerramientas() {
        herramientasBtn.classList.add('active');
        consumiblesBtn.classList.remove('active');
        document.getElementById('buscar-herramieta').style.display = 'block';
        document.getElementById('buscar-consumible').style.display = 'none';
        cargarCategorias(); // Cargar categorías de herramientas
    }

    // Función para cambiar a la vista de consumibles y cargar categorías
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
