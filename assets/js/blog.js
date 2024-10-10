const gridBtns = document.querySelectorAll(".grid-btn");
const listBtns = document.querySelectorAll(".list-btn");
const gridView = document.querySelector("#grid-view");
const listView = document.querySelector("#list-view");

document.addEventListener('DOMContentLoaded', function() {
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => {
        hoverTooltip(content, 'blog.content');
    });
});

gridBtns.forEach((btn) => {
    btn.addEventListener('click', () => { 
        gridView.classList.remove("hidden");
        listView.classList.add("hidden");
        switchToGrid();
    });
});

listBtns.forEach((btn) => {
    listView.classList.remove("hidden");
    gridView.classList.add("hidden");
    btn.addEventListener('click', () => { 
        switchToList();
    });
});
