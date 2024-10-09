function showAlert(message, type = 'success') {
    const alertElement = document.getElementById(`alert-${type}`);
    const alertMessage = document.getElementById(`alert-message-${type}`);
    alertMessage.textContent = message;

    alertElement.classList.remove('hidden');

    document.getElementById(`alert-close-${type}`).addEventListener('click', function () {
        alertElement.classList.add('hidden');
    });

    setTimeout(() => {
        alertElement.classList.add('hidden');
    }, 5000);
}

