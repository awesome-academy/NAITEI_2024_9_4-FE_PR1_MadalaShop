const languages = document.querySelectorAll(".lang");
languages.forEach((item) => {
  item.addEventListener("click", function () {
    languages.forEach((item) =>
      item.classList.remove(
        "px-3",
        "py-0.5",
        "bg-black",
        "text-white",
        "rounded",
        "border-solid",
        "border"
      )
    );
    this.classList.add(
      "px-3",
      "py-0.5",
      "bg-black",
      "text-white",
      "rounded",
      "border-solid",
      "border"
    );
  });
});
