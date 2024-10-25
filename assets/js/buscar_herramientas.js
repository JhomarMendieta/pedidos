function crearHerramientaHTML(herramienta) {
    return `
        <div class="herramienta" onclick="mostrarModal('${herramienta.id}', '${herramienta.imagen}', '${herramienta.nombre}', '${herramienta.categoria_nombre}', '${herramienta.subcategoria_nombre}', ${herramienta.consumible}, ${herramienta.disponibles})">
            <div class="img">
                <i class="fa-solid fa-image"></i>
            </div>
            <div class="datos">
                <p class="nombre-herramienta">${herramienta.nombre}</p>
            </div>
            <div class="cantidad">
                <p>Cant. disponible: ${herramienta.disponibles}</p>
            </div>
        </div>
    `;
}

async function obtenerHerramientas(query = '') {
    try {
        const response = await fetch(`http://localhost:5000/datos_herramienta_pedidos?query=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const herramientas = await response.json();
        console.log(herramientas);

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

document.addEventListener('DOMContentLoaded', () => {
    obtenerHerramientas(); 
});

function buscarHerramientas(event) {
    event.preventDefault();  
    const query = document.getElementById('search-input').value;  
    obtenerHerramientas(query);  
}