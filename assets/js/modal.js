function showModal(content) {
    const orderDetailModal = document.getElementById('modal-container');
    document.getElementById('modal-content').innerHTML = content;
    orderDetailModal.classList.remove('hidden');
}

function closeModal() {
    const orderDetailModal = document.getElementById('modal-container');
    orderDetailModal.classList.add('hidden');
}

function updateMaxWidthModal(maxw){
    if (maxw.includes("max-w-")) {
        document.getElementById('modal-wrap').classList.remove('max-w-lg');
        document.getElementById('modal-wrap').classList.add(maxw);
    }
}
