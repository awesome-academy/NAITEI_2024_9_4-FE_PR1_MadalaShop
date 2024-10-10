let currentItemsList = [];
let currentView = 'grid-view';
let isRotating = false;

function displayGridListContent(items, page, viewMode = 'grid-view', itemType = 'product') {
    const view = document.getElementById('view');
    const isGridView = viewMode === 'grid-view';

    const itemsPerPage = isGridView ? 6 : 3;
    const totalPages = Math.ceil(items.length / itemsPerPage);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentItems = items.slice(start, end);

    let viewclassName, cardClassName;
    if (itemType === 'product') {
        viewclassName = isGridView ? 'grid grid-cols-2 md:grid-cols-3 gap-4 gap-y-16' : 'space-y-2';
        cardClassName = `${isGridView ? 'text-center p-3' : 'flex sm:flex-row flex-col p-4'} rounded-md transition-shadow duration-300 hover:shadow-xl hover:scale-105 transition-opacity opacity-0`;
    }
    
    if (itemType === 'blog') {
        viewclassName = isGridView ? 'grid grid-cols-2 md:grid-cols-3 gap-4' : 'space-y-4';
        cardClassName = `${isGridView ? 'flex-col h-96 md:h-[430px]' : ''} flex border p-4 rounded-md hover:scale-105 hover:shadow-lg transition-shadow duration-300 transition-opacity opacity-0`;
    }

    currentItemsList = items;
    
    view.className = viewclassName;
    Array.from(view.children).forEach((child) => {
        child.classList.remove('opacity-100');
        child.classList.add('opacity-0');
    });
    setTimeout(() => {
      view.innerHTML = '';
    }, 300);

    setTimeout(() => {
        currentItems.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = cardClassName;

            if (itemType === 'product') {
                itemCard.innerHTML =  isGridView ? createGridViewProductHTML(item) : createListViewProductHTML(item);

                itemCard.querySelector('img').addEventListener('click', () => {
                    selectProduct(item);
                });

                itemCard.querySelector('.rotate-btn').addEventListener('click', () => {
                    rotateProduct(itemCard, currentItems, item.id, totalPages, page, viewMode);
                });
            }

            if (itemType === 'blog') {
                itemCard.innerHTML =  isGridView ? createGridViewBlogHTML(item) : createListViewBlogHTML(item);
            }

            view.appendChild(itemCard);

            itemCard.classList.remove('opacity-0');
            itemCard.classList.add('opacity-100');
        });
    }, 300);

    displayPagination(items, totalPages, page, viewMode, itemType);
}

function displayPagination(items, totalPages, currentPage, viewMode, itemType) {
    const paginationContainers = document.querySelectorAll('.pagination-container');
    
    paginationContainers.forEach(paginationContainer => {
        const leftArrow = document.createElement('i');
        const rightArrow = document.createElement('i');

        leftArrow.className = 'fa fa-angle-left hover:text-primary-color cursor-pointer';
        rightArrow.className = 'fa fa-angle-right hover:text-primary-color cursor-pointer';
        leftArrow.style.display = currentPage === 1 ? 'none' : 'flex';
        rightArrow.style.display = currentPage === totalPages ? 'none' : 'flex';
    
        leftArrow.addEventListener('click', () => {
            handlePageChange(items, currentPage - 1, totalPages, viewMode);
        });
        rightArrow.addEventListener('click', () => {
            handlePageChange(items, currentPage + 1, totalPages, viewMode);
        });

        paginationContainer.innerHTML = '';
        paginationContainer.style.display = totalPages <= 1 ? 'none' : 'flex';

        paginationContainer.appendChild(leftArrow);
        for (let i = 1; i <= totalPages; i++) {
            const pageItem = document.createElement('span');
            pageItem.className = `cursor-pointer font-bold ${i === currentPage ? 'text-primary-color' : 'hover:text-primary-color'}`
            pageItem.textContent = i;
            pageItem.addEventListener('click', () => {
                displayGridListContent(items, i, viewMode, itemType);
            });
            paginationContainer.appendChild(pageItem);
        }
        paginationContainer.appendChild(rightArrow);
    });
}

function handlePageChange(items, newPage, totalPages, viewMode) {
    if (newPage < 1 || newPage > totalPages) return;
    currentPage = newPage;
    displayGridListContent(items, currentPage, viewMode, itemType);
}

gridBtns.forEach((btn) => {
    btn.addEventListener('click', () => { 
        currentView = 'grid-view';
        switchToGrid();
        displayGridListContent(currentItemsList, 1, currentView, itemType)
    });
});

listBtns.forEach((btn) => {
    btn.addEventListener('click', () => { 
        currentView = 'list-view';
        switchToList();
        displayGridListContent(currentItemsList, 1, currentView, itemType)
    });
});
