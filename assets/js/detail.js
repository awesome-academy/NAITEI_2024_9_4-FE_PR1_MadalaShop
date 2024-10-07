const tabs = document.querySelectorAll('[data-tab-target]');
const imageItems = document.querySelectorAll(".image-item");
const mainImage = document.querySelector(".main-image");
const arrowTop = document.getElementById('arrowTop');
const arrowDown = document.getElementById('arrowDown');
const activeClass = 'text-black';
let currentImage = 0;

const updateImage = (index) => {
  const src = `../../assets/images/ring-${index + 1}.png`;
  mainImage.setAttribute("src", src);

  imageItems.forEach((item, i) => {
    item.classList.toggle('border-red-600', i === index);
  });
};

arrowTop.addEventListener('click', () => {
  if (currentImage > 0) currentImage--;
  updateImage(currentImage);
});

arrowDown.addEventListener('click', () => {
  if (currentImage < imageItems.length - 1) currentImage++;
  updateImage(currentImage);
});

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const targetContent = document.querySelector(tab.dataset.tabTarget);
    document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
    targetContent.classList.remove('hidden');
    document.querySelectorAll('.text-black').forEach(activeTab => activeTab.classList.remove(activeClass));
    tab.classList.add(activeClass);
  });
});

imageItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    currentImage = index;
    updateImage(currentImage);
  });
});
