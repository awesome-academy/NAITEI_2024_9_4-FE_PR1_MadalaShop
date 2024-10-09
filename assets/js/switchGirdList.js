function switchToGrid() {
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
    listBtns.forEach((btn) => {
        btn.classList.add("bg-primary-color", "text-white");
        btn.classList.remove("hover:bg-primary-color", "hover:text-white");
    });
    gridBtns.forEach((btn) => {
        btn.classList.remove("bg-primary-color", "text-white");
        btn.classList.add("hover:bg-primary-color", "hover:text-white");
    });
}
