const validationSetUp = {
    email: {
        validator: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        errorMessageI18n: 'contact_us.error_email',
        idErrorElement: 'email-error'
    }
};
const successAlert = ['blog_detail.success_message', 'success']
const form = document.getElementById('email-form');

const activeClassSpanProductTypes = 'cursor-pointer hover:text-primary-color md:text-5xl text-3xl text-primary-color duration-200';
const baseClassSpanProductTypes = 'cursor-pointer hover:text-primary-color md:text-2xl text-lg hover:scale-105 duration-200';

const activeClassSpanCategories = 'cursor-pointer text-primary-color font-bold hover:text-primary-color scale-105 duration-200';
const baseClassSpanCategories = 'cursor-pointer hover:text-primary-color duration-200';

let activeProductIndices = [];
let isRotating = false;

function reloadHomeMessage() {
    const successAlert = document.getElementById('alert-message-success');
    const warningAlert = document.getElementById('alert-message-warning');
    const { errorMessageI18n, idErrorElement } = validationSetUp['email'];
    const errorElement = document.getElementById(idErrorElement);
    errorElement.textContent = t(errorMessageI18n);

    successAlert.textContent = t('contact_us.success_message');
    warningAlert.textContent = t('home.warning_rotate');
    document.getElementById('email').setAttribute('placeholder', t('home.email_placeholder'));
}

async function fetchProductTypes(lang) {
    const productTypes = await fetchData(`${lang}/product_types`);
    const idActive = 2;

    displayProductTypes(lang, productTypes, idActive);
    await fetchCategories(lang, idActive);
}

function displayProductTypes(lang, types, idActive) {
    let typeList = document.getElementById('product-types');
    typeList.innerHTML = '';

    types.slice(0, 3).forEach((type) => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const isActive = type.id === idActive;

        li.className = `${isActive ? 'sm:border-x-2' : ''} flex flex-col justify-end md:px-8 px-4`;
        span.className = `${isActive ? activeClassSpanProductTypes : baseClassSpanProductTypes}`;
        span.textContent = type.name;

        span.addEventListener('click', () => {
            changeActiveProductType(span);
            fetchCategories(lang, type.id);
        });

        li.appendChild(span);
        typeList.appendChild(li);
    });
}

function changeActiveProductType(activeSpan) {
    const spans = document.querySelectorAll('#product-types span');
    spans.forEach(span => {
        span.className = '';
        span.className = baseClassSpanProductTypes;
    });
    activeSpan.className = activeClassSpanProductTypes;
}

async function fetchCategories(lang, idProductTypeActive) {
    const products = await fetchData(`${lang}/products`);
    const productTypeProducts = await fetchData(`product_type_product`);
    const subCategories = await fetchData(`${lang}/sub_categories`);
    const categories = await fetchData(`${lang}/categories`);

    const relatedProducts = productTypeProducts
        .filter(ptp => ptp.product_type_id === idProductTypeActive)
        .map(ptp => products.find(product => product.id === ptp.product_id));
    const relatedSubCategories = subCategories.filter(sub =>
        relatedProducts.some(relatedProduct => relatedProduct.sub_category_id === sub.id)
    );
    const relatedCategories = categories.filter(category =>
        relatedSubCategories.some(relatedSubCategory => relatedSubCategory.category_id === category.id)
    );
    const idActive = 1;

    displayCategories(relatedCategories, relatedSubCategories, relatedProducts, idActive);
    filterProducts(relatedCategories, relatedSubCategories, relatedProducts, idActive);
}

function displayCategories(categories, subcategories, products, idCategoryActive) {
    let categoryList = document.getElementById('categories');
    categoryList.innerHTML = '';

    categories.forEach((category, index) => {
        const li = document.createElement('li');
        const span = document.createElement('span');

        li.className = 'sm:px-5';
        span.className = `${index === (idCategoryActive - 1) ? activeClassSpanCategories : baseClassSpanCategories}`;
        span.textContent = category.name;

        span.addEventListener('click', () => {
            changeActiveCategory(span);
            filterProducts(categories, subcategories, products, index + 1);
        });

        li.appendChild(span);
        categoryList.appendChild(li);

        if (index < categories.length - 1) {
            const separator = document.createElement('span');
            separator.className = 'sm:block hidden';
            separator.textContent = '.';
            categoryList.appendChild(separator);
        }
    });
}

function changeActiveCategory(activeSpan) {
    const spans = document.querySelectorAll('#categories li span');

    spans.forEach(span => {
        span.className = '';
        span.className = baseClassSpanCategories;
    });
    activeSpan.className = activeClassSpanCategories;
}

function filterProducts(categories, subcategories, products, idCategoryActive) {
    const relatedSubCategories = subcategories.filter(sub => sub.category_id === categories[idCategoryActive - 1].id);

    let allRelatedProducts = [];
    relatedSubCategories.forEach(subCategory => {
        const relatedProducts = products.filter(product => product.sub_category_id === subCategory.id);
        allRelatedProducts = allRelatedProducts.concat(relatedProducts);
    });

    displayProducts(allRelatedProducts, [0, 1]);
}

function displayProducts(products, idProductsActive) {
    let productContainer = document.getElementById('cards');

    activeProductIndices = [...idProductsActive];

    Array.from(productContainer.children).forEach((child) => {
        child.classList.remove('opacity-100');
        child.classList.add('opacity-0');
        setTimeout(() => {
            productContainer.innerHTML = '';
        }, 300);
    });

    setTimeout(() => {
        idProductsActive.forEach((id, index) => {
            const product = products[id];

            const card = document.createElement('div');
            if (index === 0) {
                card.className = 'card bg-white p-4 rounded-lg shadow-lg hover:scale-105 flex flex-col items-center opacity-0 transition-opacity duration-300';
            } else {
                card.className = 'card bg-white p-4 rounded-lg shadow-lg hover:scale-105 sm:flex flex-col items-center hidden opacity-0 transition-opacity duration-300';
            }

            card.innerHTML = createProductHTML(product);

            productContainer.appendChild(card);
            card.classList.remove('opacity-0');
            card.classList.add('opacity-100');

            card.querySelector('.rotate-btn').addEventListener('click', () => {
                rotateProduct(card, products, id, index);
            });

        });
    }, 300);
}

function createProductHTML(product) {
    return `
    <img src="${product.image}" alt="Sản phẩm" class="w-full h-4/5 object-cover mb-2 border-b">
    <p class="mb-1 font-bold text-gray-500">${product.brand}</p>
    <a href="../../src/pages/detail.html?id=${product.id}" class="mb-1 font-bold text-[18px] hover:underline">${product.name}</a>
    <p class="mb-2 text-primary-color font-bold italic text-lg">${product.price}</p>
    <div>
      <button class="border py-1 px-4 rounded-md hover:bg-primary-color hover:text-white duration-300" data-i18n="product.purchase">${t('product.purchase')}</button>
      <button class="bg-primary-color hover:bg-black text-white py-1 px-3 rounded-md duration-300"><i class="fa-solid fa-heart"></i></button>
      <button class="border py-1 px-3 rounded-md hover:bg-primary-color hover:text-white duration-300 rotate-btn"><i class="fa-solid fa-rotate"></i></button>
    </div>
  `;
}

function rotateProduct(cardElement, products, currentId, index) {
    if (isRotating) return;
    isRotating = true;

    let newProductId;
    const isMobile = window.innerWidth < 500;
    const countProducts = products.length;

    if (isMobile ? countProducts <= 1 : countProducts <= 2 && activeProductIndices[0] != activeProductIndices[1]) {
        showAlert(t('home.warning_rotate'), 'warning');
        isRotating = false;
        return;
    }

    do {
        newProductId = Math.floor(Math.random() * countProducts);
    } while (isMobile ? newProductId === currentId : activeProductIndices.includes(newProductId));

    activeProductIndices[index] = newProductId;
    const newProduct = products[newProductId];

    cardElement.classList.remove('opacity-100');
    cardElement.classList.add('opacity-0');

    setTimeout(() => {
        cardElement.innerHTML = createProductHTML(newProduct);

        cardElement.classList.remove('opacity-0');
        cardElement.classList.add('opacity-100');

        cardElement.querySelector('.rotate-btn').addEventListener('click', () => {
            rotateProduct(cardElement, products, newProductId, index);
        });

        isRotating = false;
    }, 300);
}

form.addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('email-error').classList.add('hidden');
    validateForm(validationSetUp, successAlert);
});

document.getElementById('email').addEventListener('input', function (event) {
    const inputElement = event.target;
    validateInput(inputElement, validationSetUp);
});

document.addEventListener('DOMContentLoaded', function () {
    const blog_content = document.querySelector('.blog_content');
    const about_us_content = document.querySelector('.about_us_content');

    hoverTooltip(blog_content, 'blog.content');
    hoverTooltip(about_us_content, 'about_us.content');
}); 
