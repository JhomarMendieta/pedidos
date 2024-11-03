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
    console.log(estadosGlobales)
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
                        <input type="hidden" value="${pedido.id_estado}" id="estado_anterior_${pedido.id_pedido}">

                        <select id="cambiar_estado_${pedido.id_pedido}">
                            ${estadosGlobales.map(estado => {
                                console.log(estado.estado)
                                if (pedido.estado === 'Pendiente' && estado.estado != 'Pendiente') {
                                    if(estado.estado == "Cancelado" || estado.estado == "Aceptado"){
                                        return `
                                            <option value="${estado.id}" ${estado.estado === pedido.estado ? 'selected' : ''}>${estado.estado}</option>
                                        `;
                                    }
                                } else if (pedido.estado === 'Aceptado' && estado.estado != 'Aceptado') {
                                    if(estado.estado == "En espera de retiro"){
                                    return `
                                        <option value="${estado.id}" ${estado.estado === pedido.estado ? 'selected' : ''}>${estado.estado}</option>
                                    `;
                                    }
                                } else if (pedido.estado === 'En espera de retiro' && estado.estado != 'En espera de retiro') {
                                    if(estado.estado == "Entregado"){
                                    return `
                                        <option value="${estado.id}" ${estado.estado === pedido.estado ? 'selected' : ''}>${estado.estado}</option>
                                    `;
                                    }
                                }else if (pedido.estado === 'Entregado' && estado.estado != 'Entregado') {
                                    if(estado.estado == "Devuelto" ){
                                    return `
                                        <option value="${estado.id}" ${estado.estado === pedido.estado ? 'selected' : ''}>${estado.estado}</option>
                                    `;
                                    }
                                }else if (pedido.estado === 'Bajo seguimiento' && estado.estado != 'Bajo seguimiento') {
                                    if(estado.estado == "Devuelto"){
                                    return `
                                        <option value="${estado.id}" ${estado.estado === pedido.estado ? 'selected' : ''}>${estado.estado}</option>
                                    `;
                                    }
                                }else{
                                    return `
                                        <option value="${estado.id}" ${estado.estado === pedido.estado ? 'selected' : ''}>${estado.estado}</option>
                                    `;
                                }
                            }).join('')}
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
                            :pedido.estado === "Bajo seguimiento" && herramienta.tabla == "consumible" || "Bajo seguimiento" && herramienta.tabla == "herramienta" && herramienta.cantidad == herramienta.devueltos 
                            ? `<label style="text-decoration: line-through; color: gray;">${herramienta.nombre} - x${herramienta.cantidad}</label>` 
                            :pedido.estado === "Bajo seguimiento" && herramienta.tabla == "herramienta" && herramienta.cantidad != herramienta.devueltos 
                            ? `<label style="background-color: red; color:white;">${herramienta.nombre} - ${herramienta.devueltos}/${herramienta.cantidad}</label>` 
                            : `<input type="checkbox" ${pedido.estado === "Devuelto" ? "checked" : ""}>
                            &nbsp<input type="number" class="cantidad" value="${herramienta.cantidad}" min="0" max="${herramienta.cantidad}">&nbsp;
                            <input type="hidden" class="tabla" value="${herramienta.tabla}">
                            <input type="hidden" class="idinput" value="${herramienta.id}">
                            <input type="hidden" class="cantidadreal" value="${herramienta.cantidad}">
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
    const numberInputs = document.querySelectorAll('.cantidad'); 
console.log(numberInputs);

numberInputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.value !== 0 && !isNaN(input.value) && parseInt(input.value) > parseInt(input.max)) {
      input.value = input.max; 
    } else if (input.value === '') {
      input.value = 0; 
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
    const cantidadreal = seleccionado.querySelectorAll('.herramientas .cantidadreal');
    const cantidadinput = seleccionado.querySelectorAll('.herramientas input[type="number"]');
    sino = false
    const herramientas = Array.from(idinput).map((idinput2, index) => {
        if(tablainput[index].value == "herramienta" && cantidadreal[index].value != parseInt(cantidadinput[index].value)){
            sino = true
        }
        return {
            id: parseInt(idinput2.value),  
            cantidad: parseInt(cantidadinput[index].value) || 0,  
            tabla: tablainput[index].value 
        };
    });
    
    console.log("Lista de herramientas con cantidades:", herramientas);
    return {
        todosMarcados: true,
        cantidades: herramientas,
        sino: sino
    };
}

function cambiarEstado(pedidoId) {
    const selectEstado = document.getElementById(`cambiar_estado_${pedidoId}`);
    const estadoanterior = document.getElementById(`estado_anterior_${pedidoId}`);
    const nuevoEstadoId = selectEstado.value;
    const estadoAnteriorId = estadoanterior.value;
    if(nuevoEstadoId != estadoAnteriorId){
        if(nuevoEstadoId == 6){
            respuesta = verificarCheckboxes(pedidoId)
            if(respuesta.todosMarcados){
                if(!respuesta.sino){
                    enviar(selectEstado,nuevoEstadoId,pedidoId,respuesta.cantidades)
                }else{
                    alert("El pedido debe enviarse a observación por falta de unidades");
                    enviar(selectEstado,7,pedidoId,respuesta.cantidades)
                }
            }else{
                alert("No todos los checkboxes están seleccionados.");
            }
        }else{
            enviar(selectEstado,nuevoEstadoId,pedidoId,[])
        }
    }else{
        alert("El pedido ya cuenta con el estado seleccionado");
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