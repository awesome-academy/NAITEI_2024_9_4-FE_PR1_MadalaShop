import { switchCSSLanguageButtons, setDefaultCSSLanguage } from './header.js';

function loadLayout(elementId, filePath) {
  fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error(`Không thể tải trang ${elementId}`);
      return response.text();
    })
    .then((data) => {
      document.getElementById(elementId).innerHTML = data;
      if (elementId === 'header') {
        switchCSSLanguageButtons();
        setDefaultCSSLanguage();
      }
    })
    .catch((error) => console.error(error));
}

export { switchCSSLanguageButtons };

Promise.all([
  loadLayout('header', '../../src/layouts/header.html'),
  loadLayout('footer', '../../src/layouts/footer.html'),
]).then(() => {
  changeLanguage(localStorage.getItem('language') || 'vi');
});
