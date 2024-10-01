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

export { switchCSSLanguageButtons, setDefaultCSSLanguage };
