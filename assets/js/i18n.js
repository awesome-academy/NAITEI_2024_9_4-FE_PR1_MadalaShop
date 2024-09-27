const translations = {
  en: "en.json",
  vi: "vi.json",
};
function changeLanguage(lang) {
  fetch(`../../assets/locales/${translations[lang]}`)
    .then((res) => res.json())
    .then((data) => {
      document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        const [section, subsection] = key.split(".");
        element.textContent = data[section][subsection];
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  changeLanguage("vi");
});
