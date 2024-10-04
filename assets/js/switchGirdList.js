const gridBtns = document.querySelectorAll(".grid-btn");
const listBtns = document.querySelectorAll(".list-btn");
const gridView = document.querySelector("#grid-view");
const listView = document.querySelector("#list-view");

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
