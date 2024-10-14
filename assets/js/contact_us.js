const validationSetUp = {
    username: {
        validator: value => value.length >= 3,
        errorMessageI18n: 'contact_us.error_name',
        idErrorElement: 'username-error'
    },
    email: {
        validator: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessageI18n: 'contact_us.error_email',
        idErrorElement: 'email-error'
    },
    message: {
        validator: value => value.length >= 10,
        errorMessageI18n: 'contact_us.error_message',
        idErrorElement: 'message-error'
    }
};
const successAlert = ['contact_us.success_message', 'success']
const form = document.getElementById('contact-form');

function reloadContactMessage() {
    const successAlert = document.getElementById('alert-message-success');
    successAlert.textContent = t('contact_us.success_message');

    Object.keys(validationSetUp).forEach(field => {
        const { errorMessageI18n, idErrorElement } = validationSetUp[field];
        const errorElement = document.getElementById(idErrorElement);
        errorElement.textContent = t(errorMessageI18n);
    });
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));

    let isValid = true;
    const formData = {};

    Object.keys(validationSetUp).forEach(field => {
        const inputElement = document.getElementById(field);
        const value = inputElement.value.trim();
        const { validator, errorMessageI18n, idErrorElement } = validationSetUp[field];

        if (validator(value)) {
            inputElement.classList.remove('border-red-500');
            inputElement.classList.add('focus:border-primary-color');
            formData[field] = value;
        } else {
            const errorElement = document.getElementById(idErrorElement);
            inputElement.classList.add('border-red-500');
            inputElement.classList.remove('focus:border-primary-color');
            errorElement.textContent = t(errorMessageI18n);
            errorElement.classList.remove('hidden');
            isValid = false;
        }
    });

    if (isValid) {
        const userIdea = JSON.parse(localStorage.getItem('contactForms')) || [];
        userIdea.push(formData);
        localStorage.setItem('contactForms', JSON.stringify(userIdea));
        showAlert(t(successAlert[0]), successAlert[1]);
        form.reset();
    }
});


Object.keys(validationSetUp).forEach(field => {
    document.getElementById(field).addEventListener('input', function (event) {
        const inputElement = event.target;
        validateInput(inputElement, validationSetUp);
    });
});
