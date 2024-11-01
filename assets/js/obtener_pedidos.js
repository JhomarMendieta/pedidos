document.addEventListener('DOMContentLoaded', function () {
    obtenerTodosLosPedidos();
});

let estadosGlobales = []; 

function obtenerTodosLosPedidos() {
    fetch('http://127.0.0.1:5000/obtener_pedidos')
        .then(response => response.json())
        .then(data =>{
            estadosGlobales = data.estados; 
            mostrarPedidos(data.pedidos)})
        .catch(error => {
            console.error('Error al obtener los pedidos:', error)
            sinconexion()
            });
}



function sinconexion() {
    const contenedor = document.getElementById('contenedor-tu-pedido');
    contenedor.innerHTML = '<div class="sinconexion">sin conexión<div>';
}

function mostrarPedidos(pedidos) {
    const contenedor = document.getElementById('contenedor-tu-pedido');
    contenedor.innerHTML = '';

    pedidos.forEach(pedido => {
        console.log(pedido)
        const pedidoHTML = `
        <div class="contenedor-tu-pedido">
            <div class="estado">
                <p>Estado</p>
                <div class="img">
                    <i class="fa-solid fa-image"></i>
                </div>
                <div class="contenedor_estados">
                    ${pedido.estado === "Cancelado" ? 
                        '<button style="background-color:red;"><p>Pedido Cancelado</p></button>' 
                        : pedido.estado === "Devuelto" ? 
                        '<button style="background-color:green;"> <p>Pedido Devuelto</p></button>' 
                        : `
                        <select id="cambiar_estado_${pedido.id_pedido}">
                            ${estadosGlobales.map(estado => `
                                <option value="${estado.id}" ${estado.estado === pedido.estado ? 'selected' : ''}>${estado.estado}</option>
                            `).join('')}
                        </select>
                        <button onclick="cambiarEstado(${pedido.id_pedido})">
                            <p>Cambiar</p>
                        </button>
                    `}
                </div>
            </div>
            <div class="datos">
                <p class="hp">Herramientas pedidas:</p>
                <div class="herramientas" id="herramientas_pedido_${pedido.id_pedido}">
                    ${pedido.herramientas.map(herramienta => `
                        <p class="herramienta">
                         ${pedido.estado === "Cancelado" 
                            ? `<label style="text-decoration: line-through; color: gray;">${herramienta.nombre} - x${herramienta.cantidad}</label>` 
                            : `<input type="checkbox" ${pedido.estado === "Devuelto" ? "checked" : ""}>
                            &nbsp<input type="number" value="${herramienta.cantidad}" min="0" max="${herramienta.cantidad}">&nbsp;
                            <input type="hidden" class="tabla" value="${herramienta.tabla}">
                            <input type="hidden" class="idinput" value="${herramienta.id}">
                               <label>${herramienta.nombre} - x${herramienta.cantidad}</label>`
                        }
                        
                        </p>
                    `).join('')}
                </div>
                <p class="usuario">Usuario: ${pedido.nombre_usuario}</p>
                <p class="nPedido">N° pedido: ${pedido.id_pedido}</p>
                <p class="fecha">Fecha: ${pedido.fecha}</p>
                <p class="hora">Hora: ${pedido.hora}</p>
            </div>
        </div>
    `;
    

        const pedidoContenedor = document.createElement('div');
        pedidoContenedor.classList.add('pedido');
        pedidoContenedor.innerHTML = pedidoHTML;
        contenedor.appendChild(pedidoContenedor);
    });
    const numberInputs = document.querySelectorAll('input[type="number"]');

numberInputs.forEach(input => {

  input.addEventListener('input', () => {
    if (input.value > input.max) {
      input.value = input.max;
    }
  });
});
}
function verificarCheckboxes(pedidoId) {
    const seleccionado = document.getElementById(`herramientas_pedido_${pedidoId}`);

    const checkboxes = seleccionado.querySelectorAll('.herramientas input[type="checkbox"]');
    
    const todosMarcados = Array.from(checkboxes).every(checkbox => checkbox.checked);
    
    if (!todosMarcados) {
        return {
            todosMarcados: false
        };
    }
    
    const idinput = seleccionado.querySelectorAll('.herramientas .idinput');
    const tablainput = seleccionado.querySelectorAll('.herramientas .tabla');
    const cantidadinput = seleccionado.querySelectorAll('.herramientas input[type="number"]');

    const herramientas = Array.from(idinput).map((idinput2, index) => {
        return {
            id: parseInt(idinput2.value),  
            cantidad: parseInt(cantidadinput[index].value) || 0,  
            tabla: tablainput[index].value 
        };
    });
    console.log("Lista de herramientas con cantidades:", herramientas);
    
    return {
        todosMarcados: true,
        cantidades: herramientas
    };
}


function cambiarEstado(pedidoId) {
    const selectEstado = document.getElementById(`cambiar_estado_${pedidoId}`);
    const nuevoEstadoId = selectEstado.value;

    if(nuevoEstadoId == 4){
        respuesta = verificarCheckboxes(pedidoId)
        if(respuesta.todosMarcados){
            enviar(selectEstado,nuevoEstadoId,pedidoId,respuesta.cantidades)
        }else{
            alert("No todos los checkboxes están seleccionados.");
        }
    }else{
        enviar(selectEstado,nuevoEstadoId,pedidoId,[])
    }
}
function enviar(selectEstado,nuevoEstadoId,pedidoId,cantidades){
    console.log(cantidades)
    fetch(`http://127.0.0.1:5000/cambiar_estado_pedido`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pedido_id: pedidoId,
            estado_id: nuevoEstadoId,
            cantidades: cantidades
        })
    })
        .then(response => response.json())
        .then(data => {
            alert('Estado cambiado correctamente');
            obtenerTodosLosPedidos()
        })
        .catch(error => console.error('Error al cambiar el estado:', error));
    
}