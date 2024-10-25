// Función para mostrar u ocultar el botón de enviar dependiendo de las herramientas
function actualizarVisibilidadBoton() {
    const herramientasData = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Mostrar el botón solo si hay herramientas para pedir
    if (herramientasData.length > 0) {
        document.getElementById('enviarPedidoBtn').style.display = 'block';
    } else {
        document.getElementById('enviarPedidoBtn').style.display = 'none';
    }
}

// Llamar a la función al cargar la página o al actualizar herramientas
actualizarVisibilidadBoton();

document.getElementById('enviarPedidoBtn').addEventListener('click', function () {
    const fecha = new Date().toISOString().split('T')[0];  // Obtener la fecha actual
    const horario = new Date().toLocaleTimeString();        // Obtener el horario actual

    // Recuperar los datos de herramientas almacenados en localStorage
    const herramientasData = JSON.parse(localStorage.getItem('pedidos')) || [];
    console.log(herramientasData);

    // Crear el cuerpo del pedido con los datos del localStorage
    const pedido = {
        usuario_fk: 2,  // Usuario fijo en 1, como mencionaste
        fecha: fecha,
        horario: horario,
        estado_fk: 1,   // Estado inicial en 1
        tipo_pedido: 1, // Tipo de pedido 1
        herramientas: herramientasData.map(herramienta => ({
            herramienta_id_fk: parseInt(herramienta.id),  // Convertir a número
            cantidad: parseInt(herramienta.pedirCantidad) // Convertir a número
        }))
    };
    console.log(pedido);

    // Enviar el pedido al servidor
    fetch('http://localhost:5000/enviar_pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Pedido enviado correctamente.');
                localStorage.removeItem('pedidos');  // Limpiar el localStorage

                // Ocultar el botón de enviar ya que el pedido fue procesado
                actualizarVisibilidadBoton();
            } else {
                alert('Error al enviar el pedido.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error en el servidor.');
        });
});

// Llamar a esta función cuando agregues herramientas a la lista para actualizar el estado del botón
function agregarHerramienta(herramienta) {
    let herramientasData = JSON.parse(localStorage.getItem('pedidos')) || [];
    herramientasData.push(herramienta);
    localStorage.setItem('pedidos', JSON.stringify(herramientasData));

    // Actualizar la visibilidad del botón cuando se agrega una herramienta
    actualizarVisibilidadBoton();
}
