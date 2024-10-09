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
        emailInput.classList.remove('focus:border-primary-color');
        const errorElement = document.getElementById('email-error');
        errorElement.textContent = t('sign-in.error_email');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    // validate password
    if (password.length < 3) {
        passwordInput.classList.add('border-red-500');
        passwordInput.classList.remove('focus:border-primary-color');
        const errorElement = document.getElementById('password-error');
        errorElement.textContent = t('sign-in.error_password');
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    if (isValid) {
        // lấy tài khoản trong localStorage
        try {
            const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
            for (const item of accounts) {
                if (item.email === email && item.password === encrypt(password)) {
                    const header = {
                        alg: 'HS256',
                        typ: 'JWT'
                    };

                    const payload = {
                        account: item,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 giờ
                    };
                    const secretKey = "ed635f9d05cfaf483f6ee8d520b81d43c0137b5797c7b641b05291e94e3475d3";

                    const token = await createJWT(header, payload, secretKey);
                    sessionStorage.setItem('token', token);
                    window.location.href = "../../src/pages/index.html";
                }
            }
        } catch (error) {
            console.error('Error generating token:', error);
        }
    }
});

function reloadMessageSignIn() {
    const errorEmail = document.getElementById('email-error');
    const errorPassword = document.getElementById('password-error');

    errorEmail.textContent = t('sign-in.error_email');
    errorPassword.textContent = t('sign-in.error_password');
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
        if (inputValue.length >= 3) {
            inputElement.classList.add('focus:border-primary-color');
            inputElement.classList.remove('border-red-500');
            errorElement.textContent = "";
        }
    }
}

document.getElementById('emailSignIn').addEventListener('input', validateInput);
document.getElementById('passwordSignIn').addEventListener('input', validateInput);
