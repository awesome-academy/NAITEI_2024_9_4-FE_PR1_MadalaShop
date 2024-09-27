function switchCSSLanguageButtons() {
  const languages = document.querySelectorAll(".lang");
  const activeLanguageClassList = [
    "px-3",
    "py-0.5",
    "bg-black",
    "text-white",
    "rounded",
    "border-solid",
    "border"
  ]
  languages.forEach((item) => {
    item.addEventListener("click", function () {
      languages.forEach((item) =>
        item.classList.remove(...activeLanguageClassList)
      );
      this.classList.add(...activeLanguageClassList);
    });
  });
}

export { switchCSSLanguageButtons };
