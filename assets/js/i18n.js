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
  fetchLanguage(lang);
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
      reloadMessage();
    });
}

function t(key) {
  const [section, subsection] = key.split('.');
  return window.i18nData[section][subsection];
}
