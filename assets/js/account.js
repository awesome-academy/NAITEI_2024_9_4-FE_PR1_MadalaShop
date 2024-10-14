async function loadOrderHistory(language) {
    const account = getAccount();
    if (!account) {
        window.location.href = '../../src/pages/signIn.html';
        return;
    }
    const allOrders = JSON.parse(localStorage.getItem('orderHistory')) || {};
    const userOrders = allOrders[account] || [];
    const orderHistoryBody = document.querySelector('tbody');
    const orderHistoryMobile = document.getElementById('mobile-cards');
    
    orderHistoryBody.innerHTML = '';
    orderHistoryMobile.innerHTML = '';
    if (userOrders && userOrders.length > 0) {
        const products = await fetchData(`${language}/products`)
        for (const order of userOrders) {
            const productsHTML = order.products.map(product => {
                const productData = products.find(p => p.id === product.id);
    
                if (productData) {
                    return `
                        <li>
                            <a href="../pages/product_detail.html?id=${productData.id}">${productData.name}</a>
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

            const orderHTML = `
                <tr class="border-b hover:bg-gray-100 transition duration-300">
                    <td class="py-2 px-4">#${order.orderId}</td>
                    <td class="py-2 px-4">${new Date(order.orderDate).toLocaleDateString()}</td>
                    <td class="py-2 px-4">
                        <ul class="list-disc pl-4">
                            ${productsHTML}
                        </ul>
                    </td>
                    <td class="py-2 px-4">${formatCurrency(order.totalPrice)}</td>
                    <td class="py-2 px-4">${formatCurrency(order.debt)}</td>
                    <td class="py-2 px-4">
                        <span class=" px-2 py-1 rounded 
                        ${order.debt === 0 ? 
                            `bg-green-100 text-green-700">${t('account.completed')}`: 
                            `bg-red-100 text-red-700">${t('account.pending')}`}
                        </span>
                    </td>
                </tr>
            `;

            const orderMobileHTML = `
                <div class="p-4 bg-gray-100 hover:shadow-md rounded-lg border border-gray-300">
                    <div class="flex justify-between">
                        <div><strong  data-i18n="account.order_id">${t('account.order_id')}</strong>: #${order.orderId}</div>
                        <div class="text-gray-400">${new Date(order.orderDate).toLocaleDateString()}</div>
                    </div>
                    <div><strong data-i18n="account.total_amount">${t('account.total_amount')}</strong>: ${formatCurrency(order.totalPrice)}</div>
                    <div><strong data-i18n="account.remaining_debt">${t('account.remaining_debt')}</strong>: ${formatCurrency(order.debt)}</div>
                    <div>
                        <strong data-i18n="account.status">${t('account.status')}</strong>:
                        <span class="px-2 py-1 rounded 
                        ${order.debt === 0 ? 
                            `bg-green-100 text-green-700">${t('account.completed')}`: 
                            `bg-red-100 text-red-700">${t('account.pending')}`}
                        </span>
                    </div>
                </div>
            `;
            orderHistoryBody.insertAdjacentHTML('afterbegin', orderHTML);
            orderHistoryMobile.insertAdjacentHTML('afterbegin', orderMobileHTML);

            const currentOrder = orderHistoryBody.firstElementChild;
            const currentOrderMobile = orderHistoryMobile.firstElementChild;

            const modalContent = `
                <h2 class="text-xl font-bold mb-4">${t('account.order_detail')} #${order.orderId}</h2>
                <p><strong>${t('account.purchase_date')}:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
                <p><strong>Địa chỉ:</strong> ${order.address}</p>
                <p><strong>${t('account.total_amount')}:</strong> ${formatCurrency(order.totalPrice)}</p>
                <p><strong>${t('account.remaining_debt')}:</strong> ${formatCurrency(order.debt)}</p>
                <p><strong>${t('account.status')}:</strong> ${order.debt === 0 ? t('account.completed') : t('account.pending')}</p>
                <h3 class="text-lg mt-4">${t('account.product')}:</h3>
                <ul class="list-disc pl-4">
                    ${order.products.map(product => {
                        const productData = products.find(p => p.id === product.id);
                        return productData 
                            ? `<li><a href="../pages/product_detail.html?id=${productData.id}" class="hover:text-primary-color italic font-bold">${productData.name}<a>, 
                                ${t('account.quantity')}: ${product.quantity}, 
                                ${t('cart.productPrice')}: ${formatCurrency(product.price)}</li>` 
                            : `<li><span>${t('account.not_found')}</span></li>`;
                    }).join('')}
                </ul>
                ${order.debt === 0 ? `
                    <button class="mt-4 bg-red-500 text-white px-4 py-2 rounded" onclick="deleteOrder(${order.orderId});">
                        ${t('account.delete_order')}
                    </button>
                    ` : `
                    <h4 class="mt-4 font-bold">${t('account.continue_payment')}</h4>
                    <form id="payment-form-${order.orderId}">
                        <select id="payment-amount-${order.orderId}" class="w-full p-2 border rounded-md mb-4" required>
                            <option value="0">0</option>
                            <option value="0.2">${formatCurrency(order.debt*0.2)}</option>
                            <option value="0.4">${formatCurrency(order.debt*0.4)}</option>
                            <option value="0.6">${formatCurrency(order.debt*0.6)}</option>
                            <option value="0.8">${formatCurrency(order.debt*0.8)}</option>
                            <option value="1">${formatCurrency(order.debt)}</option>
                        </select>
                        <button type="submit" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded" onclick="continuePayment(${order.orderId}, ${order.debt});">
                            ${t('account.confirm_payment')}
                        </button>
                    </form>
                `}
            `;

            currentOrder.addEventListener('click', () => showModal(modalContent));
            currentOrderMobile.addEventListener('click', () => showModal(modalContent));
        }
    } else {
        document.getElementById('order-history-container').innerHTML = `
            <div class="text-center text-gray-500 text-3xl py-4 hover:text-primary-color">
                <a data-i18n='account.empty' href='./product.html'>${t('account.empty')}</a> 
            </div>
        `;
    }
}

function deleteOrder(orderId) {
    if (confirm(t('account.comfirm_delete'))) {
        const language = localStorage.getItem('language');
        const account = getAccount();
        const allOrders = JSON.parse(localStorage.getItem('orderHistory')) || {};
        
        allOrders[account] = allOrders[account].filter(order => order.orderId !== orderId);
        localStorage.setItem('orderHistory', JSON.stringify(allOrders));

        showAlert(t('account.delete_success'),'success');
        closeModal();
        loadOrderHistory(language);
    }
}

function continuePayment(orderId) {
    event.preventDefault()
    const inputField = document.getElementById(`payment-amount-${orderId}`);
    const prepaidPercentage = inputField.value

    const language = localStorage.getItem('language');
    const account = getAccount();
    const allOrders = JSON.parse(localStorage.getItem('orderHistory')) || {};
    const order = allOrders[account].find(order => order.orderId === orderId);
    const paymentAmount = order.debt * prepaidPercentage
    order.debt -= order.debt * prepaidPercentage;
    localStorage.setItem('orderHistory', JSON.stringify(allOrders));

    showAlert(`${t('account.payment_successful')} ${formatCurrency(paymentAmount)}`,'success');
    closeModal();
    loadOrderHistory(language);
}

function loadUserInfo() {
    const info = getInfo();
    console.log(info)
    const username = document.getElementById('username');
    const useremail = document.getElementById('useremail');
    const useraddress = document.getElementById('useraddress');

    username.textContent = `${info[0]} ${info[1]}`;
    useremail.textContent = info[2];
    useraddress.textContent = info[3];
}

loadUserInfo()

