// Inserta el HTML de la navbar en el elemento con id 'navbar'
document.getElementById('nav').innerHTML = `
    <div class="modulo"></div>
    <h3 class="modulo-nombre">ABM</h3>
    <div class="contenedor-opciones"></div>
    <div class="modulo">
        <h3 class="modulo-nombre">PEDIDOS</h3>
        <div class="contenedor-opciones">
            <a href="index.html" class="opcion-nav" data-page="index.html">
                <p>Inicio</p>
            </a>
            <a href="herramientas-pedidas.html" class="opcion-nav" data-page="herramientas-pedidas.html">
                <p>Herramientas Pedidas</p>
            </a>
            <a href="tu-pedido.html" class="opcion-nav" data-page="tu-pedido.html">
                <p>Visualizar Pedidos</p>
            </a>
            <a href="./chatbot/index.html" class="opcion-nav" data-page="chatbot">
                <p>ChatBot</p>
            </a>
        </div>
    </div>
`;

// Función para activar el enlace basado en la URL actual
function setActiveLink() {
    // Obtiene la URL de la página actual
    const currentPage = window.location.pathname.split('/').pop() || "index.html";

    // Guarda esta página en localStorage para que persista en recargas
    localStorage.setItem('activePage', currentPage);

    // Activa el enlace correspondiente a la página actual
    document.querySelectorAll('.opcion-nav').forEach(opcion => {
        opcion.classList.remove('active');
        if (opcion.getAttribute('data-page') === currentPage) {
            opcion.classList.add('active');
        }
    });
}

// Llama a setActiveLink para establecer el enlace activo al cargar la página
setActiveLink();

// Agrega la clase 'active' y guarda la opción seleccionada en el localStorage al hacer clic
document.querySelectorAll('.opcion-nav').forEach(opcion => {
    opcion.addEventListener('click', function () {
        // Remueve la clase 'active' de todas las opciones
        document.querySelectorAll('.opcion-nav').forEach(link => link.classList.remove('active'));

        // Agrega la clase 'active' a la opción actual
        this.classList.add('active');

        // Guarda la URL de la opción actual en el localStorage
        localStorage.setItem('activePage', this.getAttribute('data-page'));
    });
});
