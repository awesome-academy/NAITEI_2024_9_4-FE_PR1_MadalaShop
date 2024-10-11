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
  { url: "../pages/signIn.html", data: "breadcrumb.sign_in" },
  { url: "../pages/signUp.html", data: "breadcrumb.sign_up" },
];

const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
const item = urlParams.get('item');
const id = urlParams.get('id');
const activeCurrentBreadcrumb = "text-primary-color";
const breadcrumbContainer = document.getElementById("breadcrumb");
const currentUrl = window.location.pathname;

async function addBreadcrumbItem(id, type, breadcrumbWrapper) {
  let language = localStorage.getItem('language');
  const data = type === "category" ? await fetchData(`${language}_categories/${id}`) : await fetchData(`${language}_sub_categories/${id}`);
  const href = type === "category" ? `./product.html?category=${category}` : `./product.html?category=${category}&item=${item}`;
  if (!id || !data) return;
  const html = `
    <li><i class="fa-solid fa-angle-right text-xs"></i></li>
    <li><a href="${href}" class="breadcrumb-item hover:underline hover:text-primary-color">${data.name}</a></li>
  `;
  breadcrumbWrapper.insertAdjacentHTML('beforeend', html);
}

async function loadBreadCrumb() {
  const language = localStorage.getItem('language');
  const existingWrapper = document.getElementById('breadcrumb-wrapper');
  if (existingWrapper) {
    existingWrapper.remove();
  }
  if (id) {
    const product = await fetchData(`${language}_products/${id}`);
    const cateAndSubCate = await getCategoryAndSubCategory(product.sub_category_id, language);

    const breadcrumbWrapper = document.createElement('div');
    breadcrumbWrapper.id = 'breadcrumb-wrapper';
    breadcrumbWrapper.classList.add(...breadcrumbContainer.classList);

    await addBreadcrumbItem(cateAndSubCate.category_id, "category", breadcrumbWrapper);
    await addBreadcrumbItem(cateAndSubCate.sub_category_id, "item", breadcrumbWrapper);
    breadcrumbContainer.appendChild(breadcrumbWrapper);
  }

  const breadcrumbItems = document.querySelectorAll(".breadcrumb-item");
  breadcrumbItems[breadcrumbItems.length - 1].classList.add(activeCurrentBreadcrumb);
}

breadcrumbData.forEach((item) => {
  if (currentUrl.includes(item.url.split("/")[2])) {
    const homeCrumb = `
        <li><a href="${breadcrumbData[0].url}" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${breadcrumbData[0].data}"></a></li>
        <li><i class="fa-solid fa-angle-right text-xs"></i></li>
      `;
    const currentCrumb = `  
        <li><a href="${currentUrl.includes('detail.html') ? '../pages/product.html' : item.url}" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${item.data}"></a></li>
      `;
    breadcrumbContainer.innerHTML += homeCrumb + currentCrumb;
  }
});

loadBreadCrumb();
