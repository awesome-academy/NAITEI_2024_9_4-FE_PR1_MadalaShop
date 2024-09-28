document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let isValid = true;
    document.querySelectorAll('.error-message').forEach(error => error.classList.add('hidden'));
    if (username.length < 3) {
        const errorElement = document.getElementById('username-error');
        errorElement.textContent = "Tên phải có ít nhất 3 ký tự.";
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        const errorElement = document.getElementById('email-error');
        errorElement.textContent = "Email không hợp lệ.";
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    if (message.length < 10) {
        const errorElement = document.getElementById('message-error');
        errorElement.textContent = "Tin nhắn phải có ít nhất 10 ký tự.";
        errorElement.classList.remove('hidden');
        isValid = false;
    }

    if (isValid) {
        alert("Thông tin hợp lệ.");
    }
});

function validateInput(event) {
    const inputElement = event.target;
    const inputValue = inputElement.value.trim();
    let errorElement;

    if (inputElement.id === 'username') {
        errorElement = document.getElementById('username-error');
        if (inputValue.length >= 3) {
            errorElement.textContent = "";
        }
    }

    if (inputElement.id === 'email') {
        errorElement = document.getElementById('email-error');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(inputValue)) {
            errorElement.textContent = "";
        }
    }

    if (inputElement.id === 'message') {
        errorElement = document.getElementById('message-error');
        if (inputValue.length >= 10) {
            errorElement.textContent = "";
        }
    }
}

document.getElementById('username').addEventListener('input', validateInput);
document.getElementById('email').addEventListener('input', validateInput);
document.getElementById('message').addEventListener('input', validateInput);
