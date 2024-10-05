function validateForm(validationSetUp, alert) {
    let isValid = true; 
    Object.keys(validationSetUp).forEach(field => {
        const inputElement = document.getElementById(field);
        const value = inputElement.value.trim();
        const { validator, errorMessageI18n, idErrorElement } = validationSetUp[field];

        if (validator(value)) {
            inputElement.classList.remove('border-red-500');
            inputElement.classList.add('focus:border-primary-color');
        } else {
            inputElement.classList.add('border-red-500');
            inputElement.classList.remove('focus:border-primary-color');
            const errorElement = document.getElementById(idErrorElement);
            errorElement.textContent = t(errorMessageI18n);
            errorElement.classList.remove('hidden');
            isValid = false;
        }
    });

    if (isValid) {
        showAlert(t(alert[0]), alert[1]);
    }
}

function validateInput(inputElement, validationSetUp) {
    const inputValue = inputElement.value.trim();
    const { validator, idErrorElement, errorMessageI18n } = validationSetUp[inputElement.id];
    const errorElement = document.getElementById(idErrorElement);

    if (validator(inputValue)) {
        inputElement.classList.remove('border-red-500');
        inputElement.classList.add('focus:border-primary-color');
        errorElement.textContent = '';
    } else {
        inputElement.classList.add('border-red-500');
        inputElement.classList.remove('focus:border-primary-color');
        errorElement.textContent = t(errorMessageI18n);
    }
}
