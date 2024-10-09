function encrypt(str) {
    let shift = 10;
    let result = '';

    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        if (char >= 65 && char <= 90) {
            result += String.fromCharCode(((char - 65 + shift) % 26) + 65);
        }
        else if (char >= 97 && char <= 122) {
            result += String.fromCharCode(((char - 97 + shift) % 26) + 97);
        }
        else if (char >= 48 && char <= 57) {
            result += String.fromCharCode(((char - 48 + shift) % 10) + 48);
        }
        else {
            result += str.charAt(i);
        }
    }

    return result;
}

