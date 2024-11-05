document.addEventListener('DOMContentLoaded', function () {
    obtenerPedidosUsuario();
});

function obtenerPedidosUsuario() {
    fetch('http://127.0.0.1:5000/obtener_pedidos_usuario?usuario_id=1')
        .then(response => response.json())
        .then(data => mostrarPedidos(data))
        .catch(error =>  {console.error('Error al obtener los pedidos:', error)
        sinconexion(error)
        });
}

function sinconexion(error) {
    const contenedor = document.getElementById('contenedor-tu-pedido');
    contenedor.innerHTML = '<div class="sinconexion">'+error+'<div>';
}
function mostrarPedidos(pedidos) {
    const contenedor = document.getElementById('contenedor-tu-pedido');
    contenedor.innerHTML = '';

    pedidos.forEach(pedido => {
        const pedidoHTML = `
        ${pedido.estado === "Bajo seguimiento" ? 
         '<div class="contenedor-tu-pedido"  style="border: purple solid 2px;">' : '<div class="contenedor-tu-pedido">' }
            <div class="estado">
                <p>Estado</p>
                <div class="img">
                    <i class="fa-solid fa-image"></i>
                  
                </div>
                  ${pedido.estado === "Cancelado" ?
                '<div class="etiqueta" style="background-color:red; color: white;">Pedido Cancelado</div>'
                : pedido.estado === "Bajo seguimiento" ?
                '<div class="etiqueta" style="background-color:purple; color: white;">Pedido Bajo seguimiento</div>'
                : pedido.estado === "Devuelto" ?
                    '<div class="etiqueta" style="background-color:green; color: white;">Pedido Devuelto</div>'
                    : '<div class="etiqueta">' + pedido.estado + '</div>'}
            </div>
            <div class="datos2">
            ${
                pedido.estado === "Bajo seguimiento" ?
                '<p class="hp">Herramientas que adeuda:</p>': '<p class="hp">Herramientas pedidas:</p>'
            }
                <div class="herramientas">
                    ${pedido.herramientas.map(herramienta => `
                         <p class="herramienta">
                         ${pedido.estado === "Cancelado"
                            ? `<label style="text-decoration: line-through; color: gray;">${herramienta.nombre} - x${herramienta.cantidad}</label>`
                            :pedido.estado === "Bajo seguimiento" && herramienta.tabla == "consumible" || "Bajo seguimiento" && herramienta.tabla == "herramienta" && herramienta.cantidad == herramienta.devueltos 
                            ? `<label style="background-color: lightgreen;">${herramienta.nombre} - x${herramienta.cantidad}</label>`  
                            :pedido.estado === "Bajo seguimiento" && herramienta.tabla == "herramienta" && herramienta.cantidad != herramienta.devueltos 
                             ? `<label style="background-color: red; color:white;">${herramienta.nombre} - ${herramienta.cantidad - herramienta.devueltos}/${herramienta.cantidad}</label>` 
                            : pedido.estado === "Devuelto" ? `<label style="background-color: lightgreen;">${herramienta.nombre} - x${herramienta.cantidad}</label>` : `<label>${herramienta.nombre} - x${herramienta.cantidad}</label>`
                        }
                        
                        </p>
                    `).join('')}
                </div>
               
                <p class="fecha">Fecha: ${pedido.fecha}</p>
                <p class="hora">Hora: ${pedido.hora}</p>
                 ${ pedido.estado === "Bajo seguimiento" ?
                    '<details><div class="chat"></div><form><textarea></textarea> <input type="submit"></form></details>': ""}
            </div>
        </div>
        `;

        const pedidoContenedor = document.createElement('div');
        pedidoContenedor.classList.add('pedido');
        pedidoContenedor.innerHTML = pedidoHTML;
        contenedor.appendChild(pedidoContenedor);
    });
}
