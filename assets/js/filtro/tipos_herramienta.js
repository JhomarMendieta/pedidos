document.addEventListener("DOMContentLoaded", function () {
    const tipoSelect = document.getElementById("tipo-herramienta-select");
    const herramientasBtn = document.getElementById("opcion-herramientas");
    const consumiblesBtn = document.getElementById("opcion-consumibles");

    // Función para obtener los tipos de herramienta
    async function cargarTiposHerramienta() {
        // Endpoint para obtener tipos de herramienta
        const url = 'http://127.0.0.1:5000/tipos_herramienta';

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
            }
        } catch (error) {
            console.error("Error al cargar los tipos de herramienta:", error);
        }
    }

    // Llamar a la función para cargar los tipos de herramienta al cargar la página
    cargarTiposHerramienta();
});
