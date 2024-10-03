const validationSetUp = {
    username: {
        validator: value => value.length >= 3,
        errorMessageI18n: 'blog_detail.error_name',
        idErrorElement: 'username-error'
    },
    email: {
        validator: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessageI18n: 'blog_detail.error_email',
        idErrorElement: 'email-error'
    },
    message: {
        validator: value => value.length >= 10,
        errorMessageI18n: 'blog_detail.error_message',
        idErrorElement: 'message-error'
    }
};
const successAlert = ['blog_detail.success_message', 'success']
const form = document.getElementById('blog-form');

function reloadBlogDetailMessage() {
    const successAlert = document.getElementById('alert-message-success');
    successAlert.textContent = t('blog_detail.success_message');

    Object.keys(validationSetUp).forEach(field => {
        const { errorMessageI18n, idErrorElement } = validationSetUp[field];
        const errorElement = document.getElementById(idErrorElement);
        errorElement.textContent = t(errorMessageI18n);
    });
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));
    validateForm(validationSetUp, successAlert);
});

Object.keys(validationSetUp).forEach(field => {
    document.getElementById(field).addEventListener('input', function(event) {
        const inputElement = event.target;
        validateInput(inputElement, validationSetUp);
    });
});
