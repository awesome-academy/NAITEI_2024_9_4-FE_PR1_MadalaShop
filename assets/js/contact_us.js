document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();

    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();

    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    let isValid = true;

    document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));

    if (username.length < 3) {
        usernameInput.classList.add('border-red-500');
        usernameInput.classList.remove('focus:border-primary-color');
        const errorElement = document.getElementById('username-error');
        errorElement.textContent = t('contact_us.error_name');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailInput.classList.add('border-red-500');
        emailInput.classList.remove('focus:border-primary-color');
        const errorElement = document.getElementById('email-error');
        errorElement.textContent = t('contact_us.error_email');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    if (message.length < 10) {
        messageInput.classList.add('border-red-500');
        messageInput.classList.remove('focus:border-primary-color');
        const errorElement = document.getElementById('message-error');
        errorElement.textContent = t('contact_us.error_message');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    if (isValid) {
        showAlert(t('contact_us.success_message'), 'success');
    }
});

function reloadMessage() {
    const errorUsername = document.getElementById('username-error');
    const errorEmail = document.getElementById('email-error');
    const errorMessage = document.getElementById('message-error');
    const successAlert = document.getElementById('alert-message-success');
    
    errorUsername.textContent = t('contact_us.error_name');
    errorEmail.textContent = t('contact_us.error_email');
    errorMessage.textContent = t('contact_us.error_message');
    successAlert.textContent = t('contact_us.success_message');
}

function validateInput(event) {
    const inputElement = event.target;
    const inputValue = inputElement.value.trim();
    let errorElement;

    if (inputElement.id === 'username') {
        errorElement = document.getElementById('username-error');
        if (inputValue.length >= 3) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = "";
        }
    }

    if (inputElement.id === 'email') {
        errorElement = document.getElementById('email-error');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(inputValue)) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = "";
        }
    }

    if (inputElement.id === 'message') {
        errorElement = document.getElementById('message-error');
        if (inputValue.length >= 10) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = "";
        }
    }
}

document.getElementById('username').addEventListener('input', validateInput);
document.getElementById('email').addEventListener('input', validateInput);
document.getElementById('message').addEventListener('input', validateInput);
