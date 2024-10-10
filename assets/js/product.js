const gridBtns = document.querySelectorAll(".grid-btn");
const listBtns = document.querySelectorAll(".list-btn");
let currentProductsList = [];
let currentView = 'grid-view';
let isRotating = false;
let compareProducts = [null, null];

async function fetchProductPageData(lang) {
    const categories = await fetchData(`${lang}/categories`);
    const subCategories = await fetchData(`${lang}/sub_categories`);
    const products = await fetchData(`${lang}/products`);
    const idCategoryActive = 1;

    displayCategories(categories, subCategories, products, idCategoryActive);
}

function displayCategories(categories, subCategories, products, idCategoryActive) {
    const catalog = document.getElementById('catalog');
    const tags = document.getElementById('product_tags');
    catalog.innerHTML = '';
    tags.innerHTML = '';

    categories.forEach(category => {
        const categoryItem = document.createElement('li');
        const isActiveCategory = category.id === idCategoryActive;
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
        displaySubCategoryListAndTag(subCategoryList, tags, relatedsubCategories, relatedProducts);

        catalog.appendChild(categoryItem);

        if (isActiveCategory) {
            displayProducts(relatedProducts, 1, currentView);
        }

        categoryItem.addEventListener('click', () => {
            displayProducts(relatedProducts, 1, currentView);
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

function displaySubCategoryListAndTag(subCategoryList, tagsContainer, subCategories, relatedProducts) {
    const subCategoryItemClass = 'mt-2 hover:text-primary-color cursor-pointer';
    const subCategoryTagClass = 'bg-gray-200 text-sm px-2 py-1 rounded-md cursor-pointer hover:bg-primary-color hover:text-white';
    subCategories.forEach((subCategory, index) => {
        const subCategoryItem = document.createElement('li');
        const subCategoryTag = document.createElement('span');
        const moreRelatedProducts = relatedProducts.filter(relatedProduct => relatedProduct.sub_category_id === subCategory.id);

        subCategoryItem.className = subCategoryItemClass;
        subCategoryItem.textContent = subCategory.name;
        subCategoryList.appendChild(subCategoryItem);
        subCategoryItem.addEventListener('click', () => {
            displayProducts(moreRelatedProducts, 1, currentView);
        });
        
        if (index === 0) {
            subCategoryTag.className = subCategoryTagClass;
            subCategoryTag.textContent = subCategory.name;
            tagsContainer.appendChild(subCategoryTag);
    
            subCategoryTag.addEventListener('click', () => {
                displayProducts(moreRelatedProducts, 1, currentView);
            })
        }
    });
}

function displayProducts(products, page, viewMode = 'grid-view') {
    const view = document.getElementById('view');
    const isGridView = viewMode === 'grid-view';

    const itemsPerPage = isGridView ? 6 : 3;
    const totalPages = Math.ceil(products.length / itemsPerPage);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentProducts = products.slice(start, end);

    currentProductsList = products;

    view.className = isGridView ? 'grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-16' : 'space-y-2';
    Array.from(view.children).forEach((child) => {
        child.classList.remove('opacity-100');
        child.classList.add('opacity-0');
    });
    setTimeout(() => {
      view.innerHTML = '';
    }, 300);

    setTimeout(() => {
        currentProducts.forEach(product => {

            const productCard = document.createElement('div');
            productCard.className = `${isGridView ? 'text-center p-3' : 'flex sm:flex-row flex-col p-4 '} rounded-md transition-shadow duration-300 hover:shadow-xl hover:scale-105 transition-opacity opacity-0`;

            productCard.innerHTML =  isGridView ? createGridViewProductHTML(product) : createListViewProductHTML(product);
            view.appendChild(productCard);

            productCard.querySelector('.rotate-btn').addEventListener('click', () => {
                rotateProduct(productCard, currentProducts, product.id, totalPages, page, viewMode);
            });

            productCard.classList.remove('opacity-0');
            productCard.classList.add('opacity-100');
        });
    }, 300);

    displayPagination(products, totalPages, page, viewMode);
}

function createGridViewProductHTML(product) {
    return `
        <img src="${product.image}" alt="Sản phẩm" class="w-full mb-2 border-b">
        <p class="mb-1 font-bold text-gray-500">${product.brand}</p>
        <h3 class="mb-1 font-bold">${product.name}</h3>
        <p class="mb-2 text-primary-color font-bold italic text-lg">${product.price}</p>
        <div>
            <button class="border py-1 px-4 rounded-md hover:bg-primary-color hover:text-white duration-300" data-i18n="product.purchase">${t('product.purchase')}</button>
            <button class="bg-primary-color hover:bg-black text-white py-1 px-3 rounded-md duration-300"><i class="fa-solid fa-heart"></i></button>
            <button class="border py-1 px-3 rounded-md hover:bg-primary-color hover:text-white duration-300 rotate-btn"><i class="fa-solid fa-rotate"></i></button>
        </div>
    `;
}

function createListViewProductHTML(product) {
    return `
        <img src="${product.image}" alt="Sản phẩm" class="sm:w-1/3 w-full border-b">
        <div class="sm:w-2/3 w-full sm:pl-4 sm:mt-0 mt-4 text-lg flex flex-col justify-between mb-5">
            <h3 class="mb-1 text-xl">${product.name}</h3>
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
            <p class="mb-2 text-primary-color font-bold italic text-xl">${product.price}đ</p>
            <div>
                <button class="border py-1 px-4 rounded-md hover:bg-primary-color hover:text-white duration-300" data-i18n="product.purchase">${t('product.purchase')}</button>
                <button class="bg-primary-color hover:bg-black text-white py-1 px-3 rounded-md duration-300"><i class="fa-solid fa-heart"></i></button>
                <button class="border py-1 px-3 rounded-md hover:bg-primary-color hover:text-white duration-300 rotate-btn"><i class="fa-solid fa-rotate"></i></button>
            </div>
        </div>
    `;
}

function displayPagination(products, totalPages, currentPage, viewMode) {
    const paginationContainers = document.querySelectorAll('.pagination-container');
    
    paginationContainers.forEach(paginationContainer => {
        const leftArrow = document.createElement('i');
        const rightArrow = document.createElement('i');

        leftArrow.className = 'fa fa-angle-left hover:text-primary-color cursor-pointer';
        rightArrow.className = 'fa fa-angle-right hover:text-primary-color cursor-pointer';
        leftArrow.style.display = currentPage === 1 ? 'none' : 'flex';
        rightArrow.style.display = currentPage === totalPages ? 'none' : 'flex';
    
        leftArrow.addEventListener('click', () => {
            handlePageChange(products, currentPage - 1, totalPages, viewMode);
        });
        rightArrow.addEventListener('click', () => {
            handlePageChange(products, currentPage + 1, totalPages, viewMode);
        });

        paginationContainer.innerHTML = '';
        paginationContainer.style.display = totalPages <= 1 ? 'none' : 'flex';

        paginationContainer.appendChild(leftArrow);
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('span');
            pageItem.className = `cursor-pointer font-bold ${i === currentPage ? 'text-primary-color' : 'hover:text-primary-color'}`
            pageItem.textContent = i;
            pageItem.addEventListener('click', () => {
                displayProducts(products, i, viewMode);
            });
            paginationContainer.appendChild(pageItem);
        }
        paginationContainer.appendChild(rightArrow);
    });
}

function handlePageChange(products, newPage, totalPages, viewMode) {
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;
    displayProducts(products, currentPage, viewMode);
}

function rotateProduct(cardElement, currentProducts, currentId, totalPages, currentPage, viewMode) {
    if (isRotating) return;
    isRotating = true;
  
    let newProductId;
    const countProductsList= currentProductsList.length;
    const isGridView = viewMode === 'grid-view';
    const currentProductIds = currentProducts.map(product => product.id);
    const currentProductsListIds = currentProductsList.map(product => product.id);
  
    if (isGridView ? countProductsList <= 6 : countProductsList <= 3) {
      showAlert(t('home.warning_rotate'), 'warning');
      isRotating = false;
      return;
    }
  
    do {
      randomIndex = Math.floor(Math.random() * countProductsList);
      newProductId = currentProductsListIds[randomIndex];
    } while (currentProductIds.includes(newProductId));

    const newIndex = currentProductsList.findIndex(product => product.id === newProductId);
    const currentIndex = currentProductsList.findIndex(product => product.id === currentId);
    const newProduct = currentProductsList[newIndex];
    const indexToReplace = currentProducts.findIndex(product => product.id === currentId);

    [currentProductsList[currentIndex], currentProductsList[newIndex]] = [currentProductsList[newIndex], currentProductsList[currentIndex]]
    displayPagination(currentProductsList, totalPages, currentPage, viewMode);

    currentProducts[indexToReplace] = newProduct;

    cardElement.classList.remove('opacity-100');
    cardElement.classList.add('opacity-0');

    setTimeout(() => {
        cardElement.innerHTML =  isGridView ? createGridViewProductHTML(newProduct) : createListViewProductHTML(newProduct);

        cardElement.classList.remove('opacity-0');
        cardElement.classList.add('opacity-100');
            
        cardElement.querySelector('.rotate-btn').addEventListener('click', () => {
            rotateProduct(cardElement, currentProducts, newProductId, totalPages, currentPage, viewMode);
        });

        isRotating = false;
    }, 300);
  }

gridBtns.forEach((btn) => {
    btn.addEventListener('click', () => { 
        currentView = 'grid-view';
        switchToGrid();
        displayProducts(currentProductsList, 1, currentView)
    });
});

listBtns.forEach((btn) => {
    btn.addEventListener('click', () => { 
        currentView = 'list-view';
        switchToList();
        displayProducts(currentProductsList, 1, currentView)
    });
});

document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('mouseover', function(event) {
        if (event.target.classList.contains('description')) {
            hoverTooltip(event.target, 'product.product_description');
        }
    });
});
