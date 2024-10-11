const tabs = document.querySelectorAll('[data-tab-target]');
const arrowTop = document.getElementById('arrowTop');
const arrowDown = document.getElementById('arrowDown');
const sliderContainer = document.getElementById('sliderItem');
const mainImage = document.querySelector(".main-image");
const activeClass = 'text-black';
let imageItems;
let currentImage = 0;

const updateImage = (index, imageItems, mainImage) => {
	const src = imageItems[index].getAttribute("src");
	mainImage.setAttribute("src", src);
	imageItems.forEach((item, i) => {
		if (index == i)
			item.classList.add('border-red-600');
		else
			item.classList.remove('border-red-600');
	});
};

function updateSubImages(data) {
	sliderContainer.textContent = '';
	data.subImage.forEach((item, index) => {
		const html = `<img src='${item}' alt='${data.brand}' width='67px' height='67px'
                      class='border image-item ${index == 0 ? 'border-red-600' : ''} cursor-pointer transition-all'>`;
		sliderContainer.insertAdjacentHTML('beforeend', html);
	});

	imageItems = document.querySelectorAll('.image-item');

	imageItems.forEach((item, index) => {
		item.addEventListener('click', () => {
			currentImage = index;
			updateImage(currentImage, imageItems, mainImage);
		});
	});
}

function updateInfoDetail(data) {
	mainImage.setAttribute('src', data.image);
	mainImage.setAttribute('alt', data.brand);

	document.getElementById('productName').textContent = data.name;
	document.getElementById('productBrand').textContent = data.brand;
	document.getElementById('productPrice').textContent = data.price;
	document.getElementById('productOldPrice').textContent = data.oldPrice;
	document.getElementById('productDes').textContent = data.des;

	document.getElementById('color').textContent = '';
	data.color.forEach(item => {
		const html = `<option value='${item}'>${item}</option>`;
		document.getElementById('color').insertAdjacentHTML('beforeend', html);
	})

	document.getElementById('size').textContent = '';
	data.size.forEach(item => {
		const html = `<option value="${item}">${item}</option>`;
		document.getElementById('size').insertAdjacentHTML('beforeend', html);
	})

	document.getElementById('facebookShare').textContent = data.facebookShare <= 10 ? data.facebookShare : `10+`;
	document.getElementById('twitterShare').textContent = data.twitterShare <= 10 ? data.twitterShare : `10+`;
	document.getElementById('googleShare').textContent = data.googleShare <= 10 ? data.googleShare : `10+`;

}

function updateHighlightFeature(data) {
	const highlightFeatureContainer = document.getElementById('tab1');
	highlightFeatureContainer.textContent = '';
	data.highlightImage.forEach((item, i) => {
		let html = '';
		if (i % 2 == 0) {
			html = ` <div class="flex gap-20 flex-col-reverse md:flex-row md:justify-between md:items-center mt-12">
                  <div>
                    <div>
                      <h1 class="font-bold uppercase" data-i18n="detail.feature_title">${data.highlightTitle}</h1>
                      <hr class="w-16">
                    </div>
                    <p class="mt-5 text-sm text-gray-500" data-i18n="detail.feature_des">${data.highlightDes}</p>
                  </div>
                  <img src="${item}" alt="${data.name}">
                </div>`
		}
		else {
			html = `<div class="flex md:flex-row-reverse flex-col-reverse gap-14 items-center mt-12">
                  <div class="text-right">
                    <div class="flex flex-col items-end">
                      <h1 class="font-bold uppercase" data-i18n="detail.feature_title">${data.highlightTitle}</h1>
                      <hr class="w-16">
                    </div>
                    <p class="mt-5 text-sm text-gray-500" data-i18n="detail.feature_des">${data.highlightDes}</p>
                  </div>
                  <img src="${item}" alt="${data.name}">
                </div>`
		}
		highlightFeatureContainer.insertAdjacentHTML('beforeend', html);
	})
}

async function loadBestSellingProduct(language) {
	const bestSellingProduct = document.getElementById('product-best-selling');
	bestSellingProduct.textContent = '';
	for (let index = 1; index < 4; index++) {
		try {
			const data_product = await fetchData(`${language}_products/${index}`);

			const html = `
        <div class="flex mt-8 border-b border-dashed pb-6 ">
          <img src="${data_product.image}" alt="${data_product.name}" class="mr-4 w-[101px] h-[101px]">
          <div>
            <a href="../../src/pages/detail.html?id=${data_product.id}" class="mb-3 font-semibold hover:underline">${data_product.name}</a>
            <div class="flex items-center text-sm mb-3">
              <div class="mr-3">
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-heart"></i>
              </div>
              <span>( 5 )</span>
            </div>
            <div class="italic font-bold">${data_product.price}</div>
          </div>
        </div>`;

			bestSellingProduct.insertAdjacentHTML('beforeend', html);
		} catch (error) {
			console.error('Error loading product:', error);
		}
	}
}

async function loadFrequentlyPurchasedProducts(language) {
	const frequentlyPurchasedProducts = document.getElementById('product-frequently-purchased');
	frequentlyPurchasedProducts.textContent = '';

	for (let index = 4; index < 9; index++) {
		try {
			const data_product = await fetchData(`${language}_products/${index}`);
			const html = `
        <div class="flex mt-8 border-b border-dashed pb-6 ">
          <img src="${data_product.image}" alt="${data_product.name}" class="mr-4 w-[101px] h-[101px]">
          <div>
            <a href="../../src/pages/detail.html?id=${data_product.id}" class="mb-3 font-semibold hover:underline">${data_product.name}</a>
            <div class="flex items-center text-sm mb-3">
              <div class="mr-3">
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-heart"></i>
                <i class="fa-solid fa-heart"></i>
              </div>
              <span>( 5 )</span>
            </div>
            <div class="italic font-bold">${data_product.price}</div>
          </div>
        </div>`;
			frequentlyPurchasedProducts.insertAdjacentHTML('beforeend', html);
		} catch (error) {
			console.error('Error loading frequently purchased product:', error);
		}
	}
}

async function loadData() {
	let language = localStorage.getItem('language');
	const urlParams = new URLSearchParams(window.location.search);
	const detailItem = urlParams.get('id');
	const data = await fetchData(`${language}_products/${detailItem}`);

	if (!detailItem || !data || (Array.isArray(data) && data.length === 0)) {
		window.location.href = '../../src/pages/error.html';
		return;
	}

	updateSubImages(data);
	updateInfoDetail(data);
	updateHighlightFeature(data);
	loadBestSellingProduct(language);
	loadFrequentlyPurchasedProducts(language);
}

arrowTop.addEventListener('click', () => {
	if (currentImage > 0) currentImage--;
	updateImage(currentImage, imageItems, mainImage);
});

arrowDown.addEventListener('click', () => {
	if (currentImage < imageItems.length - 1) currentImage++;
	updateImage(currentImage, imageItems, mainImage);
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
