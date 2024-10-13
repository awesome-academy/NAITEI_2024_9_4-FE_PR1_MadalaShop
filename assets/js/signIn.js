const errEmailMessage = ['sign-in.error_email', 'sign-in.error_email_not_exist'];
const errPasswordMessage = ['sign-in.error_password', 'sign-in.error_password_incorrect'];
let accountExists = false;
let accountEmpty = false;
let passwordCorrect = false;
let passwordEmpty = false;

document.getElementById('sign-in-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const emailInput = document.getElementById('emailSignIn');
    const email = emailInput.value.trim();

    const passwordInput = document.getElementById('passwordSignIn');
    const password = passwordInput.value.trim();
    let isValid = true;

    document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));

    // validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        emailInput.classList.add('border-red-500');
        const errorElement = document.getElementById('email-error');
        errorElement.textContent = t('sign-in.error_email');
        errorElement.classList.remove('hidden');
        accountEmpty = true;
        isValid = false;
    }

    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    accountExists = accounts.some(item => item.email === email);

    // validate password
    if (password.length === 0) {
        passwordInput.classList.add('border-red-500');
        const errorElement = document.getElementById('password-error');
        errorElement.textContent = t('sign-in.error_password');
        errorElement.classList.remove('hidden');
        passwordEmpty = true;
        isValid = false;
    }

    if (isValid) {
        for (const item of accounts) {
            if (item.email === email) {
                if (item.password === encrypt(password)) {
                    passwordCorrect = true;

                    const header = { alg: 'HS256', typ: 'JWT' };
                    const payload = {
                        account: item,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 giờ
                    };
                    const secretKey = "ed635f9d05cfaf483f6ee8d520b81d43c0137b5797c7b641b05291e94e3475d3";

                    const token = await createJWT(header, payload, secretKey);
                    sessionStorage.setItem('token', token);
                    window.location.href = "../../src/pages/index.html";
                    return;
                } else {
                    passwordCorrect = false;
                }
            }
        }

        if (!accountExists) {
            const errorElement = document.getElementById('email-error');
            emailInput.classList.add('border-red-500');
            errorElement.textContent = t('sign-in.error_email_not_exist');
            errorElement.classList.remove('hidden');
        }

        if (accountExists && !passwordCorrect) {
            const errorElement = document.getElementById('password-error');
            passwordInput.classList.add('border-red-500');
            errorElement.textContent = t('sign-in.error_password_incorrect');
            errorElement.classList.remove('hidden');
        }
    }
});

function reloadMessageSignIn() {
    const errorEmail = document.getElementById('email-error');
    const errorPassword = document.getElementById('password-error');

    if (accountEmpty) {
        errorEmail.textContent = t(errEmailMessage[0]);
    } else if (!accountExists) {
        errorEmail.textContent = t(errEmailMessage[1]);
    }

    if (passwordEmpty) {
        errorPassword.textContent = t(errPasswordMessage[0]);
    } else if (!passwordCorrect) {
        errorPassword.textContent = t(errPasswordMessage[1]);
    }
}

function validateInput(event) {
    const inputElement = event.target;
    const inputValue = inputElement.value.trim();
    let errorElement;

    if (inputElement.id === 'emailSignIn') {
        errorElement = document.getElementById('email-error');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(inputValue)) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = "";
        }
    }

    if (inputElement.id === 'passwordSignIn') {
        errorElement = document.getElementById('password-error');
        if (inputValue.length > 0) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = "";
        }
    }
}
document.getElementById('emailSignIn').addEventListener('input', validateInput);
document.getElementById('passwordSignIn').addEventListener('input', validateInput);
