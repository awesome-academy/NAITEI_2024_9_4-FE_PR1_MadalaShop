const categories = document.querySelectorAll('li.group');
const gridBtns = document.querySelectorAll(".grid-btn");
const listBtns = document.querySelectorAll(".list-btn");
const gridView = document.querySelector("#grid-view");
const listView = document.querySelector("#list-view");

categories.forEach(category => {
    category.addEventListener('click', () => {
        setActiveCategory(category);
    });
});

function setActiveCategory(selectedCategory) {
    categories.forEach(category => {
        const title = category.querySelector('div');
        const isActive = category === selectedCategory;
        const icon = category.querySelector('i');
        const sublist = category.querySelector('ul');
        
        title.classList.toggle('text-primary-color', isActive);
        title.classList.toggle('group-hover:text-primary-color', !isActive);
        icon.classList.toggle('rotate-90', isActive);
        sublist.classList.toggle('max-h-40', isActive);
    });
}

function switchToGrid() {
    gridView.classList.remove("hidden");
    listView.classList.add("hidden");

    gridBtns.forEach((btn) => {
        btn.classList.add("bg-primary-color", "text-white");
        btn.classList.remove("hover:bg-primary-color", "hover:text-white");
    });
    listBtns.forEach((btn) => {
        btn.classList.remove("bg-primary-color", "text-white");
        btn.classList.add("hover:bg-primary-color", "hover:text-white");
    });
}

function switchToList() {
    listView.classList.remove("hidden");
    gridView.classList.add("hidden");

    listBtns.forEach((btn) => {
        btn.classList.add("bg-primary-color", "text-white");
        btn.classList.remove("hover:bg-primary-color", "hover:text-white");
    });
    gridBtns.forEach((btn) => {
        btn.classList.remove("bg-primary-color", "text-white");
        btn.classList.add("hover:bg-primary-color", "hover:text-white");
    });
}

gridBtns.forEach((btn) => {
    btn.addEventListener("click", switchToGrid);
});

listBtns.forEach((btn) => {
    btn.addEventListener("click", switchToList);
});

document.addEventListener('DOMContentLoaded', function() {
    const descriptions = document.querySelectorAll('.description');
    descriptions.forEach(description => {
        description.addEventListener('mouseover', function(event) {
            showTooltip(event, t('product.product_description'));
        });
        description.addEventListener('mouseout', hideTooltip);
    });
});
