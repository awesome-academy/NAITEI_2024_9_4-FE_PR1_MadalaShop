const breadcrumbData = [
  { url: "../pages/index.html", data: "breadcrumb.home" },
  { url: "../pages/aboutUs.html", data: "breadcrumb.about_us" },
  { url: "../pages/cart.html", data: "breadcrumb.cart" },
  { url: "../pages/contact.html", data: "breadcrumb.contact" },
];

const breadcrumbContainer = document.getElementById("breadcrumb");

const currentUrl = window.location.pathname;

breadcrumbData.forEach((item, index) => {
  if (currentUrl.includes(item.url.split("/")[2])) {
    const homeCrumb = `
      <li><a href="${breadcrumbData[0].url}" class="hover:underline hover:text-primary-color" data-i18n="${breadcrumbData[0].data}"></a></li>
      <li><i class="fa-solid fa-angle-right text-primary-color text-xs"></i></li>
    `;
    const currentCrumb = `
      <li><a href="${item.url}" class="text-primary-color hover:underline" data-i18n="${item.data}"></a></li>
    `;
    breadcrumbContainer.innerHTML = homeCrumb + currentCrumb;
  }
});
