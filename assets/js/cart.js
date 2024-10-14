async function addToCart(productId) {
    const account = getAccount();
    if (!account) {
        window.location.href = '../../src/pages/signIn.html';
        return;
    }
    const language = localStorage.getItem('language');
    const product = await fetchData(`${language}_products/${productId}`);

    let allCarts = JSON.parse(localStorage.getItem('carts')) || {};

    let userCart = allCarts[account] || { cart: [] };
    const price = +parseCurrency(product.price);
    let existingProduct = userCart.cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice = existingProduct.quantity * price;
    } else {
        userCart.cart.push({
            id: product.id,
            quantity: 1,
            price: price,
            totalPrice: formatCurrency(price)
        });
        loadCartNumber();
    }

    allCarts[account] = userCart;
    localStorage.setItem('carts', JSON.stringify(allCarts));
    if (!existingProduct) {
        loadCartNumber();
    }
    showAlert(t('cart.success_message'), 'success');
}

async function loadCart(language) {
    const account = getAccount();
    if (!account) {
        window.location.href = '../../src/pages/signIn.html';
        return;
    }

    const allCarts = JSON.parse(localStorage.getItem('carts')) || {};
    const userCart = allCarts[account];

    const cartBody = document.querySelector('tbody');
    cartBody.innerHTML = '';
    document.getElementById('cart-container').innerHTML = '';

    if (userCart && userCart.cart.length > 0) {
        const products = await fetchData(`${language}/products/`);
        userCart.cart.forEach(item => {
            const data = products.find(product => product.id === item.id);

            const productHTML = `
                    <tr id='row-${item.id}' class="border-b odd:bg-white text-center hover:bg-gray-100 transition-all">
                        <td class="px-6 py-4 border border-gray-300 whitespace-nowrap text-sm font-medium text-gray-900">
                            <img src="${data.image}" alt="${data.name}" class="object-cover mx-auto w-[145px] h-[138px]" />
                        </td>
                        <td class="px-6 py-4 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            <a href="../pages/product_detail.html?id=${data.id}" class="hover:underline">
                            ${data.name}
                            </a>
                        </td>
                        <td class="px-6 py-4 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            ${data.price} 
                        </td>
                        <td class="px-6 py-4 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            <div class="flex justify-between items-center">
                                <button class="hover:bg-gray-300 transition-all rounded-sm px-2.5 border" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <div>
                                    <span class="text-xs tracking-tighter">x</span>
                                    <span id='quantity-${item.id}' class="-ml-1">${item.quantity}</span>
                                </div>
                                <button class="hover:bg-gray-300 transition-all rounded-sm px-2.5 border" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </td>
                        <td id='totalPrice-${item.id}' class="px-6 py-4 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            ${formatCurrency(item.totalPrice).replace('VND', 'đ')} 
                        </td>
                        <td class="px-6 py-4 border border-gray-300 whitespace-nowrap text-sm text-gray-500">
                            <div class="px-0 py-3 ">
                                <button onclick="removeFromCart(${item.id})">
                                    <i class="fa-solid fa-trash hover:text-red-500 cursor-pointer transition-all text-base"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `;
            cartBody.insertAdjacentHTML('beforeend', productHTML);

            const responsiveHTML = `
                <div id='row-responsive-${item.id}' class="cart-item cursor-pointer px-2.5 flex flex-col transition-all hover:border-gray-400 duration-200 rounded border border-transparent">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <img src="${data.image}" alt="${data.name}" class="object-cover w-20" />
                            <div class="flex flex-col justify-center">
                                <span class="mb-3 font-openSans">
                                    <a href="../pages/product_detail.html?id=${data.id}" class="hover:underline">
                                        ${data.name}
                                    </a>
                                </span>
                                <span class="text-xs text-gray-400 italic">
                                    ${data.price}
                                </span>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="w-24">
                                <div id="totalPrice-responsive-${item.id}">${formatCurrency(item.totalPrice).replace('VND', 'đ')}</div>
                                <div class="flex justify-between items-center">
                                    <button class="hover:bg-gray-100 transition-all rounded-sm px-2.5  border" onclick="updateQuantity(${item.id}, -1)">-</button>
                                    <div class="">
                                        <span class="text-xs tracking-tighter">x</span>
                                        <span id='quantity-responsive-${item.id}' class="-ml-1">${item.quantity}</span>
                                    </div>
                                    <button class="hover:bg-gray-100 transition-all rounded-sm px-2.5 border" onclick="updateQuantity(${item.id}, 1)">+</button>
                                </div>
                            </div>
                            <div class="ml-6 cursor-pointer px-3 py-3">
                                <button onclick="removeFromCart(${item.id})">
                                    <i class="fa-solid fa-trash hover:text-red-500 transition-all "></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`
            document.getElementById('cart-container').insertAdjacentHTML('beforeend', responsiveHTML);
        });
    } else {
        cartBody.innerHTML = `
                        <tr>
                        <td colspan="6" class="text-center text-gray-500 py-4">
                            ${t('cart.empty')}
                        </td>
                        </tr>
                        `;
        document.getElementById('cart-container').innerHTML = `
                        <div class="text-center text-gray-500 py-4">
                            ${t('cart.empty')}
                        </div>`;
    }
}

function updateQuantity(productId, change) {
    const account = getAccount();
    const allCarts = JSON.parse(localStorage.getItem('carts')) || {};
    const userCart = allCarts[account];

    if (userCart) {
        const item = userCart.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity < 1) {
                item.quantity = 1;
            } else {
                item.totalPrice = item.quantity * parseCurrency(item.price + '');
            }
            document.getElementById(`quantity-${productId}`).textContent = item.quantity;
            document.getElementById(`quantity-responsive-${productId}`).textContent = item.quantity;
            document.getElementById(`totalPrice-${productId}`).textContent = formatCurrency(item.totalPrice).replace('VND', 'đ');
            document.getElementById(`totalPrice-responsive-${productId}`).textContent = formatCurrency(item.totalPrice).replace('VND', 'đ');
            allCarts[account] = userCart;
            localStorage.setItem('carts', JSON.stringify(allCarts));
        }
    }
}

function removeFromCart(productId) {
    const account = getAccount();
    const allCarts = JSON.parse(localStorage.getItem('carts')) || {};
    const userCart = allCarts[account];

    if (userCart) {
        userCart.cart = userCart.cart.filter(item => item.id !== productId);

        allCarts[account] = userCart;
        localStorage.setItem('carts', JSON.stringify(allCarts));


        const row = document.getElementById(`row-${productId}`);
        if (row) {
            row.remove();
        }

        const responsiveRow = document.getElementById(`row-responsive-${productId}`);
        if (responsiveRow) {
            responsiveRow.remove();
        }

        if (userCart.cart.length === 0) {
            const cartBody = document.querySelector('tbody');
            const cartContainer = document.getElementById('cart-container');

            cartBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-gray-500 py-4">
                        ${t('cart.empty')}
                    </td>
                </tr>`;

            cartContainer.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    ${t('cart.empty')}
                </div>`;
        }
        loadCartNumber();
        showAlert(t('cart.success_remove_message'), 'success');
    }
}

function clearCart() {
    const language = localStorage.getItem('language');
    const account = getAccount();
    const allCarts = JSON.parse(localStorage.getItem('carts')) || {};
    if (allCarts[account].cart.length === 0)
        showAlert(t('cart.clear_empty_message'), 'warning');
    else {
        allCarts[account].cart = [];
        localStorage.setItem('carts', JSON.stringify(allCarts));
        loadCart(language);
        loadCartNumber();
        showAlert(t('cart.success_clear_message'), 'success');
    }
}

async function initPopUpContent() {
    const language = localStorage.getItem('language');
    const products = await fetchData(`${language}/products`);
    const account = getAccount();
    const allCarts = JSON.parse(localStorage.getItem('carts')) || {};
    const userCart = allCarts[account] ||  { cart: [] };

    if (!userCart.cart || userCart.cart.length === 0) {
        showAlert(t('cart.empty'), 'warning');
        return;
    }

    const productsHTML = userCart.cart.map(item => {
        const productData = products.find(product => product.id === item.id);
        console.log(`${item.totalPrice}`)
        if (productData) {
            return `
                <li>
                    <a href="../pages/product_detail.html?id=${productData.id}"><strong class="hover:text-primary-color italic">${productData.name}</strong></a> - 
                    ${t('account.quantity')}: ${item.quantity}, 
                    ${t('cart.productPrice')}: ${formatCurrency(item.totalPrice)}
                </li>
            `;
        } else {
            return `
                <li>
                    <span>${t('account.not_found')}</span>
                </li>
            `;
        }
    }).join('');

    const totalAmount = userCart.cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const modalContent = `
        <h2 class="text-xl font-bold mb-4">${t('breadcrumb.cart')}</h2>
        <ul class="mb-4 list-disc pl-5">
            ${productsHTML}
        </ul>
        <div class="mb-3"><strong>${t('account.total_amount')}: ${formatCurrency(totalAmount)}</strong></div>
        <form id="payment-form">
            <label class="block mb-2 font-bold">${t('cart.address')}</label>
            <input id="address" type="text" class="w-full border p-2 rounded-md mb-4" value="${getAddress()}">
            <span class="text-red-500 text-xs hidden mb-4" id="message-error"></span>
            <label for="prepaid" class="block mb-2 font-bold">${t('cart.prepaid_amount')}:</label>
            <select id="prepaid" name="prepaid" class="w-full p-2 border rounded-md mb-4" required>
                <option value="0">${formatCurrency(0)}</option>
                <option value="0.2">${formatCurrency(totalAmount*0.2)}</option>
                <option value="0.4">${formatCurrency(totalAmount*0.4)}</option>
                <option value="0.6">${formatCurrency(totalAmount*0.6)}</option>
                <option value="0.8">${formatCurrency(totalAmount*0.8)}</option>
                <option value="1">${formatCurrency(totalAmount)}</option>
            </select>

            <button type="submit" class="bg-primary-color text-white mt-4 w-full py-2 rounded-md hover:bg-black transition duration-300">
                ${t('cart.pay')}
            </button>
        </form>
    `;
    
    showModal(modalContent);

    const addressInput = document.getElementById('address');
    const paymentForm = document.getElementById('payment-form');

    addressInput.addEventListener('input', () => {
        const errorMessage = document.getElementById('message-error');
    
        if (addressInput.value.trim().length >= 5) {
            errorMessage.classList.add('hidden');
        }
    });
    paymentForm.onsubmit = handlePaymentSubmit;
}

function handlePaymentSubmit(event) {
    event.preventDefault();

    const prepaidPercentage = parseFloat(event.target.prepaid.value);
    const address = event.target.address.value;
    const errorMessage = document.getElementById('message-error');

    if (address.trim().length < 5) {
        errorMessage.textContent = t('cart.warning_address');
        errorMessage.classList.remove('hidden');
        
    } else {
        errorMessage.classList.add('hidden');
        setOrderHistory(prepaidPercentage, address);
        window.location.href = '../../src/pages/account.html';
    }
}

function setOrderHistory(prepaidPercentage, address) {
    const account = getAccount();
    let allCarts = JSON.parse(localStorage.getItem('carts')) || {};
    let userCart = allCarts[account] || { cart: [] };

    let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || {};
    let userOrders = orderHistory[account] || [];

    const nextOrderId = userOrders.length > 0 ? userOrders[userOrders.length - 1].orderId + 1 : 1001;
    const currentDate = new Date().toISOString();
    const totalAmount = userCart.cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const debt = totalAmount - prepaidPercentage * totalAmount;

    const newOrder = {
        orderId: nextOrderId,
        orderDate: currentDate,
        products: userCart.cart.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
        })),
        totalPrice: totalAmount,
        debt: debt,
        address: address,
    };

    userOrders.push(newOrder);
    orderHistory[account] = userOrders;
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

    delete allCarts[account];
    localStorage.setItem('carts', JSON.stringify(allCarts));
}

