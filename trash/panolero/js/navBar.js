document.getElementById('nav').innerHTML = `
    <div class="modulo"></div>
    <h3 class="modulo-nombre">ABM</h3>
    <div class="contenedor-opciones"></div>
    <div class="modulo">
        <h3 class="modulo-nombre">ODI</h3>
        <div class="contenedor-opciones">
            <a href="../../index.html" class="opcion-nav" data-page="index.html">
                <p>Inicio</p>
            </a>
            <a href="../../herramientas-pedidas.html" class="opcion-nav" data-page="herramientas-pedidas.html">
                <p>Herramientas Pedidas</p>
            </a>
            <a href="../../tu-pedido.html" class="opcion-nav" data-page="tu-pedido.html">
                <p>Visualizar Pedidos</p>
            </a>
            <a href="../../chatbot/index.html" class="opcion-nav" data-page="chatbot">
                <p>ChatBot</p>
            </a>
            <a href="../../trash/panolero/cambiar-estado-pedido.html" class="opcion-nav" data-page="cambiar-estado-pedido.html">
                <p>Cambiar el estado del pedido</p>
            </a>
        </div>
    </div>
`;

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || "index.html";

    localStorage.setItem('activePage', currentPage);

    document.querySelectorAll('.opcion-nav').forEach(opcion => {
        opcion.classList.remove('active');
        if (opcion.getAttribute('data-page') === currentPage) {
            opcion.classList.add('active');
        }
    });
}

setActiveLink();

document.querySelectorAll('.opcion-nav').forEach(opcion => {
    opcion.addEventListener('click', function () {
        document.querySelectorAll('.opcion-nav').forEach(link => link.classList.remove('active'));

        this.classList.add('active');

        localStorage.setItem('activePage', this.getAttribute('data-page'));
    });
});
