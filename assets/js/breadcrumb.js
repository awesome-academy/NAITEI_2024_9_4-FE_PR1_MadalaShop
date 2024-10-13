const breadcrumbData = [
    { url: "../pages/index.html", data: "breadcrumb.home" },
    { url: "../pages/aboutUs.html", data: "breadcrumb.about_us" },
    { url: "../pages/cart.html", data: "breadcrumb.cart" },
    { url: "../pages/contact_us.html", data: "breadcrumb.contact" },
    { url: "../pages/account.html", data: "breadcrumb.account" },
    { url: "../pages/product.html", data: "breadcrumb.product" },
    { url: "../pages/blog.html", data: "breadcrumb.blog" },
    { url: "../pages/product_detail.html", data: "breadcrumb.product" },
    { url: "../pages/blog_detail.html", data: ["breadcrumb.blog", "breadcrumb.blog_detail"] },
    { url: "../pages/signIn.html", data: "breadcrumb.sign_in" },
    { url: "../pages/signUp.html", data: "breadcrumb.sign_up" },
];

let urlParams = new URLSearchParams(window.location.search);
let category = urlParams.get('category');
let item = urlParams.get('item');
let id = urlParams.get('id');
let tag = urlParams.get('tag');
const activeCurrentBreadcrumb = "text-primary-color";
const breadcrumbContainer = document.getElementById("breadcrumb");
const currentUrl = window.location.pathname;

async function addBreadcrumbItem(id, type, breadcrumbWrapper) {
    let language = localStorage.getItem('language');
    const data = type === "category" ? await fetchData(`${language}/categories/${id}`) : await fetchData(`${language}/sub_categories/${id}`);
    const href = type === "category" ? `./product.html?category=${category}` : `./product.html?category=${category}&item=${item}`;
    if (!id || !data) return;
    const html = `
    <li><i class="fa-solid fa-angle-right text-xs"></i></li>
    <li><a href="${href}" class="breadcrumb-item hover:underline hover:text-primary-color">${data.name}</a></li>
  `;
    breadcrumbWrapper.insertAdjacentHTML('beforeend', html);
}

async function loadBreadCrumb(language) {
    urlParams = new URLSearchParams(window.location.search);
    category = urlParams.get('category');
    item = urlParams.get('item');
    id = urlParams.get('id');
    tag = urlParams.get('tag');
    const existingWrapper = document.getElementById('breadcrumb-wrapper');
    if (existingWrapper) {
        existingWrapper.remove();
    }

    if (currentUrl.includes('product.html') && !currentUrl.includes('product_detail.html')) {
        const breadcrumbWrapper = document.createElement('div');
        breadcrumbWrapper.id = 'breadcrumb-wrapper';
        breadcrumbWrapper.classList.add(...breadcrumbContainer.classList);
        if (category) {
            await addBreadcrumbItem(category, "category", breadcrumbWrapper);
            if (item) {
                await addBreadcrumbItem(item, "item", breadcrumbWrapper);
            }
        }
        if (tag) {
            await addBreadcrumbItem(tag, "tag", breadcrumbWrapper);
        }
        
        if (breadcrumbWrapper.children.length > 0) {
            breadcrumbContainer.appendChild(breadcrumbWrapper);
        }
    }

    if (currentUrl.includes('product_detail.html')) {
        const products = await fetchData(`${language}/products/${id}`);
        const cateAndSubCate = await getCategoryAndSubCategory(products.sub_category_id, language);

        const breadcrumbWrapper = document.createElement('div');
        breadcrumbWrapper.id = 'breadcrumb-wrapper';
        breadcrumbWrapper.classList.add(...breadcrumbContainer.classList);

        await addBreadcrumbItem(cateAndSubCate.category_id, "category", breadcrumbWrapper);
        await addBreadcrumbItem(cateAndSubCate.sub_category_id, "item", breadcrumbWrapper);
        breadcrumbContainer.appendChild(breadcrumbWrapper);
    }

    const breadcrumbItems = document.querySelectorAll(".breadcrumb-item");
    breadcrumbItems.forEach(item => {
        item.classList.remove(activeCurrentBreadcrumb);
    });
    breadcrumbItems[breadcrumbItems.length - 1].classList.add(activeCurrentBreadcrumb);
}

breadcrumbData.forEach((item) => {
    if (currentUrl.includes(item.url.split("/")[2])) {
        const homeCrumb = `
        <li><a href="${breadcrumbData[0].url}" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${breadcrumbData[0].data}"></a></li>
        <li><i class="fa-solid fa-angle-right text-xs"></i></li>
      `;
        let currentCrumb = '';
        if (currentUrl.includes('product_detail.html')) {
            currentCrumb = `  
        <li><a href="../pages/product.html" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${item.data}"></a></li>
      `;
        }
        else if (currentUrl.includes('blog_detail.html')) {
            currentCrumb = `  
        <li><a href="../pages/blog.html" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${item.data[0]}"></a></li>
        <li><i class="fa-solid fa-angle-right text-xs"></i></li>
        <li><a href="../pages/blog_detail.html?id=${id}" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${item.data[1]}"></a></li>
      `;
        }
        else
            currentCrumb = `  
        <li><a href="${item.url}" class="breadcrumb-item hover:underline hover:text-primary-color" data-i18n="${item.data}"></a></li>
      `;

        breadcrumbContainer.innerHTML += homeCrumb + currentCrumb;
    }
});
