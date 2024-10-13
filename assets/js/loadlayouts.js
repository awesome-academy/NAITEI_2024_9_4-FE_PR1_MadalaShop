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
			} else {
				content = tempDiv;
			}

			document.getElementById(elementId).outerHTML = content.innerHTML;
			if (elementId === 'header') {
				switchCSSLanguageButtons();
				setDefaultCSSLanguage();
				checkLogin();
				clickAccount();
				clickLogout();
				toggleUserInfo();
				toggleListLink();
				loadCartNumber();
			}
		})
		.catch((error) => console.error(error));
}

loadLayout('header', '../../src/layouts/header.html');
loadLayout('footer', '../../src/layouts/footer.html');
loadLayout('alert-success-container', '../../src/components/alert.html', 'alert-success-container');
loadLayout('alert-warning-container', '../../src/components/alert.html', 'alert-warning-container');
loadLayout('tooltip-container', '../../src/components/tooltip.html');

import('./i18n.js').then(() => {
	changeLanguage(localStorage.getItem('language') || 'vi');
})
