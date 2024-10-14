const noProductMessage = document.querySelector('#no-product-message');
let compareProducts = [null, null];
const itemType = 'product'

async function fetchProductPageData(lang) {
    const categories = await fetchData(`${lang}/categories`);
    const subCategories = await fetchData(`${lang}/sub_categories`);
    const products = await fetchData(`${lang}/products`);

    const params = new URLSearchParams(window.location.search);
    let idCategoryActive = params.get('category') || null;
    let idSubCategoryActive = params.get('item') || null;
    let idTagActive = params.get('tag') || null;

    const relatedSubCategoryTag = subCategories.find(item => item.id == idTagActive);
    const relatedSubCategory = subCategories.find(item => item.id == idSubCategoryActive);
    const relatedCategory = categories.find(item => item.id == idCategoryActive);

    if (relatedSubCategory) {
        idTagActive = null;
        idCategoryActive = relatedSubCategory.category_id;
        params.set('category', idCategoryActive);
        params.delete('tag');
    } else if (relatedCategory) {
        idTagActive = null;
        params.set('category', idCategoryActive);
        params.delete('item');
        params.delete('tag');
    } else if (relatedSubCategoryTag) {
        params.delete('category');
        params.delete('item');
    } else {
        idCategoryActive = 1;
        params.set('category', idCategoryActive);
        params.delete('tag');
        params.delete('item');
    }
    window.history.replaceState(null, '', window.location.pathname + '?' + params.toString());
    loadBreadCrumb(lang);

    displayCategories(categories, subCategories, products, idCategoryActive, idSubCategoryActive, idTagActive, params, lang);
}

function displayCategories(categories, subCategories, products, idCategoryActive, idSubCategoryActive, idTagActive, params, lang) {
    const catalog = document.getElementById('catalog');
    const tags = document.getElementById('product_tags');
    catalog.innerHTML = '';
    tags.innerHTML = '';

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        const isActiveCategory = category.id == idCategoryActive;
        const relatedsubCategories = subCategories.filter(subCategory => subCategory.category_id === category.id);
        const relatedProducts = products.filter(product =>
            relatedsubCategories.some(relatedsubCategorie => relatedsubCategorie.id === product.sub_category_id)
        );

        categoryItem.className = 'group';
        categoryItem.innerHTML = `
            <div class="flex justify-between cursor-pointer border-b pb-2 group-hover:text-primary-color ${isActiveCategory ? 'text-primary-color' : ''}">
                <span class="categories">${category.name}</span> 
                <i class="fa fa-angle-right group-hover:rotate-90 ${isActiveCategory ? 'rotate-90' : ''}"></i>
            </div>
            <ul class="sub-categories max-h-0 overflow-hidden transition-all duration-300 group-hover:max-h-40 list-disc pl-7 ${isActiveCategory ? 'max-h-40' : ''}"></ul>
        `;
        const subCategoryList = categoryItem.querySelector('.sub-categories');
        displaySubCategoryListAndTag(subCategoryList, tags, relatedsubCategories, relatedProducts, idSubCategoryActive, idTagActive, categories, params, lang);

        catalog.appendChild(categoryItem);

        if (isActiveCategory && !idSubCategoryActive) {;
            displayGridListContent(relatedProducts, 1, currentView, itemType);
        }

        categoryItem.addEventListener('click', () => {
            params.delete('tag');
            params.delete('item');
            params.set('category', category.id);
            window.history.replaceState(null, '', window.location.pathname + '?' + params.toString())
            loadBreadCrumb(lang);
            displayGridListContent(relatedProducts, 1, currentView, itemType);
        });
    });

    initCategoryToggle(catalog, tags);
}

function initCategoryToggle(catalog, tags) {
    const categoryElements = Array.from(catalog.children);
    const subCategoryElements = catalog.querySelectorAll('.sub-categories li');;
    const tagElements = Array.from(tags.children);

    categoryElements.forEach(categoryElement => {
        categoryElement.addEventListener('click', () => {
            toggleActiveCategory(categoryElement, categoryElements, tagElements);
        });
    });

    subCategoryElements.forEach(subCategoryElement => {
        subCategoryElement.addEventListener('click', () => {
            toggleActiveCategory(subCategoryElement.parentNode.parentNode, categoryElements, tagElements);
            toggleActiveSubCategory(subCategoryElement, subCategoryElements, tagElements);
            event.stopPropagation();
        });
    });

    tagElements.forEach(tagCategoryElement => {
        tagCategoryElement.addEventListener('click', () => {
            toggleActiveSubCategoryTag(tagCategoryElement, tagElements, subCategoryElements, categoryElements);
        });
    });
}

function toggleActiveCategory(selectedCategory, categories, tags) {
    categories.forEach(category => {
        const title = category.querySelector('div');
        const isActive = category === selectedCategory;
        const icon = category.querySelector('i');
        const sublist = category.querySelector('ul');
        const items = category.querySelectorAll('ul li');

        title.classList.toggle('text-primary-color', isActive);
        icon.classList.toggle('rotate-90', isActive);
        sublist.classList.toggle('max-h-40', isActive);

        items.forEach(item => {
            item.classList.remove('text-primary-color');
        });

        tags.forEach(item => {
            item.classList.remove('bg-primary-color');
            item.classList.remove('text-white');
        });
    });
}

function toggleActiveSubCategory(selectedSubCategory, subCategories, tags) {
    subCategories.forEach(subCategory => {
        const isActive = subCategory === selectedSubCategory;
        subCategory.classList.toggle('text-primary-color', isActive);

        tags.forEach(item => {
            item.classList.remove('bg-primary-color');
            item.classList.remove('text-white');
        });
    });
}

function toggleActiveSubCategoryTag(selectedSubCategoryTag, tagElements, subCategoryElements, categoryElements) {
    tagElements.forEach(tagElement => {
        const isActive = tagElement === selectedSubCategoryTag;
        tagElement.classList.toggle('bg-primary-color', isActive);
        tagElement.classList.toggle('text-white', isActive);

        subCategoryElements.forEach(item => {
            item.classList.remove('text-primary-color');
        });

        categoryElements.forEach(item => {
            item.querySelector('div').classList.remove('text-primary-color');
            item.querySelector('i').classList.remove('rotate-90');
            item.querySelector('ul').classList.remove('max-h-40');
        });
    });
}

function displaySubCategoryListAndTag(subCategoryList, tagsContainer, subCategories, relatedProducts, idSubCategoryActive, idTagActive, categories,  params, lang) {
    const subCategoryItemClass = 'mt-2 hover:text-primary-color cursor-pointer';
    const subCategoryTagClass = 'bg-gray-200 text-sm px-2 py-1 rounded-md cursor-pointer hover:bg-primary-color hover:text-white';
    const subCategoryElements = [];
    let urlSubCategoryItem = null;
    let urlSubCategoryTag = null;

    subCategories.forEach((subCategory, index) => {
        const subCategoryItem = document.createElement('li');
        const subCategoryTag = document.createElement('span');
        const moreRelatedProducts = relatedProducts.filter(relatedProduct => relatedProduct.sub_category_id === subCategory.id);

        subCategoryItem.className = subCategoryItemClass;
        subCategoryItem.textContent = subCategory.name;
        subCategoryList.appendChild(subCategoryItem);
        subCategoryElements.push(subCategoryItem);

        if (subCategory.id == idSubCategoryActive) {
            urlSubCategoryItem = subCategoryItem;
            displayGridListContent(moreRelatedProducts, 1, currentView, itemType);
        }

        subCategoryItem.addEventListener('click', () => {
            const relatedCategory = categories.find(category => category.id === subCategory.category_id);

            params.delete('tag');
            params.set('item', subCategory.id);
            params.set('category', relatedCategory.id);
            window.history.replaceState(null, '', window.location.pathname + '?' + params.toString())
            loadBreadCrumb(lang);
            displayGridListContent(moreRelatedProducts, 1, currentView, itemType);
        });

        if (index === 0) {
            subCategoryTag.className = subCategoryTagClass;
            subCategoryTag.textContent = subCategory.name;
            tagsContainer.appendChild(subCategoryTag);

            if (subCategory.id == idTagActive) {
                urlSubCategoryTag = subCategoryTag;
                displayGridListContent(moreRelatedProducts, 1, currentView, itemType);
            }

            subCategoryTag.addEventListener('click', () => {
                params.delete('item');
                params.delete('category');
                params.set('tag', subCategory.id);
                window.history.replaceState(null, '', window.location.pathname + '?' + params.toString())
                loadBreadCrumb(lang);
                displayGridListContent(moreRelatedProducts, 1, currentView, itemType);
            })
        }
    });
    const catalog = document.getElementById('catalog');
    const categoryElements = Array.from(catalog.children);
    const tagElements = Array.from(tagsContainer.children);

    if (urlSubCategoryItem) {
        toggleActiveCategory(urlSubCategoryItem.parentNode.parentNode, categoryElements, tagElements);
        toggleActiveSubCategory(urlSubCategoryItem, subCategoryElements, tagElements);
    }

    if (urlSubCategoryTag) {
        toggleActiveSubCategoryTag(urlSubCategoryTag, tagElements, subCategoryElements, categoryElements);
    }
}

function createGridViewProductHTML(product) {
    return `
        <img src="${product.image}" alt="Sản phẩm" class="object-contain md:h-80 h-48 w-auto mb-2 border-b">
        <p class="mb-1 font-bold text-gray-500">${product.brand}</p>
                <a class="mb-1 font-bold text-[18px] hover:underline" href="../../src/pages/product_detail.html?id=${product.id}">${product.name}</a>
        <p class="mb-2 text-primary-color font-bold italic text-lg">${product.price}</p>
        <div>
            <button class="border py-1 px-4 rounded-md hover:bg-primary-color hover:text-white duration-300" data-i18n="product.purchase" onclick='addToCart(${product.id})'>${t('product.purchase')}</button>
            <button class="bg-primary-color hover:bg-black text-white py-1 px-3 rounded-md duration-300"><i class="fa-solid fa-heart"></i></button>
            <button class="border py-1 px-3 rounded-md hover:bg-primary-color hover:text-white duration-300 rotate-btn"><i class="fa-solid fa-rotate"></i></button>
        </div>
    `;
}

function createListViewProductHTML(product) {
    return `
        <img src="${product.image}" alt="Sản phẩm" class="sm:w-1/3 w-full border-b">
        <div class="sm:w-2/3 w-full sm:pl-4 sm:mt-0 mt-4 text-lg flex flex-col justify-between mb-5">
            <a class="mb-1 font-bold text-xl hover:underline" href="../../src/pages/product_detail.html?id=${product.id}">${product.name}</a>
            <div class="text-base mb-4 flex">
                <div class="heart-icons space-x-1">
                    <i class="fa-solid fa-heart transition-colors duration-300"></i>
                    <i class="fa-solid fa-heart transition-colors duration-300"></i>
                    <i class="fa-solid fa-heart transition-colors duration-300"></i>
                    <i class="fa-solid fa-heart transition-colors duration-300"></i>
                    <i class="fa-solid fa-heart transition-colors duration-300"></i>
                </div>
                <span class="ml-2 text-gray-400">(${product.purchases} <span data-i18n="product.purchases">${t('product.purchases')}</span>)</span>
            </div>
            <div class="text-sm text-gray-400 mb-4 description">${product.description}</div>
            <p class="mb-2 text-primary-color font-bold italic text-xl">${product.price}</p>
            <div>
                <button onclick='addToCart(${product.id})' class="border py-1 px-4 rounded-md hover:bg-primary-color hover:text-white duration-300" data-i18n="product.purchase">${t('product.purchase')}</button>
                <button class="bg-primary-color hover:bg-black text-white py-1 px-3 rounded-md duration-300"><i class="fa-solid fa-heart"></i></button>
                <button class="border py-1 px-3 rounded-md hover:bg-primary-color hover:text-white duration-300 rotate-btn"><i class="fa-solid fa-rotate"></i></button>
            </div>
        </div>
    `;
}

function rotateProduct(cardElement, currentProducts, currentId, totalPages, currentPage, viewMode) {
    if (isRotating) return;
    isRotating = true;

    let newProductId;
    const countProductsList = currentItemsList.length;
    const isGridView = viewMode === 'grid-view';
    const currentProductIds = currentProducts.map(product => product.id);
    const currentProductsListIds = currentItemsList.map(product => product.id);

    if (isGridView ? countProductsList <= 6 : countProductsList <= 3) {
        showAlert(t('home.warning_rotate'), 'warning');
        isRotating = false;
        return;
    }

    do {
        randomIndex = Math.floor(Math.random() * countProductsList);
        newProductId = currentProductsListIds[randomIndex];
    } while (currentProductIds.includes(newProductId));

    const newIndex = currentItemsList.findIndex(product => product.id === newProductId);
    const currentIndex = currentItemsList.findIndex(product => product.id === currentId);
    const newProduct = currentItemsList[newIndex];
    const indexToReplace = currentProducts.findIndex(product => product.id === currentId);

    [currentItemsList[currentIndex], currentItemsList[newIndex]] = [currentItemsList[newIndex], currentItemsList[currentIndex]]
    displayPagination(currentItemsList, totalPages, currentPage, viewMode);

    currentProducts[indexToReplace] = newProduct;

    cardElement.classList.remove('opacity-100');
    cardElement.classList.add('opacity-0');

    setTimeout(() => {
        cardElement.innerHTML = isGridView ? createGridViewProductHTML(newProduct) : createListViewProductHTML(newProduct);

        cardElement.querySelector('img').addEventListener('click', () => {
            selectProduct(newProduct);
        });

        cardElement.classList.remove('opacity-0');
        cardElement.classList.add('opacity-100');

        cardElement.querySelector('.rotate-btn').addEventListener('click', () => {
            rotateProduct(cardElement, currentProducts, newProductId, totalPages, currentPage, viewMode);
        });

        isRotating = false;
    }, 300);
}

function selectProduct(product) {
    if (!compareProducts[0]) {
        compareProducts[0] = product;
        displaySelectedProduct(product, 1);
    } else if (!compareProducts[1]) {
        compareProducts[1] = product;
        displaySelectedProduct(product, 2);
    }

    if (compareProducts[0] && compareProducts[1]) {
        noProductMessage.classList.add('hidden');
    }
}

function displaySelectedProduct(product, slot) {
    const productSlot = document.querySelector(`#product${slot}`);
    productSlot.classList.remove('hidden');
    document.querySelector(`#product${slot}-img`).src = product.image;
    document.querySelector(`#product${slot}-name`).innerText = product.name;
    document.querySelector(`#product${slot}-price`).innerText = product.price;
}

function loadPopupData(productSlot) {
    document.querySelector(`#popup-product${productSlot}-img`).src = compareProducts[productSlot - 1].image;
    document.querySelector(`#popup-product${productSlot}-name`).innerText = compareProducts[productSlot - 1].name;
    document.querySelector(`#popup-product${productSlot}-price`).innerText = compareProducts[productSlot - 1].price;
    document.querySelector(`#popup-product${productSlot}-purchases`).innerText = compareProducts[productSlot - 1].purchases;
}

document.addEventListener('DOMContentLoaded', function () {
    document.body.addEventListener('mouseover', function (event) {
        if (event.target.classList.contains('description')) {
            hoverTooltip(event.target, 'product.product_description');
        }
    });
});

document.querySelectorAll('.remove-product').forEach(button => {
    button.addEventListener('click', (event) => {
        const productSlot = event.target.getAttribute('data-product');
        compareProducts[productSlot - 1] = null;
        document.querySelector(`#product${productSlot}`).classList.add('hidden');

        if (!compareProducts[0] || !compareProducts[1]) {
            noProductMessage.classList.remove('hidden');
        }
    });
});

document.querySelector('#compare-btn').addEventListener('click', () => {
    if (compareProducts[0] && compareProducts[1]) {
        const modalContent = `
            <h3 class="md:text-lg text-base font-bold" data-i18n="product.compare">${t('product.compare')}</h3>
            <div class="grid grid-cols-2 gap-5">
                <div id="popup-product1">
                    <img id="popup-product1-img" src="" alt="Sản phẩm"
                        class="object-contain md:h-96 h-48 w-auto">
                    <h4 id="popup-product1-name" class="font-bold md:text-lg text-base"></h4>
                    <p id="popup-product1-price" class="text-primary-color font-bold"></p>
                    <p class="font-bold">
                        <span id="popup-product2-purchases"></span>
                        <span data-i18n="product.purchases">${t('product.purchases')}</span>
                    </p>
                </div>
                <div id="popup-product2">
                    <img id="popup-product2-img" src="" alt="Sản phẩm"
                        class="object-contain md:h-96 h-48 w-auto">
                    <h4 id="popup-product2-name" class="font-bold md:text-lg text-base"></h4>
                    <p id="popup-product2-price" class="text-primary-color font-bold"></p>
                    <p class="font-bold">
                        <span id="popup-product1-purchases"></span>
                        <span data-i18n="product.purchases">${t('product.purchases')}</span>
                    </p>
                </div>
            </div>
        `;

        showModal(modalContent);
        updateMaxWidthModal('max-w-3xl');
        
        loadPopupData(1);
        loadPopupData(2);
    }
});
