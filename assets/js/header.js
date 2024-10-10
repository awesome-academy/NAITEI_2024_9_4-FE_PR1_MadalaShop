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
    console.log(1);
    document.querySelector('.authentication').classList.add('hidden');
    document.querySelector('.user-greeting').classList.remove('hidden');
    document.getElementById('userLogIn').textContent = `${account.firstName}`;
  } else {
    document.querySelector('.authentication').classList.remove('hidden');
  }
}

function checkLogout() {
  document.querySelector('.user-greeting').addEventListener('click', function () {
    logoutBtn.classList.toggle('hidden');
  });
  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('token');
    document.querySelector('.authentication').classList.remove('hidden');
    document.querySelector('.user-greeting').classList.add('hidden');
    window.location.href = '../../src/pages/index.html';
  })
}

function toggleListLink() {
  toggleListLinkBtn.addEventListener('click', () => {
    listLink.classList.toggle('hidden');
  })
}

export { switchCSSLanguageButtons, setDefaultCSSLanguage, checkLogin, checkLogout, toggleListLink };
