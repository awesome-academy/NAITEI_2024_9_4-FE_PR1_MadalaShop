function formatCurrency(price) {
    return price.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });;
}

function parseCurrency(priceStr) {
    return priceStr.replace(/\./g, '')
        .replace('đ', '')
        .replace(/\s+/g, '')
}

function getAccount() {
    const token = sessionStorage.getItem('token');
    let account = '';
    if (token)
        account = decodeJWT(token).account.email;
    else
        account = null;

    return account;
}

function getAddress() {
    const token = sessionStorage.getItem('token');
    let address = '';
    if (token)
        address = decodeJWT(token).account.address;
    else
        address = null;

    return address;
}

function getInfo() {
    const token = sessionStorage.getItem('token');
    let email = '';
    let address = '';
    let lastname = '';
    let fristname = '';
    if (token) {
        const account = decodeJWT(token).account
        email = account.email;
        address = account.address;
        lastname = account.lastName;
        fristname = account.firstName;
    }
    else {
        email = null;
        address = null;
        lastname = null;
        fristname = null;
    }

    return [fristname, lastname, email, address];
}
