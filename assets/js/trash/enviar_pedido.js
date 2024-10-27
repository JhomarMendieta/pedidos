function actualizarVisibilidadBoton() {
    const herramientasData = JSON.parse(localStorage.getItem('pedidos')) || [];

    if (herramientasData.length > 0) {
        document.getElementById('enviarPedidoBtn').style.display = 'block';
    } else {
        document.getElementById('enviarPedidoBtn').style.display = 'none';
    }
}

actualizarVisibilidadBoton();

document.getElementById('enviarPedidoBtn').addEventListener('click', function () {
    const fecha = new Date().toISOString().split('T')[0];  
    const horario = new Date().toLocaleTimeString();      

    const herramientasData = JSON.parse(localStorage.getItem('pedidos')) || [];
    console.log(herramientasData);

    const pedido = {
        usuario_fk: 2, 
        fecha: fecha,
        horario: horario,
        estado_fk: 1,  
        tipo_pedido: 1, 
        herramientas: herramientasData.map(herramienta => ({
            herramienta_id_fk: parseInt(herramienta.id),  
            cantidad: parseInt(herramienta.pedirCantidad) 
        }))
    };
    console.log(pedido);

    fetch('http://localhost:5000/enviar_pedido', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Pedido enviado correctamente.');
                localStorage.removeItem('pedidos');  

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

function agregarHerramienta(herramienta) {
    let herramientasData = JSON.parse(localStorage.getItem('pedidos')) || [];
    herramientasData.push(herramienta);
    localStorage.setItem('pedidos', JSON.stringify(herramientasData));

    actualizarVisibilidadBoton();
}
