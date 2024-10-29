// Asegúrate de que el script se carga después de que el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
    const enviarPedidoBtn = document.getElementById('enviarPedidoBtn');
    enviarPedidoBtn.addEventListener('click', enviarPedido);
});

function enviarPedido() {
    // Obtener pedidos del localStorage
    const pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    const herramientas = pedidos.filter(item => !item.consumible);
    const consumibles = pedidos.filter(item => item.consumible);
 
    // Generar fecha y horario
    const fecha = new Date().toISOString().split('T')[0];
    const horario = new Date().toLocaleTimeString();

    // Crear el objeto de datos para enviar
    const data = {
        usuario_fk: 1,
        fecha: fecha,
        horario: horario,
        estado_fk: 1,
        tipo_pedido: 1,
        herramientas: herramientas.map(item => ({
            herramienta_id_fk: item.id,
            cantidad: item.cantidad,
            tabla: item.tabla
        })),
        consumibles: consumibles.map(item => ({
            consumible_id_fk: item.id,
            cantidad: item.cantidad,
            tabla: item.tabla

        }))
    };

    // Enviar la solicitud POST al servidor
    fetch('http://127.0.0.1:5000/crear_pedido', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                // Lanza un error si la respuesta no es exitosa
                throw new Error(`Error en la respuesta del servidor: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(responseData => {
            if (responseData.message === 'Pedido enviado correctamente') {
                alert('Pedido enviado con éxito');
                localStorage.removeItem('pedidos');
                location.reload(); // Recargar solo si el pedido fue exitoso
            } else {
                alert('Error al enviar el pedido');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
            alert('Hubo un problema al procesar el pedido');
        });
}
