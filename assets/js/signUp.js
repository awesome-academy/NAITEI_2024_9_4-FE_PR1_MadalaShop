const errEmailMessage = ['sign-up.error_email', 'sign-up.error_email_double'];
const errPasswordMessage = ['sign-up.error_password', 'sign-up.error_password_match'];
let emailExists = false;
let passwordMatch = true;
document.getElementById('sign-up-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const firstNameInput = document.getElementById('firstName');
    const firstName = firstNameInput.value.trim();

    const lastNameInput = document.getElementById('lastName');
    const lastName = lastNameInput.value.trim();

    const addressInput = document.getElementById('address');
    const address = addressInput.value.trim();

    const emailInput = document.getElementById('emailSignUp');
    const email = emailInput.value.trim();

    const passwordInput = document.getElementById('passwordSignUp');
    const password = passwordInput.value.trim();

    const passwordVerifyInput = document.getElementById('passwordVerify');
    const passwordVerify = passwordVerifyInput.value.trim();
    let isValid = true;

    document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));

    // Validate first name
    if (firstName.length === 0) {
        const errorElement = document.getElementById('first-name-error');
        firstNameInput.classList.add('border-red-500');
        errorElement.textContent = t('sign-up.error_first_name');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    // Validate last name
    if (lastName.length === 0) {
        const errorElement = document.getElementById('last-name-error');
        lastNameInput.classList.add('border-red-500');
        errorElement.textContent = t('sign-up.error_last_name');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    // Validate last name
    if (address.length === 0) {
        const errorElement = document.getElementById('address-error');
        addressInput.classList.add('border-red-500');
        errorElement.textContent = t('sign-up.error_address');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        const errorElement = document.getElementById('email-error');
        emailInput.classList.add('border-red-500');
        errorElement.textContent = t('sign-up.error_email');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    //Check existing account
    let accounts = JSON.parse(localStorage.getItem('accounts'));
    if (accounts) {
        const emailExist = accounts.some(item => item.email === email);
        if (emailExist) {
            const errorElement = document.getElementById('email-error');
            emailInput.classList.add('border-red-500');
            errorElement.textContent = t('sign-up.error_email_double');
            errorElement.classList.remove('hidden');
            isValid = false;
            emailExists = true;
        }
    }

    // Validate password
    if (password.length === 0) {
        const errorElement = document.getElementById('password-error');
        passwordInput.classList.add('border-red-500');
        errorElement.textContent = t('sign-up.error_password');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    if (passwordVerify.length === 0) {
        const errorElement = document.getElementById('password-confirm-error');
        passwordVerifyInput.classList.add('border-red-500');
        errorElement.textContent = t('sign-up.error_password');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    if (password.length === 0 && password.length === 0) {
        passwordMatch = true;
    }

    // Validate password confirmation
    if (password !== passwordVerify) {
        const errorElement_pw = document.getElementById('password-error');
        const errorElement_pw_retype = document.getElementById('password-confirm-error');
        passwordVerifyInput.classList.add('border-red-500');
        passwordInput.classList.add('border-red-500');
        errorElement_pw.textContent = t('sign-up.error_password_match');
        errorElement_pw_retype.textContent = t('sign-up.error_password_match');
        errorElement_pw.classList.remove('hidden');
        errorElement_pw_retype.classList.remove('hidden');
        passwordMatch = false;
        isValid = false;
    }

    if (isValid) {
        // Lưu accounts xuống csdl
        const account = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            address: address,
            checkboxStatus: document.getElementById('emailSignUp').checked,
            password: encrypt(password),
        };
        let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

        document.querySelectorAll('.error-message').forEach(error => {
            error.classList.add('hidden');
            error.classList.remove('border-red-500');
        });
        accounts.push(account);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        showAlert(t('sign-up.success_message'), 'success');

        const header = { alg: 'HS256', typ: 'JWT' };
        const payload = {
            account: account,
            exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 giờ
        };
        const secretKey = "ed635f9d05cfaf483f6ee8d520b81d43c0137b5797c7b641b05291e94e3475d3";
        const token = await createJWT(header, payload, secretKey);
        sessionStorage.setItem('token', token);
        window.location.href = "../../src/pages/index.html";
    }
});

function reloadMessageSignUp() {
    const errorFirstName = document.getElementById('first-name-error');
    const errorLastName = document.getElementById('last-name-error');
    const errorAddress = document.getElementById('address-error');
    const errorEmail = document.getElementById('email-error');
    const errorPassword = document.getElementById('password-error');
    const errorPasswordVerify = document.getElementById('password-confirm-error');
    const successAlert = document.getElementById('alert-message-success');

    errorFirstName.textContent = t('sign-up.error_first_name');
    errorLastName.textContent = t('sign-up.error_last_name');
    errorAddress.textContent = t('sign-up.error_address');
    errorEmail.textContent = emailExists ? t(errEmailMessage[1]) : t(errEmailMessage[0]);
    errorPassword.textContent = !passwordMatch ? t(errPasswordMessage[1]) : t(errPasswordMessage[0]);
    errorPasswordVerify.textContent = !passwordMatch ? t(errPasswordMessage[1]) : t(errPasswordMessage[0]);
    successAlert.textContent = t('sign-up.success_message');
}

function validateInput(event) {
    const inputElement = event.target;
    const inputValue = inputElement.value.trim();
    let errorElement;

    if (inputElement.id === 'firstName') {
        errorElement = document.getElementById('first-name-error');
        if (inputValue.length >= 0) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = '';
        }
    }

    if (inputElement.id === 'lastName') {
        errorElement = document.getElementById('last-name-error');
        if (inputValue.length >= 0) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = '';
        }
    }

    if (inputElement.id === 'address') {
        errorElement = document.getElementById('address-error');
        if (inputValue.length >= 0) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = '';
        }
    }

    if (inputElement.id === 'emailSignUp') {
        errorElement = document.getElementById('email-error');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(inputValue)) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = '';
        }
    }

    if (inputElement.id === 'passwordSignUp') {
        errorElement = document.getElementById('password-error');
        if (inputValue.length >= 0) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = '';
        }
    }

    if (inputElement.id === 'passwordVerify') {
        errorElement = document.getElementById('password-confirm-error');
        const errorElementPassword = document.getElementById('password-error');
        const password = document.getElementById('passwordSignUp');
        const passwordValue = document.getElementById('passwordSignUp').value.trim();
        if (inputValue === passwordValue) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = '';
            password.classList.add('focus:border-primary-color');
            password.classList.remove('border-red-500');
            errorElementPassword.textContent = '';
        }
    }
}

document.getElementById('firstName').addEventListener('input', validateInput);
document.getElementById('lastName').addEventListener('input', validateInput);
document.getElementById('address').addEventListener('input', validateInput);
document.getElementById('emailSignUp').addEventListener('input', validateInput);
document.getElementById('passwordSignUp').addEventListener('input', validateInput);
document.getElementById('passwordVerify').addEventListener('input', validateInput);
