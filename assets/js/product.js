const categories = document.querySelectorAll('li.group');

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

categories.forEach(category => {
    category.addEventListener('click', () => {
        setActiveCategory(category);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const descriptions = document.querySelectorAll('.description');
    descriptions.forEach(description => {
        hoverTooltip(description, 'product.product_description');
    });
});
