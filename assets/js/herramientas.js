// Función para crear el HTML de una herramienta
function crearHerramientaHTML(herramienta) {
    return `
        <div class="herramienta">
            <p class="nombre_herramienta">${herramienta.nombre}</p>
            <button class="ver_herramienta" onclick="mostrarModal('${herramienta.id}', '${herramienta.imagen}', '${herramienta.nombre}', '${herramienta.categoria_nombre}', '${herramienta.subcategoria_nombre}', ${herramienta.consumible}, ${herramienta.disponibles})">Ver</button>
        </div>
    `;
}

// Función para crear el HTML de un consumible
function crearConsumibleHTML(consumible) {
    return `
        <div class="herramienta">
            <p class="nombre_herramienta">${consumible.nombre}</p>
            <button class="ver_herramienta" onclick="mostrarModalConsumible('${consumible.id}', '${consumible.imagen}', '${consumible.nombre}', '${consumible.categoria_nombre}', '${consumible.subcategoria_nombre}', ${consumible.cantidad})">Ver</button>
        </div>
    `;
}

async function obtenerHerramientas(query = '', categoriaId = '', subcategoriaId = '', tipoId = '') {
    try {
        const url = `http://localhost:5000/obtener_herramientas?query=${encodeURIComponent(query)}&categoria_id=${encodeURIComponent(categoriaId)}&subcategoria_id=${encodeURIComponent(subcategoriaId)}&tipo_id=${encodeURIComponent(tipoId)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const herramientas = await response.json();
        const contenedor = document.getElementById('contenedor-lista-herramientas');
        contenedor.innerHTML = '';

        if (herramientas.length > 0) {
            herramientas.forEach(herramienta => {
                const herramientaHTML = crearHerramientaHTML(herramienta);
                contenedor.innerHTML += herramientaHTML;
            });
        } else {
            contenedor.innerHTML = '<p>No hay herramientas disponibles.</p>';
        }

    } catch (error) {
        console.error('Error al obtener las herramientas:', error);
        alert('Hubo un error al obtener las herramientas.');
    }
}

// Función para obtener los consumibles con filtro de búsqueda, categoría y subcategoría
async function obtenerConsumibles(query = '', categoriaId = '', subcategoriaId = '') {
    try {
        const url = `http://localhost:5000/obtener_consumibles?query=${encodeURIComponent(query)}&categoria_id=${encodeURIComponent(categoriaId)}&subcategoria_id=${encodeURIComponent(subcategoriaId)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const consumibles = await response.json();
        const contenedor = document.getElementById('contenedor-lista-herramientas');
        contenedor.innerHTML = '';

        if (consumibles.length > 0) {
            consumibles.forEach(consumible => {
                const consumibleHTML = crearConsumibleHTML(consumible);
                contenedor.innerHTML += consumibleHTML;
            });
        } else {
            contenedor.innerHTML = '<p>No hay consumibles disponibles.</p>';
        }

    } catch (error) {
        console.error('Error al obtener los consumibles:', error);
        alert('Hubo un error al obtener los consumibles.');
    }
}

// Función para realizar la búsqueda de herramientas con filtrado
function buscarHerramientas(event) {
    event.preventDefault();
    const query = document.getElementById('buscar-herramieta').value;
    const categoriaId = document.getElementById('categoria-select').value;
    const subcategoriaId = document.getElementById('subcategoria-select').value;
    const tipoId = document.getElementById('tipo-herramienta-select').value;
    obtenerHerramientas(query, categoriaId, subcategoriaId, tipoId);
}

// Función para realizar la búsqueda de consumibles con filtrado
function buscarConsumibles(event) {
    event.preventDefault();
    const query = document.getElementById('buscar-consumible').value;
    const categoriaId = document.getElementById('categoria-select').value;
    const subcategoriaId = document.getElementById('subcategoria-select').value;
    obtenerConsumibles(query, categoriaId, subcategoriaId);
}

// Función para cargar la vista de herramientas y activar el estilo correspondiente
function cargarHerramientas() {
    document.getElementById('opcion-herramientas').classList.add('active');
    document.getElementById('opcion-consumibles').classList.remove('active');
    document.querySelector('.cotenedor_filtro').classList.remove('consumible');
    document.getElementById('buscar-herramieta').style.display = 'block';
    document.getElementById('buscar-consumible').style.display = 'none';
    document.querySelector('.buscarHerramientas').style.display = 'block';
    document.querySelector('.buscarConsumibles').style.display = 'none';
    obtenerHerramientas();
}

// Función para cargar la vista de consumibles y activar el estilo correspondiente
function cargarConsumibles() {
    document.getElementById('opcion-consumibles').classList.add('active');
    document.getElementById('opcion-herramientas').classList.remove('active');
    document.querySelector('.cotenedor_filtro').classList.add('consumible');
    document.getElementById('buscar-consumible').style.display = 'block';
    document.getElementById('buscar-herramieta').style.display = 'none';
    document.querySelector('.buscarHerramientas').style.display = 'none';
    document.querySelector('.buscarConsumibles').style.display = 'block';
    obtenerConsumibles();
}

// Función para refrescar la página cada 10 segundos


// Escuchar el evento de carga de la página para inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarHerramientas();
    document.getElementById('opcion-herramientas').classList.add('active');
});

