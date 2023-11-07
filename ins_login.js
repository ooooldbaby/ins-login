const crypto = require("crypto");
const nacl = require("tweetnacl")
const blakeks = require("blakejs")
const util = require("util")
// console.log(util)

var w = crypto.webcrypto;

var decodeUTF8 = function (a) {
    if (typeof a !== "string")
        throw new TypeError("expected string");
    var b;
    a = unescape(encodeURIComponent(a));
    var c = new Uint8Array(a.length);
    for (b = 0; b < a.length; b++)
        c[b] = a.charCodeAt(b);
    return c
}

function r(a) {
    var b = [];
    for (var c = 0; c < a.length; c += 2)
        b.push(parseInt(a.slice(c, c + 2), 16));
    return new Uint8Array(b)
}

function f_a(a, b) {
    var c = blakeks.blake2bInit(nacl.box.nonceLength, null);
    blakeks.blake2bUpdate(c, a);
    blakeks.blake2bUpdate(c, b);
    return blakeks.blake2bFinal(c)
}

function h_a(a) {
    for (var b = 0; b < a.length; b++)
        a[b] = 0
}

function q(a, b) {
    const e = nacl.box.keyPair();
    const c = new Uint8Array(48 + a.length);
    c.set(e.publicKey)

    var i = f_a(e.publicKey, b);
    a = nacl.box(a, i, b, e.secretKey);
    c.set(a, e.publicKey.length);
    h_a(e.secretKey);
    return c;
}

function tweetnacl_util(a) {
    var b, c = [], d = a.length;
    for (b = 0; b < d; b++)
        c.push(String.fromCharCode(a[b]));
    return btoa(c.join(""))
}

// function encrypt(password, date_time) {
//     var a = 196,
//         c = "dd45564759a910977c62bf5fd8c26fc88d14ccae6bed4a749efa7ffc804ed316",
//         g_start = "#PWD_INSTAGRAM_BROWSER",
//         b_start = b = Object.freeze({
//             FALLBACK_ENCRYPT: "9",
//             PLAINTEXT: "0",
//             ROTATED_ENCRYPT: "6"
//         }),
//         d = decodeUTF8(password),
//         e = decodeUTF8(date_time);
//     var g, h = 64, i = 1, j = 1, k = 1, l = 48, m = 2, n = 32, o = 16,
//         p = j + k + m + n + l + o;
//     var f = p + d.length;
//     if (c.length !== h)
//         throw new Error("public key is not a valid hex sting");
//     var s = r(c);
//     if (!s)
//         throw new Error("public key is not a valid hex string");
//     var t = new Uint8Array(f)
//         , u = 0;
//     t[u] = i;
//     u += j;
//     t[u] = a;
//     u += k;
//     c = {
//         length: n * 8,
//         name: "AES-GCM"
//     };
//     var v = {
//         additionalData: e,
//         iv: new Uint8Array(12),
//         name: "AES-GCM",
//         tagLen: o
//     }
//     return w.subtle.generateKey(c, !0, ["encrypt", "decrypt"]).then(function (a) {
//         var c = w.subtle.exportKey("raw", a);
//         a = w.subtle.encrypt(v, a, d.buffer);
//         console.log("c==>>", c)
//         console.log("a==>>", a)
//         return Promise.all([c, a])
//     }).then(function (a) {
//         var b = new Uint8Array(a[0]);
//         b = q(b, s);
//         t[u] = b.length & 255;
//         t[u + 1] = b.length >> 8 & 255;
//         u += m;
//         t.set(b, u);
//         u += n;
//         u += l;
//         if (b.length !== n + l)
//             throw new Error("encrypted key is the wrong length");
//         b = new Uint8Array(a[1]);
//         a = b.slice(-o);
//         b = b.slice(0, -o);
//         t.set(a, u);
//         u += o;
//         t.set(b, u);
//         console.log([g_start, "10", date_time, tweetnacl_util(t)].join(":"))
//         return tweetnacl_util(t);
//     })["catch"](function (a) {
//         throw a
//     })
// }

function encrypt(password) {
    var a = 196,
        c = "dd45564759a910977c62bf5fd8c26fc88d14ccae6bed4a749efa7ffc804ed316",
        g_start = "#PWD_INSTAGRAM_BROWSER",
        b_start = b = Object.freeze({
            FALLBACK_ENCRYPT: "9",
            PLAINTEXT: "0",
            ROTATED_ENCRYPT: "6"
        }),
        d = decodeUTF8(password),
        date_time = Math.floor(Date.now() / 1000),
        e = decodeUTF8(date_time.toString());
    var g, h = 64, i = 1, j = 1, k = 1, l = 48, m = 2, n = 32, o = 16,
        p = j + k + m + n + l + o;
    var f = p + d.length;
    if (c.length !== h)
        throw new Error("public key is not a valid hex sting");
    var s = r(c);
    if (!s)
        throw new Error("public key is not a valid hex string");
    var t = new Uint8Array(f)
        , u = 0;
    t[u] = i;
    u += j;
    t[u] = a;
    u += k;
    c = {
        length: n * 8,
        name: "AES-GCM"
    };
    var v = {
        additionalData: e,
        iv: new Uint8Array(12),
        name: "AES-GCM",
        tagLen: o
    };

    var key = w.subtle.generateKey(c, true, ["encrypt", "decrypt"]);
    var cPromise = key.then(function (a) {
        return w.subtle.exportKey("raw", a);
    });

    var aPromise = Promise.all([key, d.buffer]).then(function (values) {
        var a = values[0];
        var dataBuffer = values[1];
        return w.subtle.encrypt(v, a, dataBuffer);
    });

    var cResult, aResult;
    cPromise.then(function (result) {
        cResult = result;
    });
    aPromise.then(function (result) {
        aResult = result;
    });

    while (cResult === undefined || aResult === undefined) {
        require('deasync').runLoopOnce();
    }

    a = new Uint8Array(cResult);
    a = q(a, s);
    t[u] = a.length & 255;
    t[u + 1] = a.length >> 8 & 255;
    u += m;
    t.set(a, u);
    u += n;
    u += l;
    if (a.length !== n + l)
        throw new Error("encrypted key is the wrong length");
    var b = new Uint8Array(aResult);
    a = b.slice(-o);
    b = b.slice(0, -o);
    t.set(a, u);
    u += o;
    t.set(b, u);
    console.log([g_start, "10", date_time, tweetnacl_util(t)].join(":"));
    // return tweetnacl_util(t);
    return [g_start, "10", date_time, tweetnacl_util(t)].join(":")
}


module.exports = {
    encrypt
};
