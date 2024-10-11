// Hàm để mã hóa dữ liệu thành Base64URL
function base64UrlEncode(data) {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(data)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// Hàm để tạo JWT
async function createJWT(header, payload, secret) {
    const encoder = new TextEncoder();
    const encodedHeader = base64UrlEncode(encoder.encode(JSON.stringify(header)));
    const encodedPayload = base64UrlEncode(encoder.encode(JSON.stringify(payload)));

    const token = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(token)
    );

    const encodedSignature = base64UrlEncode(signature);

    return `${token}.${encodedSignature}`;
}

// Hàm để giải mã Base64URL
function base64UrlDecode(data) {
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    const pad = data.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        data += new Array(5 - pad).join('=');
    }
    return atob(data);
}

// Hàm để giải mã JWT
function decodeJWT(token) {
    const [header, payload, signature] = token.split('.');
    const decodedPayload = base64UrlDecode(payload);
    return JSON.parse(decodedPayload);
}
