const activeLanguageClassList = [
    'px-3',
    'py-0.5',
    'bg-black',
    'text-white',
    'rounded',
    'border-solid',
    'border',
];

function switchCSSLanguageButtons() {
    const languages = document.querySelectorAll('.lang');
    languages.forEach((item) => {
        item.addEventListener('click', function () {
            languages.forEach((item) =>
                item.classList.remove(...activeLanguageClassList)
            );
            this.classList.add(...activeLanguageClassList);
        });
    });
}

function setDefaultCSSLanguage() {
    const languages = document.querySelectorAll('.lang');
    languages.forEach((item) => {
        const selectedlanguage = item.textContent.toLowerCase().trim();
        const languageInStorage = localStorage.getItem('language');
        if (selectedlanguage == languageInStorage) {
            languages.forEach((item1) =>
                item1.classList.remove(...activeLanguageClassList)
            );
            item.classList.add(...activeLanguageClassList);
        }
    });
}

function checkLogin() {
    const token = sessionStorage.getItem('token');
    if (token) {
        const account = decodeJWT(token).account;
        document.querySelector('.authentication').classList.add('hidden');
        document.querySelector('.user-greeting').classList.remove('hidden');
        document.getElementById('userLogIn').textContent = `${account.firstName}`;
    } else {
        document.querySelector('.authentication').classList.remove('hidden');
    }
}

function toggleUserInfo() {
    document.querySelector('.user-greeting').addEventListener('click', function () {
        userInfo.classList.toggle('hidden');
    });
}

function clickLogout() {
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('token');
        document.querySelector('.authentication').classList.remove('hidden');
        document.querySelector('.user-greeting').classList.add('hidden');
        userInfo.classList.add('hidden');
        window.location.href = '../../src/pages/index.html';
    })
}

function clickAccount() {
    accountBtn.addEventListener('click', () => {
        userInfo.classList.add('hidden');
        window.location.href = '../../src/pages/account.html';
    })
}

function toggleListLink() {
    toggleListLinkBtn.addEventListener('click', () => {
        listLink.classList.toggle('hidden');
    })
}

function loadCartNumber() {
    const account = getAccount();
    const allCarts = JSON.parse(localStorage.getItem('carts')) || {};
    const cartNumber = document.getElementById('cartNumber');

    if (allCarts[account] && allCarts[account].cart.length > 0) {
        const totalItems = allCarts[account].cart.length;
        cartNumber.textContent = totalItems > 10 ? `10+` : totalItems;
    } else {
        cartNumber.textContent = 0;
    }
}
