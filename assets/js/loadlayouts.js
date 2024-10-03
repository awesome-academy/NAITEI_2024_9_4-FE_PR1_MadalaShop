import { switchCSSLanguageButtons, setDefaultCSSLanguage } from './header.js';

function loadLayout(elementId, filePath, contentId = null) {
  fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error(`Không thể tải trang ${elementId}`);
      return response.text();
    })
    .then((data) => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data;
      
      let content;
      if (contentId) {
        content = tempDiv.querySelector(`#${contentId}`);
        if (!content) throw new Error(`Không tìm thấy phần tử với id ${contentId} trong ${filePath}`);
      } else {
        content = tempDiv;
      }

      document.getElementById(elementId).innerHTML = content.innerHTML;
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
  loadLayout('alert-success-container', '../../src/components/alert.html', 'alert-success-container'),
]).then(() => {
  changeLanguage(localStorage.getItem('language') || 'vi');
});
