const sumarBtn = modal.querySelector('.cant-sumar');
const restarBtn = modal.querySelector('.cant-restar');
sumarBtn.addEventListener('click', () => {
    modalCantidadInput.value = parseInt(modalCantidadInput.value) + 1;
});

restarBtn.addEventListener('click', () => {
    if (modalCantidadInput.value > 1) {
        modalCantidadInput.value = parseInt(modalCantidadInput.value) - 1;
    }
});
