const translations = {
    en: 'en.json',
    vi: 'vi.json',
};

localStorage.getItem('language') || localStorage.setItem('language', 'vi');

function setLanguage(lang) {
    localStorage.setItem('language', lang);
}

function changeLanguage(lang) {
    setLanguage(lang);
    fetchLanguage(localStorage.getItem('language'));
}

function fetchLanguage(lang) {
    fetch(`../../assets/locales/${translations[lang]}`)
        .then((res) => res.json())
        .then((data) => {
            window.i18nData = data;
            document.querySelectorAll('[data-i18n]').forEach((element) => {
                const key = element.getAttribute('data-i18n');
                const [section, subsection] = key.split('.');
                element.textContent = data[section][subsection];
            })
            if (!window.location.pathname.includes('index.html')) {
                loadBreadCrumb(lang);
            }
            if (window.location.pathname.includes('contact_us.html')) {
                reloadContactMessage();
            }
            if (window.location.pathname.includes('blog_detail.html')) {
                reloadBlogDetailMessage();
            }
            if (window.location.pathname.includes('index.html')) {
                reloadHomeMessage();
                fetchProductTypes(lang);
            }
            if (window.location.pathname.includes('product.html')) {
                fetchProductPageData(lang);
            }
            if (window.location.pathname.includes('product_detail.html')) {
                loadData(lang);
            }
            if (window.location.pathname.includes('signIn.html')) {
                reloadMessageSignIn();
            }
            if (window.location.pathname.includes('signUp.html')) {
                reloadMessageSignUp();
            }
            if (window.location.pathname.includes('blog.html')) {
                fetchBlogPageData(lang)
            }
            if (window.location.pathname.includes('blog_detail.html')) {
                fetchBlogDetailData(lang)
            }
            if (window.location.pathname.includes('cart.html')) {
                loadCart(lang);
            }
            if (window.location.pathname.includes('account.html')) {
                loadOrderHistory(lang)
            }
        });
}

function t(key) {
    const [section, subsection] = key.split('.');
    return window.i18nData[section][subsection];
}
