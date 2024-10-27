document.addEventListener('click', function (event) {
    const sumarBtn = event.target.closest('.cant-sumar');
    const restarBtn = event.target.closest('.cant-restar');
    const cantidadInput = document.querySelector('#pedir_cantidad');

    if (!cantidadInput) {
        return; 
    }

    if (sumarBtn) {
        let valorActual = parseInt(cantidadInput.value);
        let maximo = parseInt(cantidadInput.getAttribute('max'));
        if (valorActual < maximo) {
            cantidadInput.value = valorActual + 1;
        }
    }

    if (restarBtn) {
        let valorActual = parseInt(cantidadInput.value);
        let minimo = parseInt(cantidadInput.getAttribute('min'));
        if (valorActual > minimo) {
            cantidadInput.value = valorActual - 1;
        }
    }
});
