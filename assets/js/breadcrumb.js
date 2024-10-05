const breadcrumbData = [
  { url: "../pages/index.html", data: "breadcrumb.home" },
  { url: "../pages/aboutUs.html", data: "breadcrumb.about_us" },
  { url: "../pages/cart.html", data: "breadcrumb.cart" },
  { url: "../pages/contact_us.html", data: "breadcrumb.contact" },
  { url: "../pages/account.html", data: "breadcrumb.account" },
  { url: "../pages/product.html", data: "breadcrumb.product" },
  { url: "../pages/blog.html", data: "breadcrumb.blog" },
  { url: "../pages/detail.html", data: "breadcrumb.product" },
  { url: "../pages/blog_detail.html", data: "breadcrumb.blog_detail" },
];
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
const item = urlParams.get('item');
const activeCurrentBreadcrumb = "text-primary-color";
const breadcrumbContainer = document.getElementById("breadcrumb");
const currentUrl = window.location.pathname;

breadcrumbData.forEach((item, index) => {
  if (currentUrl.includes(item.url.split("/")[2])) {
    const homeCrumb = `
      <li><a href="${breadcrumbData[0].url}" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${breadcrumbData[0].data}"></a></li>
      <li><i class="fa-solid fa-angle-right  text-xs"></i></li>
    `;
    const currentCrumb = `
      <li><a href="${item.url}" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${item.data}"></a></li>
    `;
    breadcrumbContainer.innerHTML = homeCrumb + currentCrumb;
  }
});

function addBreadcrumbItem(label, type) {
  const href = type === "category" ? `./product.html?category=${category}` : `./product.html?category=${category}&item=${item}`;
  const html = `
    <li><i class="fa-solid fa-angle-right text-xs"></i></li>
    <li><a href="${href}" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${type}.${label}">${label}</a></li>
  `;
  breadcrumbContainer.insertAdjacentHTML('beforeend', html);
}
if (category) addBreadcrumbItem(category, "category");
if (item) addBreadcrumbItem(item, "item");

const breadcrumbItems = document.querySelectorAll(".breadcrumb-item");
breadcrumbItems[breadcrumbItems.length - 1]?.classList.add(activeCurrentBreadcrumb);

